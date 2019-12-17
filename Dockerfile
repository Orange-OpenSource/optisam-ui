FROM dockerfactory-unstable-iva.si.francetelecom.fr/optisam/nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY ${CI_PROJECT_DIR}/ui_service/dist/ .
