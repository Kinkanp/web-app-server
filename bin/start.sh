#!/bin/sh

set -e

echo "Running db migration"
npm run migration:deploy

# TODO: generate models to src and commit them ?
echo "Generating prisma models"
npm run models:generate

echo "Starting server"
node dist/main.js
