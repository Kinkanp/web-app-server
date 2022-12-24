#!/bin/sh

set -e

echo "Running db migration"
npm run migration:deploy

# TODO: generate models to src and commit them ?
echo "Generating prisma models"
npm run models:generate

#echo "Installing packages"
#npm i @packages/http-server @packages/ioc

#echo "Building project"
#npm run build

echo "Running tests"
npm test
npm run test:e2e
