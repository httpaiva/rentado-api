FROM node:18

WORKDIR /app

# Copie apenas os arquivos de configuração do Node e instale dependências
COPY package*.json ./

RUN npm install --force

# Copie o restante dos arquivos do projeto
COPY . .

CMD ["npm", "run", "start:dev"]
