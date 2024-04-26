#!/bin/sh

set -e

echo "Running db migration"
echo $DB_URL
npm run migration:deploy

exec "$@"
