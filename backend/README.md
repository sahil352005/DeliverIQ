## Bulk Messaging Backend (NestJS)

### Prerequisites
- Node.js 18+
- pnpm or npm or yarn
- PostgreSQL 13+
- Redis 6+

### Setup
1. Copy `.env` if needed and adjust values.
2. Install deps:
   - `npm i -g @nestjs/cli`
   - `npm install` inside `backend/`
3. Run Postgres and Redis (see root `docker-compose.yml` in the monorepo when available).

### Environment
Create `.env` by copying the example and adjust if needed:
```bash
cp .env.example .env
```

### Development
```bash
npm run start:dev
```

Server runs at `http://localhost:3000` with global prefix `/api`.

### Prisma
Generate client after editing `prisma/schema.prisma`:
```bash
npm run prisma:generate
```

Run dev migrations:
```bash
npm run prisma:migrate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

### Local Databases with Docker Desktop
From the repo root, start Postgres and Redis:
```bash
docker compose up -d
```
This starts `postgres:15` at `localhost:5432` and `redis:7` at `localhost:6379` (see `../../docker-compose.yml`).



