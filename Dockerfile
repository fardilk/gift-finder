# ----------------------------
# BUILD STAGE
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# copy dependency files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# copy source
COPY . .

# build dengan mode sesuai argumen
ARG MODE=dev
RUN pnpm build -- --mode $MODE

# ----------------------------
# RUN STAGE
# ----------------------------
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
