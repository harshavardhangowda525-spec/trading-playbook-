// The trading assistant: chat, data review and daily coach, answered by a
// model running in the learner's own browser. Falls back to lesson search
// when the device can't run the model.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDoc } from '../hooks';
import { C } from '../domain';
import { lessonFor } from '../../data/curriculum';
import { loadLessonContent } from '../../data/lessons';
import { DEFAULT_MODEL, MODELS, hasWebGPU, isModelDownloaded, loadEngine, type ChatMessage, type Engine, type Progress } from './engine';
import { lessonBrief, searchLessons } from './knowledge';
import { parseActions, type Action } from './actions';
import { useSnapshot, type Snapshot } from './snapshot';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: Action[];
  /** Answered from lesson search because the AI model wasn't available. */
  offline?: boolean;
  at: number;
}

interface ChatDoc {
  id: 'assistantChat';
  messages: AssistantMessage[];
}
interface Prefs {
  id: 'assistantPrefs';
  modelId: string;
  /** The learner has agreed to download the model. */
  enabled: boolean;
}

const DEFAULT_CHAT: ChatDoc = { id: 'assistantChat', messages: [] };
const DEFAULT_PREFS: Prefs = { id: 'assistantPrefs', modelId: DEFAULT_MODEL, enabled: false };
const MAX_STORED = 60;

export type Status = 'idle' | 'loading' | 'thinking';

const RULES = `You are "Coach", the trading tutor inside Obsidian, a personal day-trading LEARNING app. The learner follows an 84-day curriculum and practises only with simulations (historical replay, paper trades) and a trading journal.

Rules:
- Teach clearly and simply. Use short paragraphs or bullet points. Define jargon. Keep answers under 250 words unless asked for more.
- Educational only: never give financial advice, never tell the learner to buy or sell a real instrument, never predict prices, never encourage real-money trading. If asked, explain the concept and suggest practising it in the simulator.
- Base answers on the LESSONS and LEARNER DATA below when relevant. Never invent the learner's numbers; if data is missing, say so.
- You can suggest app actions by writing a tag on its own line (the app shows it as a button the learner can tap):
  [[lesson:N]] opens lesson day N (1-84).
  [[open:PAGE]] opens a page. PAGE is one of: replay, practice, markets, library, journal, mistakes, playbook, strategy, timetable, analytics, psychology, journey.
  [[journal:{"market":"...","setup":"...","why":"...","learned":"..."}]] drafts a Trading Journal entry for the learner to review.
- Suggest at most two actions, only when they help.`;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const now = () => Date.now();

/** The lesson day shown on screen, if any. */
function useScreenDay(): number | undefined {
  const { pathname } = useLocation();
  const m = pathname.match(/^\/journey\/(\d+)/);
  return m ? Number(m[1]) : undefined;
}

interface Quiz {
  day: number;
  items: { q: string; a: string }[];
  index: number;
}

