#!/bin/bash
echo "=== INICIANDO COMPILACIÓN ==="
echo "Contenido del directorio:"
ls -la
npm install
npm run build
echo "=== COMPILACIÓN COMPLETADA ==="
