FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install prettier globally with yarn
RUN yarn global add prettier

# Install packages with yarn
RUN yarn install --silent --no-progress

# Copy application files
COPY . .

#Expose Port
EXPOSE 1337

# Start the application
CMD [ "yarn", "start" ]