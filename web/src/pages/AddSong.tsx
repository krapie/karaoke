import { useState } from 'react';
import { createSong } from '../api';
import type { SongLanguage } from '../types';

interface Props {
  token: string;
  onSaved: (id: number) => void;
  onCancel: () => void;
}

const PLACEHOLDERS: Record<SongLanguage, string> = {
  japanese: `Paste lyrics — 3 lines per verse, blank line between verses:\n\n日本語 original\n한국어 phonetic\n한국어 translation\n\n(next verse...)`,
  korean: `Paste Korean lyrics — one line per lyric line:\n\n가사 첫 번째 줄\n가사 두 번째 줄\n가사 세 번째 줄`,
  english: `Paste English lyrics — one line per lyric line:\n\nFirst lyric line\nSecond lyric line\nThird lyric line`,
};

export default function AddSong({ token, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [singer, setSinger] = useState('');
  const [tjNumber, setTjNumber] = useState('');
  const [language, setLanguage] = useState<SongLanguage>('japanese');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !lyrics.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { id } = await createSong(token, {
        title: title.trim(),
        singer: singer.trim() || undefined,
        tj_number: tjNumber.trim() || undefined,
        lyrics: lyrics.trim(),
        language,
      });
      onSaved(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button className="kp-song-detail back-btn" style={{ display: 'block', marginBottom: '16px' }} onClick={onCancel}>
        ← Cancel
      </button>
      <h1 style={{ fontSize: 'var(--kp-text-2xl)', fontWeight: 'var(--kp-weight-semi)', letterSpacing: 'var(--kp-tracking-tight)', marginBottom: 'var(--kp-space-6)' }}>
        Add Song
      </h1>

      <form onSubmit={handleSubmit} className="kp-form">
        <div className="kp-form-row">
          <input
            type="text"
            placeholder="Song title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="kp-input"
            style={{ margin: 0 }}
          />
          <input
            type="text"
            placeholder="Singer (optional)"
            value={singer}
            onChange={e => setSinger(e.target.value)}
            className="kp-input narrow"
            style={{ margin: 0 }}
          />
          <input
            type="text"
            placeholder="TJ number (optional)"
            value={tjNumber}
            onChange={e => setTjNumber(e.target.value)}
            className="kp-input narrow"
            style={{ margin: 0 }}
          />
        </div>

        <div className="kp-lang-selector">
          {(['japanese', 'korean', 'english'] as SongLanguage[]).map(lang => (
            <label key={lang} className={`kp-lang-option${language === lang ? ' active' : ''}`}>
              <input
                type="radio"
                name="language"
                value={lang}
                checked={language === lang}
                onChange={() => setLanguage(lang)}
              />
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </label>
          ))}
        </div>

        <textarea
          placeholder={PLACEHOLDERS[language]}
          value={lyrics}
          onChange={e => setLyrics(e.target.value)}
          required
          rows={20}
          className="kp-textarea"
        />

        {error && <p className="kp-error">{error}</p>}

        <div className="kp-form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Song'}
          </button>
        </div>
      </form>
    </div>
  );
}
