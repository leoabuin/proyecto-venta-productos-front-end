FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Buildeamos
RUN npm run build

# ESTA LÍNEA ES CLAVE: Nos va a mostrar en el BUILD LOG la estructura real
RUN ls -R dist

EXPOSE 4000

# Usamos un comando que busca y ejecuta, pero con un mensaje de error si falla
CMD ["sh", "-c", "SERVER_PATH=$(find dist -name server.mjs | head -n 1); if [ -z \"$SERVER_PATH\" ]; then echo 'ERROR: No se encontro server.mjs en dist'; ls -R dist; exit 1; else echo \"Arrancando servidor en: $SERVER_PATH\"; node $SERVER_PATH; fi"]