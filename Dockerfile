FROM nginx:1.21.6-alpine
COPY ./dist/sakai-ng/ /usr/share/nginx/html/
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
