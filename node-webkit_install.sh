NWJS_PACKAGE_NAME=nwjs-v0.12.2-linux-x64
NWJS_URL=http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-linux-x64.tar.gz

wget $NWJS_URL
tar -zxvf $NWJS_PACKAGE_NAME.tar.gz
mv $NWJS_PACKAGE_NAME nwjs
