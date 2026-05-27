FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY backend ./backend
COPY frontend ./frontend

RUN pnpm install --frozen-lockfile

EXPOSE 4000

CMD ["pnpm", "-C", "backend", "dev"]
