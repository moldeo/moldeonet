#!/bin/sh

DIE=0

./autogen.sh --prefix=/usr

cd MoldeoControl
npm install
zip -r ../${PWD##*/}.nw *
cd ..

echo "deb directory..."
(mkdir deb ) > /dev/null || {
	echo "cleaning..."

	(rm -Rf deb/*) > /dev/null || {
	  echo
	  echo "**Error**: removing error ."
	  echo ""
	  exit 1
	}
}



echo "making distribution source file..."
(make dist) > /dev/null || {
  echo
  echo "**Error**: make dist ."
  echo ""
  exit 1
}


echo "copying..."

(mv moldeonet-*.tar.gz ./deb/) > /dev/null || {
  echo
  echo "**Error**: moving file ."
  echo ""
  exit 1
}


echo "renaming..."
( rename 's/\.tar.gz/\.orig.tar.gz/' deb/*.tar.gz ) > /dev/null || {
  echo
  echo "**Error**: renaming ."
  echo ""
  exit 1
}
( rename 's/\-/\_/' deb/*.tar.gz ) > /dev/null || {
  echo
  echo "**Error**: renaming ."
  echo ""
  exit 1
}


echo "extracting..."

(tar -C deb -zxvf ./deb/*.orig.tar.gz ) > /dev/null || {
  echo
  echo "**Error**: extracting ."
  echo ""
  exit 1
}

cd deb/moldeonet-*
dh_make -i -e info@moldeo.org -p moldeonet -c gpl3

echo "Success: Extraction"

sed -i -e 's/Architecture: any/Architecture: amd64/g' debian/control
sed -i -e 's/Section: unknown/Section: graphics/g' debian/control
sed -i -e 's/Maintainer: fabricio /Maintainer: Moldeo Interactive /g' debian/control
sed -i -e 's/<insert the upstream URL, if relevant>/http:\\\\www.moldeo.org/g' debian/control
#sed -i -e 's/moldeonetBROKEN/moldeoplugins/g' debian/control
#sed -i -e 's/,autotools-dev/, autotools-dev, libmoldeo-dev/g' debian/control

#development
#sed -i -e '0,/, ${misc:Depends}/{s/, ${misc:Depends}/,${misc:Depends}/g}' debian/control
#sed -i -e '0,/<insert up to 60 chars description>/{s/<insert up to 60 chars description>/Moldeo Plugins, Dev Package/}'  debian/control

#binary
sed -i -e 's/${misc:Depends}/${misc:Depends}, moldeoplayer, libmoldeo, moldeoplugins, moldeosamples/g' debian/control
sed -i -e 's/<insert up to 60 chars description>/Moldeo 1.0/'  debian/control
sed -i -e 's/<insert long description, indented with spaces>/Moldeo 1.0 is a set of interface controls, bash scripts and other tools for Moldeo Platform. MoldeoControl, MoldeoJS, Molduino/g'  debian/control

sed -i -e 's/unstable/experimental/g' debian/changelog
sed -i -e 's/fabricio/Moldeo Interactive/g' debian/changelog
sed -i -e 's/Initial release (Closes: #nnnn)  <nnnn is the bug number of your ITP>/Initial release/g' debian/changelog
#sed -i -e 's///g'  debian/control
#
#sed -i -e 's///g' debian/control

echo "usr/bin" > debian/moldeonet.dirs
echo "usr/bin/nwjs" >> debian/moldeonet.dirs
echo "usr/bin/nwjs/locales" >> debian/moldeonet.dirs
echo "usr/share/applications" >> debian/moldeonet.dirs
echo "usr/share/moldeonet" >> debian/moldeonet.dirs


echo "debian/moldeonet/usr/bin/*" > debian/moldeonet.install
echo "debian/moldeonet/usr/bin/nwjs/*" >> debian/moldeonet.install
echo "debian/moldeonet/usr/bin/nwjs/locales/*" >> debian/moldeonet.install
echo "debian/moldeonet/usr/share/applications/*" >> debian/moldeonet.install
echo "debian/moldeonet/usr/share/moldeonet/*" >> debian/moldeonet.install

#echo "usr/lib" > debian/moldeonet-dev.dirs

#echo "usr/lib/moldeo/preeffects/lib*.a" > debian/moldeonet-dev.install

xed ../../control.amd64.11.10 debian/control ../../moldeonet.dirs debian/moldeonet.dirs ../../moldeonet.install debian/moldeonet.install ../../moldeonet-dev.dirs debian/moldeonet-dev.dirs ../../moldeonet-dev.install debian/moldeonet-dev.install debian/changelog

dpkg-buildpackage -us -uc -rfakeroot 2>&1 | tee ../../buildpkg_logs.txt

echo "Success: package generated"
exit 0
