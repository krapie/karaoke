# Stage 1: build web
FROM node:22-alpine AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# Stage 2: build api deps
FROM node:22-alpine AS api-builder
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci --omit=dev

# Stage 3: runtime
FROM node:22-alpine AS runner
RUN apk --no-cache add python3 make g++
WORKDIR /app

COPY api/ ./api/
COPY --from=api-builder /app/api/node_modules ./api/node_modules
COPY --from=web-builder /app/web/dist ./web/dist

EXPOSE 3000
ENV NODE_ENV=production
ENV DB_PATH=/data/karaoke.db

CMD ["node", "api/src/index.js"]
