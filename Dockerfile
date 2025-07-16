FROM node:22-alpine

# Creating app directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json .
RUN npm install

# Copying rest of the files
COPY . .

# Expose the 8000 port of backend server 
EXPOSE 8000

# Start server
CMD ["node", "server.js"]