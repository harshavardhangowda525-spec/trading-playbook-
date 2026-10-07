// In-browser AI engine (WebLLM). The model runs on the learner's own device
// through WebGPU: no API key, no server, questions never leave the browser.
// The library is loaded only when the assistant is first used.

import type { WebWorkerMLCEngine, ChatCompletionMessageParam } from '@mlc-ai/web-llm';

export type ChatMessage = ChatCompletionMessageParam;

export interface ModelOption {
  id: string;
  label: string;
  size: string;
  note: string;
}

export const MODELS: ModelOption[] = [
  { id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC', label: 'Light', size: '≈ 0.4 GB', note: 'Fastest; for phones and older laptops. Simpler answers.' },
  { id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', label: 'Balanced', size: '≈ 1 GB', note: 'Good answers on most laptops.' },
  { id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC', label: 'Best', size: '≈ 2 GB', note: 'Best explanations; needs a stronger GPU.' },
];
export const DEFAULT_MODEL = MODELS[1].id;

export interface Progress {
  progress: number; // 0..1
  text: string;
}

/** A minimal engine surface so tests can inject a stand-in. */
export interface Engine {
  stream(messages: ChatMessage[], onToken: (t: string) => void, signal: { stopped: boolean }): Promise<string>;
  stop(): void;
}

export function hasWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

let current: { id: string; engine: Promise<Engine> } | null = null;

export function loadEngine(modelId: string, onProgress: (p: Progress) => void): Promise<Engine> {
  const injected = (globalThis as { __ASSISTANT_TEST_ENGINE__?: Engine }).__ASSISTANT_TEST_ENGINE__;
  if (injected) return Promise.resolve(injected);
  if (current?.id === modelId) return current.engine;
  const previous = current;
  const engine = (async () => {
    if (previous) await previous.engine.then((e) => (e as WebEngine).unload?.()).catch(() => undefined);
    const webllm = await import('@mlc-ai/web-llm');
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    const mlc = await webllm.CreateWebWorkerMLCEngine(worker, modelId, {
      initProgressCallback: (r) => onProgress({ progress: r.progress, text: r.text }),
    });
    return new WebEngine(mlc);
  })();
  current = { id: modelId, engine };
  engine.catch(() => {
    if (current?.engine === engine) current = null;
  });
  return engine;
}

export async function isModelDownloaded(modelId: string): Promise<boolean> {
  try {
    const webllm = await import('@mlc-ai/web-llm');
    return await webllm.hasModelInCache(modelId);
  } catch {
    return false;
  }
}

class WebEngine implements Engine {
  constructor(private mlc: WebWorkerMLCEngine) {}

  async stream(messages: ChatMessage[], onToken: (t: string) => void, signal: { stopped: boolean }) {
    const chunks = await this.mlc.chat.completions.create({
      messages,
      stream: true,
      temperature: 0.4,
      max_tokens: 700,
    });
    let text = '';
    for await (const chunk of chunks) {
      if (signal.stopped) break;
      const delta = chunk.choices[0]?.delta?.content ?? '';
      if (delta) {
        text += delta;
        onToken(delta);
      }
    }
    return text;
  }

  stop() {
    this.mlc.interruptGenerate();
  }

  unload() {
    return this.mlc.unload();
  }
}
