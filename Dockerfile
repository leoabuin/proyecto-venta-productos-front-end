# Usamos Node 20 oficial
FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Buildeamos la aplicación
RUN npm run build

# Exponemos el puerto
EXPOSE 4000

# CAMBIO AQUÍ: Usamos una ruta más directa que suele ser la real en Angular 18
CMD ["node", "dist/proyecto-venta-productos-front-end/server/server.mjs"]