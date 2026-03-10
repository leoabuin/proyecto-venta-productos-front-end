# Usamos Node 20
FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el código
COPY . .

# Buildeamos
RUN npm run build

# Exponemos el puerto
EXPOSE 4000

# ESTE COMANDO BUSCA EL ARCHIVO Y LO EJECUTA
CMD ["sh", "-c", "node $(find dist -name server.mjs | head -n 1)"]