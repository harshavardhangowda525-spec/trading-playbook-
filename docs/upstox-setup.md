# Optional: real NSE ETF candles from Upstox

The ETF module works with CSV imports out of the box. This connector adds a
"Fetch from Upstox" button to **Trading → Import historical data**. It fetches
historical 1/5/15-minute candles for the NSE ETFs on the allow-list.

Your Upstox token is stored **only** as a Supabase secret on your own
function. It is never in the website code, the repository or your browser.
The function is read-only: it fetches candles and cannot place orders.

## What you need
- An Upstox account (free to open).
- This app's Supabase project, set up as described in the README under "Data & accounts". Cloud accounts must be enabled, because only signed-in users can call the function.
- The [Supabase CLI](https://supabase.com/docs/guides/cli).

## Steps
1. **Create a read-only Analytics Token.** In Upstox, go to *Developer Apps → Analytics Token* and generate the token.
   - It is read-only and valid for about a year.
   - See https://upstox.com/developer/api-documentation/analytics-token/
2. **Log in and link your project.** From the repository folder:
   ```bash
   supabase login
   supabase link --project-ref YOUR-PROJECT-REF
   ```
3. **Store the token as a secret.** It stays on Supabase and is never committed:
   ```bash
   supabase secrets set UPSTOX_ANALYTICS_TOKEN=paste-your-token-here
   ```
4. **Deploy the function:**
   ```bash
   supabase functions deploy etf-candles
   ```
5. **Fetch data.** In the app, sign in and open *Trading → Import historical data → Fetch real NSE ETF history*. Pick an ETF, a timeframe and a date range, then press **Fetch & save**.

## Limits and notes
- **Request size:** one request covers up to 186 days. The function fetches it in 28-day chunks, because Upstox serves minute candles about one month per call.
  - Minute history goes back to January 2022, according to the Upstox v3 documentation.
- **Not yet confirmed (could not test from the build environment):**
  - that NSE ETFs return data from this endpoint;
  - the exact rate limits.

  If a fetch fails, the app shows the error and does not substitute any data.
- **Instrument lookup:** keys come from Upstox's public instrument file (`NSE.json.gz`). If a symbol isn't found, the request can include `instrumentKey` directly (`NSE_EQ|<ISIN>`).
- **Licensing:** use the data for your personal study only and respect Upstox's terms. Fetched candles are saved to *your* workspace, and the app never redistributes them.
- **Token expiry:** to rotate or revoke the token, generate a new one in Upstox and run step 3 again.
