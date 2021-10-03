# version de node
FROM node:12

#creamos una carpeta en el contenedor donde va estar los archivos de la app
WORKDIR /app

# copiamos los dos archivos package.json
COPY package*.json ./

#copiamos los archivos de git para correr el proyecto
COPY . .

# variables de entorno
ENV PORT=3000
ENV DB_USER=SA
ENV DB_PASSWORD=P4sw0ord
ENV DB_SERVER=159.203.43.147
ENV DB_DATABASE=bitacora
ENV DB_PORT=1433
ENV AZURE_LOGIC_APPS=https://prod-13.northcentralus.logic.azure.com:443/workflows/61cbe1ecbd604d87bb5880cbfb473046/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mtFsCYigAm2_HjHFcL7J9-bFZJ2TOy-EQA5ElHunylk

# instalamos npm para correr node
RUN npm install

# exponemos al exterior el puerto
EXPOSE $PORT

#este es el objetivo del contenedor
CMD ["npm", "run", "dev"]
