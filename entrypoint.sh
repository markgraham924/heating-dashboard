#!/bin/sh

# Replace placeholders in config.js with actual environment variables
sed -i "s|__VITE_HA_URL__|${VITE_HA_URL}|g" /app/dist/config.js
sed -i "s|__VITE_HA_TOKEN__|${VITE_HA_TOKEN}|g" /app/dist/config.js

echo "Runtime config injected:"
echo "VITE_HA_URL: ${VITE_HA_URL}"
echo "VITE_HA_TOKEN: ${VITE_HA_TOKEN:0:20}..."

# Start the application
exec serve -s dist -l 3000
