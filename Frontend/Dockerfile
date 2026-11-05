# 1. Build de producción
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Servir con NGINX
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Config NGINX para SPAs (Vite/React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
