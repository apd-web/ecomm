FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY frontend ./frontend
COPY backend ./backend

RUN pnpm install --frozen-lockfile

EXPOSE 5173

CMD ["pnpm", "-C", "frontend", "dev", "--host", "0.0.0.0", "--port", "5173"]
