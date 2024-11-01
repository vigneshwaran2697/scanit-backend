# Build arguments
ARG BASE_IMAGE
# Base image passed as an argument
FROM ${BASE_IMAGE} AS base
#Working Directory 
WORKDIR /opt/app
# Copy package.json and install dependencies
COPY package*.json /opt/app/
RUN npm install --silent \
  && npm i nodemon -g 
# Copy the rest of the application code
COPY . /opt/app
#Build the application
RUN npm run build
# Expose the application port
EXPOSE 3000
