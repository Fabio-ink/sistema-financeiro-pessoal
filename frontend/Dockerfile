# 1. Imagem Base
FROM node:20-alpine

# 2. Diretório de Trabalho
WORKDIR /app

# 3. Copie os arquivos de pacote
COPY package.json package-lock.json ./

# 4. Instale as Dependências Principais
RUN npm install

# 5. [A CORREÇÃO ESTÁ AQUI]
#    Instala as dependências que o App.jsx precisa
RUN npm install lucide-react jwt-decode recharts

# 6. Copie o Resto do Código
COPY . .

# 7. Exponha a Porta
EXPOSE 5173

# 8. Comando Padrão
CMD ["npm", "run", "dev"]