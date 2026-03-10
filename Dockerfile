# Usamos Node 20 oficial
FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y buildeamos
COPY . .
RUN npm run build

# Exponemos el puerto que usa tu server.ts
EXPOSE 4000

# Comando de inicio directo al archivo compilado
CMD ["node", "dist/proyecto-venta-productos-front-end/server/server.mjs"]