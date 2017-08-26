#!/bin/sh

cd MoldeoControl
npm install
zip -r ../${PWD##*/}.nw *
cd ..

echo "Success: packaging .nw"
exit 0
