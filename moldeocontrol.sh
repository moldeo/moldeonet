#!/bin/bash
ARG1=$1
ARG2=`pwd`
platform='unknown'
processor='unknown'
unamestr=`uname`
unameprocessor=`uname -p`
if [[ "$unamestr" == 'Linux' ]]; then
   platform='linux'
elif [[ "$unamestr" == 'FreeBSD' ]]; then
   platform='freebsd'
fi

processor="$unameprocessor"
echo "procesor is $processor"
echo "platform is $platform"
echo "copying config.init.js to moldeocontrol"
cp config.init.js MoldeoControl/config.init.js
#if [[ $platform == 'linux' ]]; then
#elif [[ $platform == 'freebsd' ]]; then
#fi
nwjs/nw MoldeoControl $1 $ARG2 --enable-transparent-visuals --disable-gpu --verbose
