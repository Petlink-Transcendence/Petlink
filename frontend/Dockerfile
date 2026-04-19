# Use a Node.js image as the base
FROM node:20-alpine

# Set the directory inside the container where the code will live
WORKDIR /app

# Copy the package files first (to cache dependencies)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port the app runs on (usually 5173 for Vite or 3000 for CRA)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]