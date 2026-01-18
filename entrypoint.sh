#!/bin/sh

# Environment variables are already set, server.js will use them
echo "Runtime config injected:"
echo "VITE_HA_URL: ${VITE_HA_URL}"
echo "VITE_HA_TOKEN: ${VITE_HA_TOKEN:0:20}..."

# Start the Node.js server
exec node server.js
