import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, ImagePlus, X } from 'lucide-react';
import { fileToDataUrl } from '../lib/images';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export { cx };

// ─── Panel ─────────────────────────────────────────────────────────────────

export function Panel({
  title,
  sub,
  actions,
  className,
  hud,
  glow,
  pad = true,
  onClick,
  children,
  style,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
  hud?: boolean;
  glow?: boolean;
  pad?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={cx('glass', pad && 'pad', hud && 'hud', glow && 'glow', onClick && 'interactive', className)}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {(title || actions) && (
        <div className="panel-title">
          <span>
            {title}
            {sub && <span className="sub"> · {sub}</span>}
          </span>
          {actions && <div className="row gap-4" onClick={(e) => e.stopPropagation()}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ─── Page header ───────────────────────────────────────────────────────────

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 style={{ marginTop: eyebrow ? 8 : 0 }}>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  );
}

// ─── CountUp ───────────────────────────────────────────────────────────────

export function CountUp({
  value,
  decimals = 0,
  duration = 1100,
  prefix = '',
  suffix = '',
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (value - a) * eased;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value, duration, reduce]);
  return (
    <span className="num">
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ─── RingMeter ─────────────────────────────────────────────────────────────

export function RingMeter({
  value,
  size = 64,
  stroke = 4,
  color,
  label,
  showValue = true,
  ticks = false,
  children,
  delay = 0,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string;
  label?: ReactNode;
  showValue?: boolean;
  ticks?: boolean;
  children?: ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const v = Math.min(1, Math.max(0, value || 0));
  const r = (size - stroke) / 2 - (ticks ? 4 : 0);
  const c = 2 * Math.PI * r;
  const id = useId().replace(/:/g, '');
  return (
    <div className="ring-meter" style={{ width: size }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={`rg-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color ?? '#c4b9e6'} stopOpacity={color ? 0.6 : 0.95} />
              <stop offset="100%" stopColor={color ?? '#ecdcb6'} />
            </linearGradient>
            <filter id={`rf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {ticks && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 1.5}
              fill="none"
              stroke="rgba(214, 208, 198,0.22)"
              strokeWidth="2"
              strokeDasharray={`1 ${(2 * Math.PI * (size / 2 - 1.5)) / 48 - 1}`}
            />
          )}
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(214, 208, 198,0.1)" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#rg-${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            filter={`url(#rf-${id})`}
            initial={{ strokeDashoffset: reduce ? c * (1 - v) : c }}
            animate={{ strokeDashoffset: c * (1 - v) }}
            transition={{ duration: reduce ? 0 : 1.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          {children ??
            (showValue && (
              <span className="display" style={{ fontWeight: 200, fontSize: Math.max(12, size * 0.26), color: 'var(--text)' }}>
                <CountUp value={Math.round(v * 100)} />
                <span style={{ fontSize: '0.6em', color: 'var(--muted)' }}>%</span>
              </span>
            ))}
        </div>
      </div>
      {label && (
        <div className="stat-label center" style={{ marginTop: 6, fontSize: 11.5 }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Segmented progress bar ────────────────────────────────────────────────

export function SegBar({ value, segments = 20, height }: { value: number; segments?: number; height?: number }) {
  const on = Math.round(Math.min(1, Math.max(0, value)) * segments);
  return (
    <div className="seg-bar" style={height ? { height } : undefined} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} className={i < on ? 'on' : ''} style={{ transitionDelay: `${i * 18}ms` }} />
      ))}
    </div>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="bar">
      <i style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} />
    </div>
  );
}

// ─── Holographic checkbox ──────────────────────────────────────────────────

export function HoloCheck({
  checked,
  onChange,
  size,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  size?: 'lg';
  disabled?: boolean;
  label?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cx('holo-check', checked && 'on', size)}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!checked);
      }}
      whileTap={reduce ? undefined : { scale: 0.82 }}
      animate={checked && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: 'easeOut' }}
        />
      </svg>
      {checked && !reduce && (
        <motion.span
          key="burst"
          initial={{ opacity: 0.8, scale: 0.6 }}
          animate={{ opacity: 0, scale: 1.9 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(236,228,214,0.6)', pointerEvents: 'none' }}
        />
      )}
    </motion.button>
  );
}

// ─── Form helpers ──────────────────────────────────────────────────────────

export function Field({ label, hint, children, className }: { label: ReactNode; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cx('field', className)}>
      <span className="label">
        {label}
        {hint && <span className="hint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  suffix,
}: {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="field">
      <span className="label">
        {label}
        <span className="mono cyan" style={{ fontSize: 15, letterSpacing: 0 }}>
          {value}
          {suffix ?? `/${max}`}
        </span>
      </span>
      <input
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--val' as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function SegControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg-control" role="tablist">
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Number input that stores `null` for empty. */
export function NumberInput({
  value,
  onChange,
  placeholder,
  step = 'any',
}: {
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  placeholder?: string;
  step?: string;
}) {
  const [text, setText] = useState(value == null ? '' : String(value));
  useEffect(() => {
    const parsed = text.trim() === '' ? null : Number(text);
    if (parsed !== value && !(Number.isNaN(parsed) && value == null)) setText(value == null ? '' : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      className="input num"
      inputMode="decimal"
      type="number"
      step={step}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const v = e.target.value.trim() === '' ? null : Number(e.target.value);
        onChange(v == null || Number.isNaN(v) ? null : v);
      }}
    />
  );
}

// ─── Stat ──────────────────────────────────────────────────────────────────

export function Stat({
  label,
  value,
  note,
  size,
  tone,
}: {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  size?: 'sm' | 'xl';
  tone?: 'good' | 'bad' | 'warn';
}) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className={cx('stat-value', size)} style={tone ? { color: `var(--${tone})` } : undefined}>
        {value}
      </span>
      {note && <span className="stat-note">{note}</span>}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon}
      <h4>{title}</h4>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

// ─── Simulation banner ─────────────────────────────────────────────────────

export function SimBanner({ text }: { text?: ReactNode }) {
  return (
    <div className="sim-banner" role="note">
      <AlertTriangle size={16} />
      SIMULATION / PAPER TRADING
      <span>
        {text ?? 'Educational practice only — no real money. Results here are simulated and are not financial advice.'}
      </span>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  wide,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  wide?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            className={cx('glass hud modal', wide && 'wide')}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h3>{title}</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            {children}
            {footer && <div className="modal-foot">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Image attachments ─────────────────────────────────────────────────────

export function ImageAttach({
  images,
  onChange,
  max = 6,
  label = 'Add chart',
}: {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  const add = async (files: FileList | File[] | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, max - images.length);
    if (!list.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(list.map((f) => fileToDataUrl(f)));
      onChange([...images, ...urls]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="thumbs"
      onPaste={(e) => {
        const files = Array.from(e.clipboardData.files);
        if (files.length) {
          e.preventDefault();
          void add(files);
        }
      }}
    >
      {images.map((src, i) => (
        <div key={i} className="thumb" onClick={() => setZoom(src)}>
          <img src={src} alt={`Attachment ${i + 1}`} />
          <button
            type="button"
            className="x"
            aria-label="Remove image"
            onClick={(e) => {
              e.stopPropagation();
              onChange(images.filter((_, j) => j !== i));
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
      {images.length < max && (
        <button
          type="button"
          className={cx('dropzone', drag && 'drag')}
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void add(e.dataTransfer.files);
          }}
          style={{ flexDirection: 'column', gap: 2, background: 'transparent' }}
        >
          <ImagePlus size={16} />
          {busy ? 'Processing…' : label}
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void add(e.target.files);
          e.target.value = '';
        }}
      />
      {zoom &&
        createPortal(
          <div className="lightbox" onClick={() => setZoom(null)}>
            <img src={zoom} alt="Attachment preview" />
          </div>,
          document.body,
        )}
    </div>
  );
}

/** Read-only thumbnails with lightbox. */
export function Thumbs({ images }: { images: string[] }) {
  const [zoom, setZoom] = useState<string | null>(null);
  if (!images?.length) return null;
  return (
    <div className="thumbs">
      {images.map((src, i) => (
        <div key={i} className="thumb" onClick={(e) => (e.stopPropagation(), setZoom(src))}>
          <img src={src} alt={`Attachment ${i + 1}`} />
        </div>
      ))}
      {zoom &&
        createPortal(
          <div className="lightbox" onClick={() => setZoom(null)}>
            <img src={zoom} alt="Attachment preview" />
          </div>,
          document.body,
        )}
    </div>
  );
}

// ─── Page transition wrapper ───────────────────────────────────────────────

export function PageFade({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={reduce ? undefined : { opacity: 0, y: -10, scale: 1.01, filter: 'blur(6px)', transition: { duration: 0.22 } }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered reveal for lists of panels. */
export const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } }),
};
