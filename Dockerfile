# --- Build stage ---
FROM docker.io/node:20.5.1-alpine3.18 AS builder
WORKDIR /app

# Install pnpm 
RUN npm install -g pnpm

# Install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Set production environment variables
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=https://codelabs.bucaramanga.upb.edu.co/api/v1

# Local api 
# ENV VITE_API_BASE_URL=http://codelabs.bucaramanga.upb.edu.co:8080/api/v1

COPY . .
RUN pnpm build

# --- Run stage ---
FROM docker.io/nginx:1-alpine3.18-slim AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf


# Copy custom nginx config
COPY ./config/default.nginx.conf /etc/nginx/conf.d

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]