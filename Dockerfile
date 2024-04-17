# Usar una imagen base de Node.js con Alpine Linux
FROM node:20.8.0-alpine as angular

# Crear el directorio de la aplicación
WORKDIR /app

# Copiar 'package.json' y 'package-lock.json' (si está disponible)
COPY package*.json ./

# Instalar dependencias, incluyendo Angular CLI globalmente
RUN npm ci
RUN npm install -g @angular/cli

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build --prod

# Segunda etapa, usar Nginx para servir la aplicación
FROM nginx:1.21.6-alpine

# Copiar el build de Angular desde la etapa anterior al directorio de Nginx
COPY --from=angular /app/dist/sakai-ng/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
