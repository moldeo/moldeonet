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
gedit ../../control debian/control ../../moldeonet.dirs debian/moldeonet.dirs ../../moldeonet.install debian/moldeonet.install ../../moldeonet-dev.dirs debian/moldeonet-dev.dirs ../../moldeonet-dev.install debian/moldeonet-dev.install debian/changelog

echo " 
Now execute: 
 cd deb/moldeonet-*
 dpkg-buildpackage -us -uc -rfakeroot 2>&1 | tee ../../buildpkg_logs.txt
"


echo "Success: extraction"
exit 0
