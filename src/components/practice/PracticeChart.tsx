// Precision replay chart for the Practice Lab.
// Renders ONLY the revealed candles (candles.slice(0, visible)) — future bars
// never enter the chart's data. Drawings live in an SVG overlay anchored to
// candle time + price so they stay attached while panning / zooming.

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Crosshair,
  Goal,
  Minus,
  MousePointer2,
  ShieldAlert,
  Spline,
  Trash2,
  X,
} from 'lucide-react';
import {
  CandlestickSeries,
  createChart,
  createSeriesMarkers,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type Logical,
  type MouseEventParams,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { fmtPrice, fmtTime, type Candle, type Interval } from '../../lib/market';
import type { Anchor, DrawKind, Drawing } from '../../lib/practice';
import '../../styles/practice-chart.css';

/** The browser's locale, if Intl accepts it (some systems report tags like "en-US@posix"). */
function safeLocale(): string {
  const tag = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  try {
    new Intl.NumberFormat(tag);
    new Intl.DateTimeFormat(tag);
    return tag;
  } catch {
    return 'en-US';
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface PracticeChartHandle {
  /** JPEG data URL of the chart + drawings overlay (≤ ~1400px wide). */
  screenshot(): string | null;
  /** Keep the newest revealed candle in view. */
  scrollToEnd(): void;
}

type Tool = DrawKind | 'cursor';
type LevelKind = 'entry' | 'stop' | 'target';

export interface PracticeChartProps {
  candles: Candle[];
  visible: number;
  interval: Interval;
  drawings: Drawing[];
  onDrawingsChange?: (d: Drawing[]) => void;
  tool: Tool;
  onToolChange?: (t: Tool) => void;
  onLevelPick?: (kind: LevelKind, price: number) => void;
  levels?: { entry?: number | null; stop?: number | null; target?: number | null };
  markers?: { t: number; kind: 'decision' | 'fill' | 'exit'; text: string; position?: 'above' | 'below' }[];
  readOnly?: boolean;
  height?: number | string;
}

// ─── Palette ───────────────────────────────────────────────────────────────

const C = {
  text: '#8f8a82',
  grid: 'rgba(236,228,214,0.04)',
  border: 'rgba(236,228,214,0.08)',
  cross: 'rgba(236,228,214,0.3)',
  crossLabel: '#24222a',
  up: '#e9e2d6',
  upWick: '#cfc6b8',
  down: '#5a5468',
  downWick: '#7a7388',
  volUp: 'rgba(233,226,214,0.13)',
  volDown: 'rgba(122,115,136,0.26)',
  entry: '#e9e2d6',
  stop: '#d99c9c',
  target: '#b9cfa8',
  hline: '#d8d4cc',
  support: '#d6bd8a',
  resistance: '#c4b9e6',
  trend: '#e9e2d6',
  champagne: '#d6bd8a',
  violet: '#c4b9e6',
  bg: '#0b0b0d',
};

const KIND_STYLE: Record<DrawKind, { color: string; dash?: number[]; width: number; label?: string; opacity: number }> = {
  trend: { color: C.trend, width: 1.4, opacity: 0.85 },
  hline: { color: C.hline, width: 1, opacity: 0.55 },
  support: { color: C.support, width: 1.2, label: 'S', opacity: 0.85 },
  resistance: { color: C.resistance, width: 1.2, label: 'R', opacity: 0.85 },
  entry: { color: C.entry, width: 1.2, label: 'ENTRY', opacity: 0.9 },
  stop: { color: C.stop, width: 1.2, dash: [5, 4], label: 'STOP', opacity: 0.9 },
  target: { color: C.target, width: 1.2, dash: [5, 4], label: 'TARGET', opacity: 0.9 },
};

const LEVEL_KINDS: LevelKind[] = ['entry', 'stop', 'target'];

const TOOLS: { key: Tool; label: string; Icon: typeof Minus }[] = [
  { key: 'cursor', label: 'Cursor', Icon: MousePointer2 },
  { key: 'trend', label: 'Trendline', Icon: Spline },
  { key: 'hline', label: 'Horizontal line', Icon: Minus },
  { key: 'support', label: 'Support', Icon: ArrowUpFromLine },
  { key: 'resistance', label: 'Resistance', Icon: ArrowDownToLine },
  { key: 'entry', label: 'Entry', Icon: Crosshair },
  { key: 'stop', label: 'Stop', Icon: ShieldAlert },
  { key: 'target', label: 'Target', Icon: Goal },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const ts = (t: number) => t as UTCTimestamp;

function precisionFor(p: number): number {
  const a = Math.abs(p);
  if (a >= 100) return 2;
  if (a >= 10) return 3;
  if (a >= 1) return 4;
  if (a >= 0.01) return 5;
  return 7;
}

/** Index of the last candle with time ≤ t (binary search). -1 if before all. */
function indexAtOrBefore(candles: Candle[], t: number): number {
  let lo = 0;
  let hi = candles.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (candles[mid].t <= t) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });

const toBar = (c: Candle) => ({ time: ts(c.t), open: c.o, high: c.h, low: c.l, close: c.c });
const toVol = (c: Candle) => ({ time: ts(c.t), value: c.v, color: c.c >= c.o ? C.volUp : C.volDown });

/** Geometry for one rendered line (shared by SVG overlay and screenshot). */
interface Shape {
  key: string;
  id: string | null; // drawing id (null for locked levels / previews)
  kind: DrawKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  full: boolean;
  level?: boolean;
  preview?: boolean;
}

function useIsMobile() {
  const q = '(max-width: 720px)';
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

// ─── Component ─────────────────────────────────────────────────────────────

export const PracticeChart = forwardRef<PracticeChartHandle, PracticeChartProps>(function PracticeChart(props, ref) {
  const {
    candles,
    visible,
    interval,
    drawings,
    onDrawingsChange,
    tool,
    onToolChange,
    onLevelPick,
    levels,
    markers,
    readOnly = false,
    height,
  } = props;

  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const n = Math.max(0, Math.min(visible, candles.length));
  const active = n > 0;

  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const levelScaleRef = useRef<{ entry: number | null; stop: number | null; target: number | null }>({ entry: null, stop: null, target: null });
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const dataRef = useRef<{ candles: Candle[] | null; shown: number }>({ candles: null, shown: 0 });

  const [tick, setTick] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [pending, setPending] = useState<Anchor | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected;

  // Latest props for long-lived chart handlers.
  const live = useRef({ candles, n, tool, drawings, onDrawingsChange, onToolChange, onLevelPick, readOnly, pending });
  live.current = { candles, n, tool, drawings, onDrawingsChange, onToolChange, onLevelPick, readOnly, pending };

  // rAF-throttled overlay redraw.
  const rafRef = useRef(0);
  const redraw = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      setTick((x) => x + 1);
    });
  }, []);

  // ── Create / destroy chart ───────────────────────────────────────────────
  useEffect(() => {
    if (!active || !hostRef.current) return;
    const host = hostRef.current;
    const chart = createChart(host, {
      localization: { locale: safeLocale() },
      width: host.clientWidth,
      height: host.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: C.text,
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        fontSize: 11,
        attributionLogo: true,
      },
      grid: { vertLines: { color: C.grid }, horzLines: { color: C.grid } },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: C.cross, width: 1, style: LineStyle.Dotted, labelBackgroundColor: C.crossLabel },
        horzLine: { color: C.cross, width: 1, style: LineStyle.Dotted, labelBackgroundColor: C.crossLabel },
      },
      rightPriceScale: { borderColor: C.border, scaleMargins: { top: 0.08, bottom: 0.22 } },
      timeScale: {
        borderColor: C.border,
        rightOffset: 6,
        barSpacing: 8,
        minBarSpacing: 1.5,
        shiftVisibleRangeOnNewBar: true,
        timeVisible: interval !== '1d',
        secondsVisible: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true, axisDoubleClickReset: true },
    });
    const candle = chart.addSeries(CandlestickSeries, {
      upColor: C.up,
      downColor: C.down,
      borderUpColor: C.up,
      borderDownColor: C.down,
      wickUpColor: C.upWick,
      wickDownColor: C.downWick,
      priceLineVisible: false,
      lastValueVisible: true,
      // Keep locked entry / stop / target inside the visible price range.
      autoscaleInfoProvider: (base: () => { priceRange: { minValue: number; maxValue: number } } | null) => {
        const res = base();
        const lv = [levelScaleRef.current.entry, levelScaleRef.current.stop, levelScaleRef.current.target].filter(
          (x): x is number => x != null && Number.isFinite(x),
        );
        if (!res || !lv.length) return res;
        return {
          ...res,
          priceRange: { minValue: Math.min(res.priceRange.minValue, ...lv), maxValue: Math.max(res.priceRange.maxValue, ...lv) },
        };
      },
    });
    const vol = chart.addSeries(HistogramSeries, {
      priceScaleId: 'vol',
      priceFormat: { type: 'volume' },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    chartRef.current = chart;
    candleRef.current = candle;
    volRef.current = vol;
    markersRef.current = createSeriesMarkers(candle, []);
    dataRef.current = { candles: null, shown: 0 };

    const onRange = () => redraw();
    chart.timeScale().subscribeVisibleLogicalRangeChange(onRange);
    chart.timeScale().subscribeSizeChange(onRange);

    const onMove = (p: MouseEventParams<Time>) => {
      const { n: count } = live.current;
      if (p.point && p.logical != null && count > 0) {
        const i = Math.round(p.logical);
        setHoverIdx(i >= 0 && i < count ? i : null);
        setPointer({ x: p.point.x, y: p.point.y });
      } else {
        setHoverIdx(null);
        setPointer(null);
      }
      redraw();
    };
    chart.subscribeCrosshairMove(onMove);

    const onClick = (p: MouseEventParams<Time>) => {
      const L = live.current;
      if (L.readOnly || !p.point) return;
      if (L.tool === 'cursor') {
        setSelected(null);
        return;
      }
      const price = candle.coordinateToPrice(p.point.y);
      if (price == null || L.n === 0) return;
      const logical = p.logical ?? chart.timeScale().coordinateToLogical(p.point.x);
      const idx = Math.max(0, Math.min(L.n - 1, Math.round(logical ?? L.n - 1)));
      const prec = precisionFor(price);
      const anchor: Anchor = { t: L.candles[idx].t, p: +price.toFixed(prec) };
      const emit = (d: Drawing[]) => L.onDrawingsChange?.(d);

      if (L.tool === 'trend') {
        if (!L.pending) {
          setPending(anchor);
          return;
        }
        const id = uid();
        emit([...L.drawings, { id, kind: 'trend', a: L.pending, b: anchor }]);
        setPending(null);
        setSelected(id);
        L.onToolChange?.('cursor');
        return;
      }
      const kind = L.tool;
      const id = uid();
      const keep = LEVEL_KINDS.includes(kind as LevelKind) ? L.drawings.filter((d) => d.kind !== kind) : L.drawings;
      emit([...keep, { id, kind, a: anchor }]);
      if (LEVEL_KINDS.includes(kind as LevelKind)) L.onLevelPick?.(kind as LevelKind, anchor.p);
      setSelected(id);
      L.onToolChange?.('cursor');
    };
    chart.subscribeClick(onClick);

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w > 0 && h > 0) chart.resize(w, h);
      redraw();
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(onRange);
      chart.timeScale().unsubscribeSizeChange(onRange);
      chart.unsubscribeCrosshairMove(onMove);
      chart.unsubscribeClick(onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      markersRef.current?.detach();
      markersRef.current = null;
      priceLinesRef.current = [];
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volRef.current = null;
      dataRef.current = { candles: null, shown: 0 };
    };
  }, [active, redraw]);

  // ── Interval → time axis format ──────────────────────────────────────────
  useEffect(() => {
    chartRef.current?.applyOptions({ timeScale: { timeVisible: interval !== '1d', secondsVisible: false } });
  }, [interval, active]);

  // ── Data sync (append with update, rebuild with setData) ─────────────────
  useEffect(() => {
    const chart = chartRef.current;
    const cs = candleRef.current;
    const vs = volRef.current;
    if (!chart || !cs || !vs || n === 0) return;
    const prev = dataRef.current;
    const ts_ = chart.timeScale();
    const range = ts_.getVisibleLogicalRange();
    const wasAtEnd = !range || range.to >= prev.shown - 1.5;
    const sameSeries = prev.candles === candles;
    const grow = n - prev.shown;

    if (sameSeries && grow === 0) return;

    if (sameSeries && grow > 0 && grow <= 12 && prev.shown > 0) {
      for (let i = prev.shown; i < n; i++) {
        cs.update(toBar(candles[i]));
        vs.update(toVol(candles[i]));
      }
    } else {
      const slice = candles.slice(0, n);
      const prec = precisionFor(slice[slice.length - 1].c);
      cs.applyOptions({ priceFormat: { type: 'price', precision: prec, minMove: 1 / 10 ** prec } });
      cs.setData(slice.map(toBar));
      vs.setData(slice.map(toVol));
    }
    dataRef.current = { candles, shown: n };

    if (!sameSeries || prev.shown === 0) {
      // Fresh session: frame the latest ~90 bars.
      ts_.setVisibleLogicalRange({ from: Math.max(-2, n - 90), to: n + 5 });
    } else if (wasAtEnd) {
      const r = ts_.getVisibleLogicalRange();
      if (r && r.to < n - 1 + 2) {
        const span = r.to - r.from;
        ts_.setVisibleLogicalRange({ from: n + 5 - span, to: n + 5 });
      }
    }
    redraw();
  }, [candles, n, redraw]);

  // ── Locked levels → native price lines (axis labels) ─────────────────────
  const entryL = levels?.entry ?? null;
  const stopL = levels?.stop ?? null;
  const targetL = levels?.target ?? null;
  levelScaleRef.current = { entry: entryL, stop: stopL, target: targetL };
  useEffect(() => {
    const cs = candleRef.current;
    if (!cs) return;
    for (const pl of priceLinesRef.current) cs.removePriceLine(pl);
    priceLinesRef.current = [];
    const defs: [LevelKind, number | null, string][] = [
      ['entry', entryL, 'ENTRY'],
      ['stop', stopL, 'STOP'],
      ['target', targetL, 'TARGET'],
    ];
    for (const [k, price, title] of defs) {
      if (price == null || !Number.isFinite(price)) continue;
      priceLinesRef.current.push(
        cs.createPriceLine({
          price,
          color: KIND_STYLE[k].color,
          lineWidth: 1,
          lineStyle: k === 'entry' ? LineStyle.Solid : LineStyle.Dashed,
          lineVisible: false, // the line itself is drawn (and animated) in the overlay
          axisLabelVisible: true,
          title,
          axisLabelColor: KIND_STYLE[k].color,
          axisLabelTextColor: '#141317',
        }),
      );
    }
    cs.priceScale().applyOptions({ autoScale: true }); // re-fit so new levels are in view
    redraw();
  }, [entryL, stopL, targetL, active, redraw]);

  // ── Markers (never beyond the revealed range) ────────────────────────────
  useEffect(() => {
    const mp = markersRef.current;
    if (!mp) return;
    const revealed = candles.slice(0, n);
    const out: SeriesMarker<Time>[] = [];
    for (const m of markers ?? []) {
      const i = indexAtOrBefore(revealed, m.t);
      if (i < 0) continue;
      const pos = m.position ?? (m.kind === 'fill' ? 'below' : 'above');
      const shape =
        m.kind === 'decision' ? 'circle' : m.kind === 'exit' ? 'square' : pos === 'below' ? 'arrowUp' : 'arrowDown';
      const color = m.kind === 'decision' ? C.champagne : m.kind === 'fill' ? C.up : C.violet;
      out.push({
        time: ts(revealed[i].t),
        position: pos === 'below' ? 'belowBar' : 'aboveBar',
        shape,
        color,
        text: m.text,
        size: m.kind === 'decision' ? 0.6 : 0.75,
      });
    }
    out.sort((a, b) => (a.time as number) - (b.time as number));
    mp.setMarkers(out);
  }, [markers, candles, n, active]);

  // ── Keyboard: Esc → cursor, Delete removes selection ─────────────────────
  useEffect(() => {
    if (!active || readOnly) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const L = live.current;
      if (e.key === 'Escape') {
        if (L.pending) setPending(null);
        if (L.tool !== 'cursor') L.onToolChange?.('cursor');
        setSelected(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedRef.current) {
        e.preventDefault();
        const id = selectedRef.current;
        L.onDrawingsChange?.(L.drawings.filter((d) => d.id !== id));
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, readOnly]);
  // Drop pending trend anchor when switching tools.
  useEffect(() => {
    if (tool !== 'trend') setPending(null);
    if (tool !== 'cursor') setSelected(null);
  }, [tool]);

  // Drop selection if the drawing disappeared.
  useEffect(() => {
    if (selected && !drawings.some((d) => d.id === selected)) setSelected(null);
  }, [drawings, selected]);

  useEffect(() => {
    if (!confirmClear) return;
    const id = window.setTimeout(() => setConfirmClear(false), 3000);
    return () => window.clearTimeout(id);
  }, [confirmClear]);

  // ── Geometry ─────────────────────────────────────────────────────────────
  const computeShapes = useCallback((): { shapes: Shape[]; w: number; h: number } => {
    const chart = chartRef.current;
    const cs = candleRef.current;
    if (!chart || !cs) return { shapes: [], w: 0, h: 0 };
    const size = chart.paneSize(0);
    const w = size.width;
    const h = size.height;
    const tsApi = chart.timeScale();
    const xAt = (t: number) => {
      const i = indexAtOrBefore(candles, t);
      if (i < 0) return null;
      return tsApi.logicalToCoordinate(i as Logical) as number | null;
    };
    const yAt = (p: number) => cs.priceToCoordinate(p) as number | null;
    const shapes: Shape[] = [];
    const lvl = { entry: entryL, stop: stopL, target: targetL };

    for (const d of drawings) {
      if (LEVEL_KINDS.includes(d.kind as LevelKind)) {
        const lp = lvl[d.kind as LevelKind];
        if (lp != null && Math.abs(lp - d.a.p) <= Math.abs(lp) * 1e-9 + 1e-12) continue; // locked level draws it
      }
      if (d.kind === 'trend' && d.b) {
        const x1 = xAt(d.a.t);
        const x2 = xAt(d.b.t);
        const y1 = yAt(d.a.p);
        const y2 = yAt(d.b.p);
        if (x1 == null || x2 == null || y1 == null || y2 == null) continue;
        shapes.push({ key: d.id, id: d.id, kind: 'trend', x1, y1, x2, y2, full: false });
      } else {
        const y = yAt(d.a.p);
        if (y == null) continue;
        shapes.push({ key: d.id, id: d.id, kind: d.kind, x1: 0, y1: y, x2: w, y2: y, full: true });
      }
    }
    for (const k of LEVEL_KINDS) {
      const p = lvl[k];
      if (p == null) continue;
      const y = yAt(p);
      if (y == null) continue;
      shapes.push({ key: `lvl-${k}-${p}`, id: null, kind: k, x1: 0, y1: y, x2: w, y2: y, full: true, level: true });
    }
    if (pending && pointer && tool === 'trend') {
      const x1 = xAt(pending.t);
      const y1 = yAt(pending.p);
      if (x1 != null && y1 != null)
        shapes.push({ key: 'preview', id: null, kind: 'trend', x1, y1, x2: pointer.x, y2: pointer.y, full: false, preview: true });
    }
    return { shapes, w, h };
  }, [candles, drawings, entryL, stopL, targetL, pending, pointer, tool]);

  // tick is read so the overlay recomputes on range/size changes.
  const geom = useMemo(() => (tick >= 0 ? computeShapes() : { shapes: [], w: 0, h: 0 }), [computeShapes, tick]);

  // ── Imperative handle ────────────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      screenshot() {
        const chart = chartRef.current;
        const host = hostRef.current;
        if (!chart || !host) return null;
        try {
          const base = chart.takeScreenshot();
          const scale = base.width / Math.max(1, host.clientWidth);
          const full = document.createElement('canvas');
          full.width = base.width;
          full.height = base.height;
          const ctx = full.getContext('2d');
          if (!ctx) return null;
          ctx.fillStyle = C.bg;
          ctx.fillRect(0, 0, full.width, full.height);
          ctx.drawImage(base, 0, 0);
          const { shapes, w, h } = computeShapes();
          ctx.save();
          ctx.scale(scale, scale);
          ctx.beginPath();
          ctx.rect(0, 0, w, h);
          ctx.clip();
          for (const s of shapes) {
            if (s.preview) continue;
            const st = KIND_STYLE[s.kind];
            ctx.globalAlpha = st.opacity;
            ctx.strokeStyle = st.color;
            ctx.lineWidth = st.width;
            ctx.setLineDash(st.dash ?? []);
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
            if (s.kind === 'trend') {
              ctx.setLineDash([]);
              ctx.fillStyle = st.color;
              for (const [x, y] of [
                [s.x1, s.y1],
                [s.x2, s.y2],
              ]) {
                ctx.beginPath();
                ctx.arc(x, y, 2.4, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            if (st.label) {
              ctx.globalAlpha = 1;
              ctx.font = "500 10px 'JetBrains Mono', ui-monospace, monospace";
              ctx.fillStyle = st.color;
              ctx.fillText(st.label, 8, s.y1 - 5);
            }
          }
          ctx.restore();
          let out: HTMLCanvasElement = full;
          const maxW = 1400;
          if (full.width > maxW) {
            const r = maxW / full.width;
            const small = document.createElement('canvas');
            small.width = maxW;
            small.height = Math.round(full.height * r);
            const sctx = small.getContext('2d');
            if (sctx) {
              sctx.imageSmoothingQuality = 'high';
              sctx.drawImage(full, 0, 0, small.width, small.height);
              out = small;
            }
          }
          return out.toDataURL('image/jpeg', 0.82);
        } catch {
          return null;
        }
      },
      scrollToEnd() {
        const chart = chartRef.current;
        if (!chart) return;
        const count = dataRef.current.shown;
        const ts_ = chart.timeScale();
        const r = ts_.getVisibleLogicalRange();
        const span = r ? r.to - r.from : 90;
        ts_.setVisibleLogicalRange({ from: count + 5 - span, to: count + 5 });
      },
    }),
    [computeShapes],
  );

  // ── Render ───────────────────────────────────────────────────────────────
  const h = height ?? (isMobile ? 380 : 520);
  if (!active) return null;

  const readIdx = hoverIdx ?? n - 1;
  const rc = candles[readIdx];
  const prevC = readIdx > 0 ? candles[readIdx - 1] : null;
  const chg = rc && prevC ? ((rc.c - prevC.c) / prevC.c) * 100 : null;

  const del = (id: string) => {
    onDrawingsChange?.(drawings.filter((d) => d.id !== id));
    setSelected(null);
  };

  const interactive = !readOnly && tool === 'cursor';
  const selShape = selected ? geom.shapes.find((s) => s.id === selected) : undefined;

  return (
    <motion.div
      className={`pc-root${!readOnly && tool !== 'cursor' ? ' is-drawing' : ''}`}
      style={{ height: h } as CSSProperties}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={hostRef} className="pc-host" />

      <svg
        className={`pc-overlay${reduce ? ' no-motion' : ''}`}
        width={geom.w}
        height={geom.h}
        viewBox={`0 0 ${Math.max(1, geom.w)} ${Math.max(1, geom.h)}`}
        aria-hidden
      >
        {geom.shapes.map((s) => {
          const st = KIND_STYLE[s.kind];
          const isSel = s.id != null && s.id === selected;
          const dash = st.dash?.join(' ');
          return (
            <g
              key={s.key}
              className={`pc-shape${s.level ? ' pc-level' : ''}${isSel ? ' is-sel' : ''}${s.preview ? ' is-preview' : ''}`}
              style={{ color: st.color }}
            >
              {interactive && s.id && (
                <line
                  className="pc-hit"
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setSelected(s.id);
                  }}
                />
              )}
              <line
                className="pc-line"
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="currentColor"
                strokeOpacity={isSel ? 1 : st.opacity}
                strokeWidth={isSel ? st.width + 0.8 : st.width}
                strokeDasharray={s.preview ? '3 4' : dash}
                vectorEffect="non-scaling-stroke"
              />
              {s.kind === 'trend' && !s.preview && (
                <>
                  <circle cx={s.x1} cy={s.y1} r={isSel ? 3.4 : 2.4} fill="currentColor" />
                  <circle cx={s.x2} cy={s.y2} r={isSel ? 3.4 : 2.4} fill="currentColor" />
                </>
              )}
              {st.label && s.full && (
                <text className="pc-label" x={8} y={s.y1 - 5} fill="currentColor">
                  {st.label}
                </text>
              )}
            </g>
          );
        })}
        {pending && tool === 'trend' && (() => {
          const s = geom.shapes.find((x) => x.preview);
          return s ? <circle cx={s.x1} cy={s.y1} r={3} fill={C.trend} /> : null;
        })()}
      </svg>

      {selShape && !readOnly && (
        <button
          type="button"
          className="pc-del"
          style={{
            left: Math.min(geom.w - 26, Math.max(4, selShape.full ? geom.w - 30 : Math.max(selShape.x1, selShape.x2) + 8)),
            top: Math.min(geom.h - 24, Math.max(4, (selShape.full ? selShape.y1 : selShape.x2 >= selShape.x1 ? selShape.y2 : selShape.y1) - 22)),
          }}
          onClick={() => del(selShape.id!)}
          title="Remove drawing (Delete)"
          aria-label="Remove drawing"
        >
          <X size={12} strokeWidth={1.8} />
        </button>
      )}

      {!readOnly && (
        <div className="pc-toolbar" role="toolbar" aria-label="Drawing tools">
          {TOOLS.map(({ key, label, Icon }, i) => (
            <span key={key} className="pc-tool-wrap">
              {(i === 1 || i === 5) && <span className="pc-sep" aria-hidden />}
              <button
                type="button"
                className={`pc-tool${tool === key ? ' on' : ''} pc-k-${key}`}
                onClick={() => onToolChange?.(key)}
                aria-label={label}
                aria-pressed={tool === key}
                data-tip={label}
              >
                <Icon size={14} strokeWidth={1.6} />
              </button>
            </span>
          ))}
          <span className="pc-sep" aria-hidden />
          <button
            type="button"
            className={`pc-tool pc-clear${confirmClear ? ' confirm' : ''}`}
            disabled={!drawings.length}
            onClick={() => {
              if (!confirmClear) {
                setConfirmClear(true);
                return;
              }
              setConfirmClear(false);
              setPending(null);
              setSelected(null);
              onDrawingsChange?.([]);
            }}
            aria-label={confirmClear ? 'Click again to clear all drawings' : 'Clear drawings'}
            data-tip={confirmClear ? 'Click again to clear' : 'Clear drawings'}
          >
            {confirmClear ? <span className="pc-clear-txt">Clear?</span> : <Trash2 size={14} strokeWidth={1.6} />}
          </button>
        </div>
      )}

      {rc && (
        <div className="pc-readout" aria-live="off">
          <span className="pc-ro-time">{fmtTime(rc.t, interval)}</span>
          <span>
            <i>O</i>
            {fmtPrice(rc.o)}
          </span>
          <span>
            <i>H</i>
            {fmtPrice(rc.h)}
          </span>
          <span>
            <i>L</i>
            {fmtPrice(rc.l)}
          </span>
          <span>
            <i>C</i>
            <b className={rc.c >= rc.o ? 'up' : 'down'}>{fmtPrice(rc.c)}</b>
          </span>
          {chg != null && Number.isFinite(chg) && (
            <span className={chg >= 0 ? 'up' : 'down'}>
              {chg >= 0 ? '+' : ''}
              {chg.toFixed(2)}%
            </span>
          )}
          <span>
            <i>V</i>
            {compact.format(rc.v)}
          </span>
        </div>
      )}

      {pending && tool === 'trend' && <div className="pc-hint">Click a second point to finish the trendline · Esc to cancel</div>}
    </motion.div>
  );
});

PracticeChart.displayName = 'PracticeChart';

export default PracticeChart;
