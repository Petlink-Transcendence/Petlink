#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Directory where certificates will be saved
SSL_DIR="$(dirname "$0")/ssl"

mkdir -p "$SSL_DIR"

echo "Generating self-signed SSL certificate in $SSL_DIR..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/nginx.key" \
  -out "$SSL_DIR/nginx.crt" \
  -subj "/C=PT/ST=Porto/L=Porto/O=42/OU=larocqueg/CN=localhost"

echo "Certificates successfully generated!"
