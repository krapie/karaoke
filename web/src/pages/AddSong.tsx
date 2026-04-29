import { useState } from 'react';
import { createSong } from '../api';

interface Props {
  token: string;
  onSaved: (id: number) => void;
  onCancel: () => void;
}

export default function AddSong({ token, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [singer, setSinger] = useState('');
  const [tjNumber, setTjNumber] = useState('');
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

        <textarea
          placeholder={`Paste lyrics here — 3 lines per verse, blank line between verses:\n\n日本語 original\n한국어 phonetic\n한국어 translation\n\n(next verse...)`}
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
