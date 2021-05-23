#toma la imagen de Node.js del docker image
FROM node:alpine

#crea el directorio app dentro de la imagen
WORKDIR /usr/src/app

#copia el contenido del package.json en ese directorio
COPY package*.json ./

#corre npm install en forma local en mi maquina
RUN npm install

#copia el contenido generado dentro del container
COPY . .

#como la aplicacion va a correr en el puerto 5000 en la aplicacion
#exponemos ese puerto
EXPOSE 8080

#este comando arranca la app en el container
CMD ["npm", "run", "start"]