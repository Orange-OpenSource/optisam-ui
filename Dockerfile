FROM dockerfactory-unstable-iva.si.francetelecom.fr/optisam/nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
USER root
WORKDIR /usr/share/nginx/html
RUN mkdir dist
RUN mkdir dist/assets
COPY dist/assets/ dist/assets
COPY dist/ .

