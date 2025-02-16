# frontend/Dockerfile

# ---- Stage 1: Basis – Abhängigkeiten installieren und Code kopieren ----
FROM node:16 AS base
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# ---- Stage 2: Development (Vite Dev Server) ----
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---- Stage 3: Production Build ----
FROM base AS builder
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# ---- Stage 4: Production Image mit Nginx ----
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
