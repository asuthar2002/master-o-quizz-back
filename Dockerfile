FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# COPY .env .env
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY wait-for-it.sh ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --omit=dev
RUN chmod +x wait-for-it.sh
EXPOSE 5000
CMD ["node", "dist/app.js"]
