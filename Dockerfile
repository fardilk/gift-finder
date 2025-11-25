FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# copy all files
COPY . .

# build args MODE, e.g. dev / main → stag / prod
ARG MODE=dev

# copy env sesuai MODE
# contoh: MODE=dev → copy .env.dev jadi .env
RUN if [ -f ".env.$MODE" ]; then cp .env.$MODE .env; fi

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]