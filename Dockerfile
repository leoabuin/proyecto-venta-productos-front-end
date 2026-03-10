FROM node:20-slim

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos todo
COPY . .

# Buildeamos
RUN npm run build

# ESTA LÍNEA ES PARA NOSOTROS: Ver qué hay dentro de dist
RUN ls -R dist

EXPOSE 4000

# Buscamos el server.mjs en todo el proyecto y lo arrancamos
CMD ["sh", "-c", "node $(find /app/dist -name server.mjs | head -n 1)"]