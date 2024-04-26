#!/bin/sh

set -e

echo "Running db migration"
npm run migration:deploy

echo $DB_URL > t.txt
exec "$@"
