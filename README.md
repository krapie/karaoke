# Karaoke

JPOP lyrics reference — store songs with Japanese, phonetic, and Korean translations and look them up instantly. **Live:** [karaoke.kevinprk.com](https://karaoke.kevinprk.com)

## Features

| Feature | Description |
|---------|-------------|
| **Song library** | Save songs with title, optional TJ number, and pasted lyrics |
| **3-line verse format** | Japanese original / Korean phonetic / Korean translation, side by side |
| **TJ number** | Store and display TJ Media song numbers as a badge |
| **Search** | Filter songs instantly by title or TJ number |
| **Admin mode** | Token-authenticated write access; public users get read-only |

## Getting Started

```bash
# API
cd api && npm install
ADMIN_TOKEN=yourtoken DB_PATH=./karaoke.db npm run dev

# Frontend (separate terminal)
cd web && npm install && npm run dev   # http://localhost:5173
```

Lyrics are pasted as 3-line verses separated by blank lines — Japanese / phonetic / translation.
