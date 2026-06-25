import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import client from 'prom-client';
import db from './db.js';
import { requireAuth } from './auth.js';

new client.Gauge({
  name: 'karaoke_songs_total',
  help: 'Total number of songs stored',
  collect() {
    const row = db.prepare('SELECT COUNT(*) as count FROM songs').get();
    this.set(row ? row.count : 0);
  },
});

const sendUmamiEvent = (name) => {
  const url = process.env.UMAMI_URL;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!url || !websiteId) return;
  fetch(`${url}/api/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
    body: JSON.stringify({
      type: 'event',
      payload: { website: websiteId, hostname: 'kevinprk.com', language: 'en', url: '/events', name },
    }),
  }).catch(() => {});
};

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Serve built web app
const webDist = path.join(__dirname, '../../web/dist');
app.use(express.static(webDist));

// --- Public routes ---

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.get('/api/songs', (req, res) => {
  const songs = db.prepare(
    'SELECT id, title, singer, tj_number, language, created_at FROM songs ORDER BY created_at DESC'
  ).all();
  res.json(songs);
});

app.get('/api/songs/:id', (req, res) => {
  const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
  if (!song) return res.status(404).json({ error: 'Not found' });
  res.json(song);
});

// --- Protected routes ---

app.post('/api/songs', requireAuth, (req, res) => {
  const { title, singer, tj_number, lyrics, language } = req.body;
  if (!title || !lyrics) return res.status(400).json({ error: 'title and lyrics are required' });
  const lang = ['japanese', 'korean', 'english'].includes(language) ? language : 'japanese';

  const result = db.prepare(
    'INSERT INTO songs (title, singer, tj_number, lyrics, language) VALUES (?, ?, ?, ?, ?)'
  ).run(title, singer || null, tj_number || null, lyrics, lang);

  sendUmamiEvent('song_added');
  res.status(201).json({ id: result.lastInsertRowid });
});

app.delete('/api/songs/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM songs WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// SPA fallback
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(webDist, 'index.html'));
});

app.listen(PORT, () => console.log(`karaoke api running on :${PORT}`));