export function useAssistant() {
  const [chat, updateChat] = useDoc<ChatDoc>(C.settings, 'assistantChat', DEFAULT_CHAT);
  const [prefs, updatePrefs] = useDoc<Prefs>(C.settings, 'assistantPrefs', DEFAULT_PREFS);
  const snapshot = useSnapshot();
  const screenDay = useScreenDay();
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [streaming, setStreaming] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<boolean | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const signal = useRef({ stopped: false });
  const quiz = useRef<Quiz | null>(null);
  const snapRef = useRef<Snapshot>(snapshot);
  snapRef.current = snapshot;

  const gpu = hasWebGPU();
  const model = MODELS.find((m) => m.id === prefs.modelId) ?? MODELS[1];
  const aiReady = gpu && prefs.enabled;

  useEffect(() => {
    let alive = true;
    if (gpu && prefs.enabled) isModelDownloaded(model.id).then((d) => alive && setDownloaded(d));
    return () => {
      alive = false;
    };
  }, [gpu, prefs.enabled, model.id]);

  const push = useCallback(
    (...msgs: AssistantMessage[]) => updateChat((prev) => ({ ...prev, messages: [...prev.messages, ...msgs].slice(-MAX_STORED) })),
    [updateChat],
  );

  const getEngine = useCallback(async () => {
    if (engineRef.current) return engineRef.current;
    setStatus('loading');
    setProgress({ progress: 0, text: 'Starting…' });
    try {
      const e = await loadEngine(model.id, setProgress);
      engineRef.current = e;
      setDownloaded(true);
      return e;
    } finally {
      setProgress(null);
    }
  }, [model.id]);

  /** Run the model; returns the full reply, or null if it couldn't run. */
  const generate = useCallback(
    async (messages: ChatMessage[]): Promise<string | null> => {
      if (!aiReady) return null;
      try {
        const engine = await getEngine();
        setStatus('thinking');
        signal.current = { stopped: false };
        setStreaming('');
        let acc = '';
        const text = await engine.stream(messages, (t) => {
          acc += t;
          setStreaming(acc);
        }, signal.current);
        return text;
      } catch (e) {
        engineRef.current = null;
        setError(e instanceof Error ? e.message : String(e));
        return null;
      } finally {
        setStreaming('');
        setStatus('idle');
      }
    },
    [aiReady, getEngine],
  );

  const history = (msgs: AssistantMessage[]): ChatMessage[] =>
    msgs.slice(-6).map((m) => ({ role: m.role, content: m.text.slice(0, 1200) }) as ChatMessage);

  // ── Plain question ────────────────────────────────────────────────────
  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || status !== 'idle') return;
      setError(null);
      const userMsg: AssistantMessage = { id: uid(), role: 'user', text: q, at: now() };
      const prior = chat.messages;
      push(userMsg);

      // An answer to the coach's quiz question.
      const qz = quiz.current;
      if (qz) {
        const item = qz.items[qz.index];
        const reply = await generate([
          {
            role: 'system',
            content: `You are a friendly trading tutor grading a short quiz answer from the Day ${qz.day} lesson "${lessonFor(qz.day).title}". Start with "Correct", "Partly right" or "Not quite", then explain in 1-3 sentences using the model answer. Be encouraging. Educational only.`,
          },
          { role: 'user', content: `Question: ${item.q}\nModel answer: ${item.a}\nLearner's answer: ${q}` },
        ]);
        const graded = reply ?? `Model answer: ${item.a}\n\nCompare it with yours — what did you miss?`;
        qz.index += 1;
        const next = qz.items[qz.index];
        const tail = next
          ? `\n\n**Question ${qz.index + 1} of ${qz.items.length}:** ${next.q}`
          : `\n\nThat's the quiz done for today. Finish the lesson and log what you learned.\n[[lesson:${qz.day}]]`;
        if (!next) quiz.current = null;
        const { text, actions } = parseActions(graded + tail);
        push({ id: uid(), role: 'assistant', text, actions, offline: reply == null, at: now() });
        return;
      }

      const hits = await searchLessons(q, screenDay);
      const lessons = hits.length ? hits.map((h, i) => lessonBrief(h, i === 0)).join('\n\n') : 'No closely matching lesson.';
      const page = screenDay ? `\nThe learner is currently viewing lesson day ${screenDay}: "${lessonFor(screenDay).title}".` : '';
      const reply = await generate([
        { role: 'system', content: `${RULES}\n${page}\n\nLESSONS:\n${lessons}\n\nLEARNER DATA:\n${snapRef.current.text}` },
        ...history(prior),
        { role: 'user', content: q },
      ]);

      if (reply != null) {
        const { text, actions } = parseActions(reply);
        push({ id: uid(), role: 'assistant', text: text || '…', actions, at: now() });
        return;
      }
      // Offline: answer from the lessons themselves.
      const top = hits[0];
      const text = top?.content
        ? `From **Day ${top.day} — ${top.title}**:\n\n${top.content.what.slice(0, 2).join('\n\n')}\n\n**Common mistakes:**\n${top.content.mistakes
            .slice(0, 3)
            .map((m) => `- ${m}`)
            .join('\n')}`
        : "I couldn't find a lesson that matches. Try different words, or browse the 84-Day Journey.";
      const actions = hits.slice(0, 2).map((h) => parseActions(`[[lesson:${h.day}]]`).actions[0]);
      push({ id: uid(), role: 'assistant', text, actions: top ? actions : parseActions('[[open:journey]]').actions, offline: true, at: now() });
    },
    [status, chat.messages, push, generate, screenDay],
  );

  // ── Review my data ────────────────────────────────────────────────────
  const review = useCallback(async () => {
    if (status !== 'idle') return;
    setError(null);
    push({ id: uid(), role: 'user', text: 'Review my progress and data.', at: now() });
    const snap = snapRef.current;
    if (!snap.hasData) {
      const { text, actions } = parseActions(
        "There's nothing to review yet — no journal entries, practice sessions or Mistake Lab items. Run one replay and journal it, then ask me again.\n[[open:replay]]\n[[open:journal]]",
      );
      push({ id: uid(), role: 'assistant', text, actions, at: now() });
      return;
    }
    const reply = await generate([
      {
        role: 'system',
        content: `${RULES}\n\nLEARNER DATA:\n${snap.text}\n\nTask: review this learner's simulated practice. Give (1) two things going well, (2) the biggest weakness supported by the data, (3) ONE specific "next 1% improvement" for tomorrow, and (4) one or two action tags. Only use the numbers above.`,
      },
      { role: 'user', content: 'Review my progress and data.' },
    ]);
    if (reply != null) {
      const { text, actions } = parseActions(reply);
      push({ id: uid(), role: 'assistant', text, actions, at: now() });
    } else {
      const { text, actions } = parseActions(`Here is your data at a glance:\n\n${snap.text.split('\n').map((l) => `- ${l}`).join('\n')}\n[[open:analytics]]\n[[open:mistakes]]`);
      push({ id: uid(), role: 'assistant', text, actions, offline: true, at: now() });
    }
  }, [status, push, generate]);

  // ── Daily coach ───────────────────────────────────────────────────────
  const coach = useCallback(async () => {
    if (status !== 'idle') return;
    setError(null);
    const snap = snapRef.current;
    const content = await loadLessonContent(snap.day).catch(() => undefined);
    push({ id: uid(), role: 'user', text: 'Coach me today.', at: now() });
    const intro = `**Day ${snap.day} — ${snap.lessonTitle}** ${snap.lessonDone ? '(completed ✓)' : ''}\n${snap.text.split('\n')[1] ?? ''}`;
    if (content?.quiz.length) {
      quiz.current = { day: snap.day, items: content.quiz, index: 0 };
      const { text, actions } = parseActions(
        `${intro}\n\nLet's check today's lesson with a quick ${content.quiz.length}-question quiz. Type your answer below.\n\n**Question 1 of ${content.quiz.length}:** ${content.quiz[0].q}\n[[lesson:${snap.day}]]`,
      );
      push({ id: uid(), role: 'assistant', text, actions, at: now() });
    } else {
      push({ id: uid(), role: 'assistant', text: intro, at: now() });
    }
  }, [status, push]);

  const stop = useCallback(() => {
    signal.current.stopped = true;
    engineRef.current?.stop();
  }, []);

  const clear = useCallback(() => {
    quiz.current = null;
    updateChat({ messages: [] });
  }, [updateChat]);

  const enable = useCallback(
    async (modelId?: string) => {
      if (modelId && modelId !== prefs.modelId) engineRef.current = null;
      updatePrefs({ enabled: true, ...(modelId ? { modelId } : {}) });
      setError(null);
    },
    [prefs.modelId, updatePrefs],
  );

  const setModel = useCallback(
    (modelId: string) => {
      engineRef.current = null;
      updatePrefs({ modelId });
    },
    [updatePrefs],
  );

  /** Download and start the model ahead of the first question. */
  const warmUp = useCallback(async () => {
    try {
      await getEngine();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStatus('idle');
    }
  }, [getEngine]);

  return {
    messages: chat.messages,
    streaming,
    status,
    progress,
    error,
    gpu,
    model,
    prefs,
    downloaded,
    aiReady,
    screenDay,
    quizActive: () => quiz.current != null,
    ask,
    review,
    coach,
    stop,
    clear,
    enable,
    setModel,
    warmUp,
  };
}
