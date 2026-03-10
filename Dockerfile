FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Exponemos el puerto
EXPOSE 4000

# Este comando busca el archivo server.mjs donde sea que Angular lo haya metido
CMD ["sh", "-c", "node $(find dist -name server.mjs | head -n 1)"]