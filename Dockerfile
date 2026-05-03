# Build Vite static assets
FROM node:24-alpine AS builder
WORKDIR /app

ARG VITE_SITE_URL=https://sentientwebsite.com/
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Serve prerendered routes with the route-aware Node server (Render sets PORT)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 3000
CMD ["node", "server.mjs"]
