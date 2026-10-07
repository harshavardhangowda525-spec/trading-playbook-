import { useMemo, useState } from 'react';
import { ExternalLink, Link2, Play, RotateCcw, Search, Video } from 'lucide-react';
import type { LessonVideo } from '../../data/lessons';
import { useDoc } from '../../lib/hooks';
import { C } from '../../lib/domain';
import { embedUrl, parseYouTubeId, searchUrl, thumbUrl, watchUrl } from '../../lib/youtube';
import { Panel } from '../ui';

interface VideoPrefs {
  id: 'lessonVideos';
  /** Learner-chosen video id per journey day; overrides the curated pick. */
  byDay: Record<string, string>;
}
const DEFAULT_PREFS: VideoPrefs = { id: 'lessonVideos', byDay: {} };

/** Reference video for a lesson: curated pick, or the learner's own link. */
export function LessonVideoPanel({ day, title, curated, query }: { day: number; title: string; curated?: LessonVideo; query: string }) {
  const [prefs, update] = useDoc<VideoPrefs>(C.settings, 'lessonVideos', DEFAULT_PREFS);
  const ownId = prefs.byDay[String(day)];
  const id = ownId ?? curated?.youtubeId ?? null;
  const [playing, setPlaying] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const draftId = useMemo(() => parseYouTubeId(draft), [draft]);

  const save = () => {
    if (!draftId) return;
    update((p) => ({ ...p, byDay: { ...p.byDay, [String(day)]: draftId } }));
    setEditing(false);
    setDraft('');
    setPlaying(null);
  };
  const reset = () => {
    update((p) => {
      const byDay = { ...p.byDay };
      delete byDay[String(day)];
      return { ...p, byDay };
    });
    setPlaying(null);
  };

  return (
    <Panel
      title={
        <>
          <Video size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />
          Reference video
        </>
      }
      sub={ownId ? 'Your video' : (curated?.youtubeId && curated.channel) || 'Suggested video'}
    >
      {id ? (
        <div className="lv-frame">
          {playing === id ? (
            <iframe
              src={embedUrl(id)}
              title={ownId ? `Reference video — ${title}` : curated?.title ?? title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className="lv-poster" onClick={() => setPlaying(id)} aria-label="Play reference video">
              <img src={thumbUrl(id)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
              <span className="lv-play">
                <Play size={22} fill="currentColor" />
              </span>
            </button>
          )}
        </div>
      ) : (
        <p className="small muted" style={{ margin: 0 }}>
          No video picked for this lesson yet. Search YouTube below and paste the link you like best.
        </p>
      )}

      {id && !ownId && curated && (
        <div className="lv-meta">
          <span className="lv-title">{curated.title}</span>
          {curated.channel && <span className="mono tiny muted">{curated.channel}</span>}
        </div>
      )}

      <div className="row wrap lv-actions">
        {id && (
          <a className="btn btn-sm" href={watchUrl(id)} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Open on YouTube
          </a>
        )}
        <a className="btn btn-sm btn-ghost" href={searchUrl(query)} target="_blank" rel="noreferrer">
          <Search size={14} /> More videos
        </a>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setEditing((e) => !e)}>
          <Link2 size={14} /> {ownId ? 'Change my video' : 'Use my own video'}
        </button>
        {ownId && curated?.youtubeId && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>
            <RotateCcw size={14} /> Back to suggested
          </button>
        )}
      </div>

      {editing && (
        <form
          className="lv-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <input
            className="input"
            placeholder="Paste a YouTube link…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="YouTube link"
            autoFocus
          />
          <button type="submit" className="btn btn-sm btn-primary" disabled={!draftId}>
            Save
          </button>
          {draft && !draftId && <span className="small" style={{ color: 'var(--bad)' }}>That doesn't look like a YouTube link.</span>}
        </form>
      )}
      <p className="tiny muted lv-note">Videos are third-party educational content and not financial advice.</p>
    </Panel>
  );
}
