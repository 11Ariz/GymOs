# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Pass the backend URL as a build arg so Vite can bake it in
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA routing — send all 404s back to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
