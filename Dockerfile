FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --omit=dev
EXPOSE 5000
CMD ["node", "dist/app.js"]
 