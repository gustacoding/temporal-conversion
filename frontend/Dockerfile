# Use uma imagem base oficial do Node.js
FROM node:16-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências usando --legacy-peer-deps para contornar o conflito
RUN npm install --legacy-peer-deps

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação para produção
RUN npm run build

# Use uma imagem base do Nginx para servir a aplicação
FROM nginx:alpine

# Copie os arquivos de build para o diretório padrão do Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Copie o arquivo de configuração personalizado do Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta que o Nginx usará
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
