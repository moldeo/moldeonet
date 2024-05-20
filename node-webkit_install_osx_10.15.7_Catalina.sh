#!/bin/bash
#http://dl.nwjs.io/v0.14.2/nwjs-v0.14.2-osx-x64.zip
NWJS_VERSION=v0.62.2
NWJS_PACKAGE_NAME=nwjs-$NWJS_VERSION-osx-x64
NWJS_PACKAGE_FILE=$NWJS_PACKAGE_NAME.zip
NWJS_URL=http://dl.nwjs.io/$NWJS_VERSION/$NWJS_PACKAGE_FILE

echo "Installing nwjs (node-webkit) version $NWJS_VERSION"

FILE_LOCAL=./$NWJS_PACKAGE_FILE
echo "Checking for $FILE_LOCAL"
if [ -a $FILE_LOCAL ]; then
    echo "$FILE_LOCAL ok!"
    #    tar -zxvf NWJS_PACKAGE_FILE
    #    mv $NWJS_PACKAGE_NAME nwjs
else
    echo "./$NWJS_PACKAGE_FILE not found, downloading:"
    wget $NWJS_URL
fi

NWJS_DIR=nwjs
NWJS_LOCAL=nwjs/nwjs.app/Contents/MacOS/nwjs
echo "Checking for node webkit binary in $NWJS_LOCAL"
if [ -d $NWJS_DIR ]; then
    rm -Rf nwjs
fi

unzip $NWJS_PACKAGE_FILE
mv $NWJS_PACKAGE_NAME nwjs
cd nwjs
zip -r nwjs.app.zip nwjs.app
cd ..

echo "Installing npm"
sudo port install npm6
if [ -d MoldeoControl ]
then
    cd MoldeoControl
    npm install
    cd ..
fi
