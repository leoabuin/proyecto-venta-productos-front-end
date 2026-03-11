FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Usamos Nginx para servir los archivos estáticos
FROM nginx:stable-alpine

# --- AGREGÁ ESTA LÍNEA AQUÍ ABAJO ---
COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Copiamos los archivos de la carpeta browser al directorio de Nginx
COPY --from=build /app/dist/proyecto-venta-productos-front-end/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]