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

# Serve SPA (Render sets PORT)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN npm install -g serve@14

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"]
