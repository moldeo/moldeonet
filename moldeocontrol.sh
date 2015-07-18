#bin/linux/nw MoldeoControl

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

#if [[ $platform == 'linux' ]]; then
#elif [[ $platform == 'freebsd' ]]; then
#fi
nwjs/nw MoldeoControl
