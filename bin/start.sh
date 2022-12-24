#!/bin/sh

set -e

source bin/setup-db.sh

echo "Starting server"
node dist/main.js
