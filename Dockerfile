# --- Build stage ---
FROM node:20.5.1-alpine3.18 AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# --- Run stage ---
FROM nginx:1-alpine3.18-slim AS runner
RUN rm /etc/nginx/conf.d/default.conf

COPY ./config/default.nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]