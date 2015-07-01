NWJS_PACKAGE_NAME=nwjs-v0.12.2-linux-x64
NWJS_URL=http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-linux-x64.tar.gz


sudo apt-get install npm
wget $NWJS_URL
tar -zxvf $NWJS_PACKAGE_NAME.tar.gz
mv $NWJS_PACKAGE_NAME nwjs

cd MoldeoControl
npm install node-osc md5-node moment osenv

