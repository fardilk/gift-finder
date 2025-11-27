FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# 🔹 Build-time args dari GitHub Actions
ARG VITE_API_BASE_URL
ARG VITE_APP_ENV

# 🔹 Expose ke environment agar Vite bisa baca saat build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build FE (harusnya pakai Vite di npm run build)
RUN npm run build

# ---- Runtime ----
FROM nginx:alpine

# Copy hasil build ke nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
