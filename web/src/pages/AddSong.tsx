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
      <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-300 mb-4 transition-colors">
        ← Cancel
      </button>
      <h1 className="text-2xl font-bold mb-6">Add Song</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Song title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Singer (optional)"
            value={singer}
            onChange={e => setSinger(e.target.value)}
            className="w-44 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="TJ number (optional)"
            value={tjNumber}
            onChange={e => setTjNumber(e.target.value)}
            className="w-44 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <textarea
          placeholder={`Paste lyrics here — 3 lines per verse, blank line between verses:\n\n日本語 original\n한국어 phonetic\n한국어 translation\n\n(next verse...)`}
          value={lyrics}
          onChange={e => setLyrics(e.target.value)}
          required
          rows={20}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-700 hover:border-gray-500 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Song'}
          </button>
        </div>
      </form>
    </div>
  );
}
