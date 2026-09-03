# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# Build con SSR
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Solo copiar los artefactos del build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 4000

# Arrancar el servidor SSR de Angular
CMD ["node", "dist/intranet-frontend/server/server.mjs"]
