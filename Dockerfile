# Usamos Node 20
FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos todo el código
COPY . .

# Buildeamos la aplicación
RUN npm run build

# Exponemos el puerto 4000
EXPOSE 4000

# Usamos el script que ya tienes en tu package.json
CMD ["npm", "run", "serve:ssr:proyecto-venta-productos-front-end"]