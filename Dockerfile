FROM node:18

WORKDIR /app

# Delete node_modules and dist for a clean install
RUN rm -rf node_modules || true
RUN rm -rf dist || true

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]