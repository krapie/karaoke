# Karaoke

JPOP lyrics reference app — save songs with their Japanese lyrics, Korean phonetic reading, and Korean translation, then look them up instantly by title or TJ number. Built for karaoke sessions where you need a quick lyric refresh between songs. **Live:** [karaoke.kevinprk.com](https://karaoke.kevinprk.com)

## Getting Started

```bash
# API
cd api && npm install
ADMIN_TOKEN=yourtoken DB_PATH=./karaoke.db npm run dev

# Frontend (separate terminal)
cd web && npm install && npm run dev   # http://localhost:5173
```

Lyrics are pasted as 3-line verse blocks separated by blank lines: Japanese / phonetic / Korean translation.

## Features

- **Song library** — save songs with title, optional TJ number, and pasted lyrics; stored in SQLite via the API
- **3-line verse format** — each verse shows Japanese original / Korean phonetic / Korean translation side by side for at-a-glance reading during a session
- **TJ number badge** — attach and display TJ Media song numbers so you can find the song on a karaoke machine without searching
- **Instant search** — filter the library by title or TJ number as you type; no submit required
- **Admin mode** — token-authenticated write access for adding and editing songs; public visitors get read-only access
