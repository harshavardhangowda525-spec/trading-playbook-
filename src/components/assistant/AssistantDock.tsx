import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { AssistantChat } from './AssistantChat';
import '../../styles/assistant.css';

/** Floating "Ask AI" button with a chat panel, on every page except the full Ask AI page. */
export function AssistantDock() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const onAskPage = pathname.startsWith('/trading/ask');

  // The full Ask AI page replaces the panel.
  useEffect(() => {
    if (onAskPage) setOpen(false);
  }, [onAskPage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (onAskPage) return null;
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-dock-panel glass"
            role="dialog"
            aria-label="AI Coach"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <AssistantChat variant="dock" onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={`ai-fab${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close AI Coach' : 'Ask AI Coach'}
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span>{open ? 'Close' : 'Ask AI'}</span>
      </button>
    </>
  );
}
