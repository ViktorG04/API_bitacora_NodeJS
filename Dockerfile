# version de node
FROM node:14-alpine3.14

#creamos una carpeta en el contenedor donde va estar los archivos de la app
WORKDIR /app

# copiamos los dos archivos package.json
COPY package*.json ./

#copiamos los archivos de git para correr el proyecto
COPY . .

# instalamos npm para correr node
RUN npm install

# exponemos al exterior el puerto
EXPOSE $PORT

#este es el objetivo del contenedor
CMD ["npm", "run", "dev"]
