// Supabase Edge Function: historical ETF candles from the Upstox Historical
// Candle API (v3), for the ETF day-trading module.
//
// • The Upstox token lives ONLY here, as the secret UPSTOX_ANALYTICS_TOKEN
//   (a read-only Analytics Token from your Upstox Developer Apps page).
// • Read-only: this function can fetch candles and nothing else. It never
//   places, modifies or cancels orders.
// • Only signed-in users of your app may call it, and only for ETFs on the
//   allow-list below.
//
// Deploy:  supabase functions deploy etf-candles
// Secret:  supabase secrets set UPSTOX_ANALYTICS_TOKEN=...
import { createClient } from 'npm:@supabase/supabase-js@2';

const ALLOWED = new Set(['NIFTYBEES', 'JUNIORBEES', 'BANKBEES', 'ITBEES', 'PSUBNKBEES', 'CPSEETF', 'MID150BEES', 'GOLDBEES', 'SILVERBEES', 'MON100']);
const INTERVALS = new Set([1, 5, 15]);
const MAX_DAYS = 186;
const INSTRUMENTS_URL = 'https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

let instrumentCache: Map<string, string> | null = null;

/** Map NSE trading symbols to Upstox instrument keys (NSE_EQ|<ISIN>) from Upstox's public instrument file. */
async function instrumentKey(symbol: string): Promise<string | null> {
  if (!instrumentCache) {
    const res = await fetch(INSTRUMENTS_URL);
    if (!res.ok || !res.body) throw new Error(`Instrument list unavailable (${res.status})`);
    const text = await new Response(res.body.pipeThrough(new DecompressionStream('gzip'))).text();
    const rows = JSON.parse(text) as { segment?: string; trading_symbol?: string; instrument_key?: string }[];
    instrumentCache = new Map(rows.filter((r) => r.segment === 'NSE_EQ' && r.trading_symbol && r.instrument_key).map((r) => [r.trading_symbol!, r.instrument_key!]));
  }
  return instrumentCache.get(symbol) ?? null;
}

const isDay = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const addDays = (d: string, n: number) => new Date(Date.parse(d + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  // Only signed-in users of this project.
  const auth = req.headers.get('Authorization') ?? '';
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: user } = await sb.auth.getUser();
  if (!user?.user) return json({ error: 'Sign in to the app to fetch market data.' }, 401);

  const token = Deno.env.get('UPSTOX_ANALYTICS_TOKEN');
  if (!token) return json({ error: 'UPSTOX_ANALYTICS_TOKEN secret is not set on this function.' }, 500);

  let body: { symbol?: string; interval?: number; from?: string; to?: string; instrumentKey?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  const symbol = String(body.symbol ?? '').toUpperCase();
  const interval = Number(body.interval);
  if (!ALLOWED.has(symbol)) return json({ error: `${symbol || 'Symbol'} is not on the ETF allow-list.` }, 400);
  if (!INTERVALS.has(interval)) return json({ error: 'Interval must be 1, 5 or 15 minutes.' }, 400);
  if (!isDay(body.from) || !isDay(body.to) || body.from > body.to) return json({ error: 'from/to must be YYYY-MM-DD with from ≤ to.' }, 400);
  const spanDays = (Date.parse(body.to) - Date.parse(body.from)) / 86400000;
  if (spanDays > MAX_DAYS) return json({ error: `Request at most ${MAX_DAYS} days at a time.` }, 400);

  let key: string | null = null;
  try {
    key = body.instrumentKey && /^NSE_EQ\|[A-Z0-9]{12}$/.test(body.instrumentKey) ? body.instrumentKey : await instrumentKey(symbol);
  } catch (e) {
    return json({ error: `Could not resolve the instrument: ${(e as Error).message}` }, 502);
  }
  if (!key) return json({ error: `No NSE_EQ instrument found for ${symbol}.` }, 404);

  // Minute candles are served at most ~1 month per request — fetch in chunks.
  const candles: unknown[][] = [];
  for (let start = body.from; start <= body.to; start = addDays(start, 28)) {
    const end = addDays(start, 27) < body.to ? addDays(start, 27) : body.to;
    const url = `https://api.upstox.com/v3/historical-candle/${encodeURIComponent(key)}/minutes/${interval}/${end}/${start}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } });
    if (res.status === 429) return json({ error: 'Upstox rate limit reached — wait a minute and try a shorter range.' }, 429);
    if (!res.ok) return json({ error: `Upstox returned ${res.status}: ${(await res.text()).slice(0, 200)}` }, 502);
    const payload = (await res.json()) as { data?: { candles?: unknown[][] } };
    candles.push(...(payload.data?.candles ?? []));
    await new Promise((r) => setTimeout(r, 250)); // be gentle with rate limits
  }
  return json({
    symbol,
    instrumentKey: key,
    interval,
    from: body.from,
    to: body.to,
    // [ISO timestamp (+05:30), open, high, low, close, volume, open interest]
    candles,
    source: 'Upstox Historical Candle API v3',
    fetchedAt: new Date().toISOString(),
  });
});
