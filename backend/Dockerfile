FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4000
# при старте заполняет пустую базу (администратор и меню), потом запускает API
CMD ["sh", "-c", "node dist/database/seed.js && node dist/main.js"]
