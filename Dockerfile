# Use the official Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn build

# Specify the command to run the script
CMD ["node", "dist/index.js"]

# Expose the port the application runs on
EXPOSE 3000
