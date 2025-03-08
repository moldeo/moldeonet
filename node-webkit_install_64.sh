#!/bin/bash
NWJS_VERSION=v0.62.2
NWJS_PACKAGE_NAME=nwjs-$NWJS_VERSION-linux-x64
NWJS_PACKAGE_FILE=$NWJS_PACKAGE_NAME.tar.gz
NWJS_URL=http://dl.nwjs.io/$NWJS_VERSION/$NWJS_PACKAGE_FILE

echo "Installing nwjs (node-webkit) version $NWJS_VERSION"

FILE_LOCAL=./$NWJS_PACKAGE_FILE
echo $FILE_LOCAL
if [ -a $FILE_LOCAL ]; then
    echo "$FILE_LOCAL ok!"
    #    tar -zxvf NWJS_PACKAGE_FILE
    #    mv $NWJS_PACKAGE_NAME nwjs        
else        
    echo "./$NWJS_PACKAGE_FILE not found, downloading:"
    wget $NWJS_URL
fi

if [ -a $FILE_LOCAL ]; then
    tar -zxvf $NWJS_PACKAGE_FILE
    rm nwjs -R
    mv $NWJS_PACKAGE_NAME nwjs        
fi

sudo apt-get install npm
if [ -d MoldeoControl ]
then
    cd MoldeoControl
    npm install node-osc md5-node moment osenv
    cd ..
fi
