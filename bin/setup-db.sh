#!/bin/sh

set -e

echo "Running db migration"
npm run migration:deploy

exec "$@"
