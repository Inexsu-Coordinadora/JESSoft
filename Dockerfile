# 1. Imagen base
FROM node:18

# 2. Crear directorio en el contenedor
WORKDIR /app

# 3. Copiar package.json
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install --production

# 5. Copiar el proyecto
COPY . .

# 6. Compilar el TS
RUN npm run build

# 7. Exponer el puerto
EXPOSE 3000

# 8. Comando de arranque
CMD ["npm", "start"]