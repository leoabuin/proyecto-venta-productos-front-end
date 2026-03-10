FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 4000

# Usamos la ruta exacta que Angular 18 genera por defecto
CMD ["node", "dist/proyecto-venta-productos-front-end/server/server.mjs"]