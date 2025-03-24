# Estágio 1: Construção da aplicação
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências
COPY package.json ./

# Copia o restante dos arquivos do projeto
COPY . .

# Instala as dependências
RUN yarn install

# Constrói a aplicação
RUN yarn build

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copia os arquivos construídos para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]