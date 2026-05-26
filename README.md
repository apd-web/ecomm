# Ecomm SaaS Platform

Production-grade MERN ecommerce platform.

## Scripts

- `pnpm dev` - run frontend + backend dev scripts (workspace)
- `pnpm dev:web` - run the frontend
- `pnpm dev:api` - run the backend
- `pnpm -C frontend dev` - run the frontend from `frontend/`
- `pnpm -C backend dev` - run the backend from `backend/`
- `pnpm build` / `pnpm lint` / `pnpm typecheck` - run across the workspace (skips packages without the script)

## Environment

- Backend reads config from `backend/.env`.
- Set `MONGODB_URI` to your local MongoDB or Atlas connection string.
- `SKIP_DB=true` lets the backend boot without Mongo (preview/dev only).
