# Use the official Node.js image
FROM node:14

# Config the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]