# Usamos Node 20
FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el código
COPY . .

# Buildeamos la aplicación
RUN npm run build

# Exponemos el puerto
EXPOSE 4000

# RUTA EXACTA basada en tu VS Code:
CMD ["node", "dist/proyecto-venta-productos-front-end/server/server.mjs"]