import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { requireAuth } from './auth.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Serve built web app
const webDist = path.join(__dirname, '../../web/dist');
app.use(express.static(webDist));

// --- Public routes ---

app.get('/api/songs', (req, res) => {
  const songs = db.prepare(
    'SELECT id, title, singer, tj_number, created_at FROM songs ORDER BY created_at DESC'
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
  const { title, singer, tj_number, lyrics } = req.body;
  if (!title || !lyrics) return res.status(400).json({ error: 'title and lyrics are required' });

  const result = db.prepare(
    'INSERT INTO songs (title, singer, tj_number, lyrics) VALUES (?, ?, ?, ?)'
  ).run(title, singer || null, tj_number || null, lyrics);

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
