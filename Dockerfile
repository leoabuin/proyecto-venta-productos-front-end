FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Buildeamos
RUN npm run build

# ESTA LÍNEA ES CLAVE: Nos va a mostrar en el log de Railway dónde quedaron los archivos
RUN find dist -name "server.mjs"

EXPOSE 4000

# Usamos un comando que busque el archivo y lo ejecute sin importar la carpeta
CMD ["sh", "-c", "node $(find dist -name server.mjs | head -n 1)"]