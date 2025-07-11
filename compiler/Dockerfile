FROM node:22-alpine

# Installing g++ and python3 
RUN apk add --no-cache g++ python3

# Creating app directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json .
RUN npm install

# Copying rest of the files
COPY . .

# Expose the 5000 port of compiler 
EXPOSE 5000

# Start the compiler server
CMD [ "node" , "index.js" ]