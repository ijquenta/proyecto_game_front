# Usar una imagen base de Node.js con Alpine Linux
FROM node:20.8.0-alpine as angular

# Crear el directorio de la aplicación
RUN mkdir -p /app

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json al directorio de trabajo
COPY package.json /app

# Instalar dependencias, ignorando conflictos de dependencias de pares
RUN npm install --legacy-peer-deps

# Copiar todos los archivos del proyecto al contenedor
COPY . /app

# Construir la aplicación Angular para producción
RUN npm run build --prod

# Segunda etapa, usar Nginx para servir la aplicación
FROM nginx:1.21.6-alpine

# Copiar el build de Angular desde la etapa anterior al directorio de Nginx
COPY --from=angular /app/dist/sakai-ng /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
