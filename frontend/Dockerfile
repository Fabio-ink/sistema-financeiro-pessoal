FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY tailwind.config.js postcss.config.js vite.config.js ./

RUN npm install
COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev"]