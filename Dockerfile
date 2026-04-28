# Build Vite static assets
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN
ARG NEXT_PUBLIC_SENTIENT_INSTALL_KEY
ENV NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN=$NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN
ENV NEXT_PUBLIC_SENTIENT_INSTALL_KEY=$NEXT_PUBLIC_SENTIENT_INSTALL_KEY

RUN npm run build

# Serve prerendered routes with the route-aware Node server (Render sets PORT)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 3000
CMD ["node", "server.mjs"]
