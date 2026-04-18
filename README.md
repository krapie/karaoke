# Karaoke

A personal lyrics reference app for JPOP karaoke — store songs with Japanese, phonetic, and Korean translations, and look them up instantly by title or TJ number.

## Features

- **Save lyrics** — add a song with title, optional TJ number, and pasted lyrics
- **3-line verse format** — Japanese original / Korean phonetic (primary display) / Korean translation
- **TJ number** — store and display TJ Media song numbers as a badge
- **Search** — filter songs instantly by title or TJ number
- **Admin mode** — token-authenticated write access; public users get read-only

## Production

| | URL |
|---|---|
| Web | https://karaoke.kevinprk.com |

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite · React · TypeScript · Tailwind CSS |
| Backend | Node.js · Express 5 |
| Database | SQLite (better-sqlite3) |
| Auth | Bearer token (admin only) |
| Deploy | Kubernetes · ArgoCD · GitHub Actions |

## Project Structure

```
karaoke/
├── web/               # Vite + React frontend
│   └── src/
│       ├── pages/
│       │   ├── SongList.tsx      # Searchable song list
│       │   ├── SongDetail.tsx    # Lyrics viewer
│       │   └── AddSong.tsx       # Add song form (admin only)
│       ├── api.ts                # API client
│       ├── parseLyrics.ts        # 3-line verse parser
│       ├── useAdmin.ts           # Admin token state (localStorage)
│       └── types.ts
├── api/               # Express API + SQLite
│   └── src/
│       ├── index.js              # Routes + static serving
│       ├── db.js                 # SQLite setup
│       └── auth.js               # Bearer token middleware
├── Dockerfile         # Multi-stage: build web → serve via Express
└── .github/
    └── workflows/
        └── ci.yml     # Build → Docker Hub → update k8s manifest
```

## Getting Started

```bash
# 1. Clone
git clone https://github.com/krapie/karaoke.git && cd karaoke

# 2. Start API
cd api && npm install
ADMIN_TOKEN=yourtoken DB_PATH=./karaoke.db npm run dev

# 3. Start web (new terminal)
cd web && npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment Variables

**`api/`**
```bash
ADMIN_TOKEN=   # Required — token for admin write access
DB_PATH=       # Optional — SQLite file path (default: ./karaoke.db, prod: /data/karaoke.db)
PORT=          # Optional — default 3000
```

## Lyrics Format

Paste lyrics as 3-line verses separated by blank lines:

```
日本語 original
한국어 발음 (phonetic)
한국어 번역 (translation)

(next verse...)
```

## API Reference

```
GET    /api/songs          List all songs (id, title, tj_number)
GET    /api/songs/:id      Get song with full lyrics
POST   /api/songs          Add song — requires Bearer token
DELETE /api/songs/:id      Delete song — requires Bearer token
```

## CI/CD

Push to `main` → GitHub Actions builds `krapi0314/karaoke:<sha>` → updates `k8s/karaoke/deployment.yaml` in homeserver repo → ArgoCD auto-syncs.

Required GitHub Actions secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GITOPS_TOKEN`.

To seal the admin token:
```bash
echo -n "<your-token>" | kubectl create secret generic karaoke-secret \
  --namespace=karaoke --from-file=admin-token=/dev/stdin --dry-run=client -o yaml \
  | kubeseal --format yaml > k8s/karaoke/sealed-secret.yaml
```
