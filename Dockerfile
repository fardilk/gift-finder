FROM node:20 as builder

WORKDIR /app

# Copy deps
COPY package*.json ./

RUN npm install

# Copy all source
COPY . .

# Mode → dari GitHub build-args
ARG MODE=dev

# Print current mode
RUN echo "Building FE in MODE=$MODE"

# BUILD SESUAI MODE:
RUN npm run build -- --mode $MODE


# ---------- RUNTIME ----------
FROM nginx:alpine

# Copy dist hasil build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
