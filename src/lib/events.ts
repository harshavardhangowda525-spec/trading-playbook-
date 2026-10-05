// Tiny event bus for global effects: completion celebrations and the core pulse.

export interface Celebration {
  kind: 'mission' | 'session' | 'day';
  title: string;
  lines: string[];
}

type Handler<T> = (payload: T) => void;

function channel<T>() {
  const handlers = new Set<Handler<T>>();
  return {
    emit: (p: T) => handlers.forEach((h) => h(p)),
    on: (h: Handler<T>) => {
      handlers.add(h);
      return () => {
        handlers.delete(h);
      };
    },
  };
}

export const celebrations = channel<Celebration>();
export const corePulse = channel<void>();

export const celebrate = (c: Celebration) => celebrations.emit(c);
export const pulseCore = () => corePulse.emit();
