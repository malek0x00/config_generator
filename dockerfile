FROM node:16.20-bullseye-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app's code to the container
COPY . .

# Build the app
RUN npm run build

# Expose port 3000 for the app
EXPOSE 3000

# Set the command to run the app
CMD ["npm", "start"]
