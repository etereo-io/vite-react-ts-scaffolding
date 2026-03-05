#!/bin/sh
set -e

# Copy environment-specific config if APP_ENV is set
if [ -n "$APP_ENV" ] && [ -f "/config/config.${APP_ENV}.yml" ]; then
    echo "Loading config for environment: ${APP_ENV}"
    cp "/config/config.${APP_ENV}.yml" /usr/share/nginx/html/config/config.yml
fi

echo "Config loaded successfully"
