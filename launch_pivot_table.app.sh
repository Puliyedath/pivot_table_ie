#!/bin/sh

echo "Launching Pivot Table App........"
echo "Installing dependencies..........."
npm i

echo ' '
echo "####################################"
echo ' '

echo "Creating dist resources in dev mode"
npm run build:dev

echo ' '
echo "####################################"
echo ' '

echo "Starting web pack dev server on port 8080"
npm run start:dev:server
echo "Launching the website on localhost:8080"
