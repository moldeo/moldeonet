#
# autoheader
# libtoolize
# automake –add-missing –foreign
# autoconf
# ./configure
# make
# make install
#
AC_INIT([MoldeoNet], [1.4.0.2], [info@moldeointeractive.com.ar], [moldeonet])

AM_INIT_AUTOMAKE
AC_CONFIG_MACRO_DIR([m4])

AC_LIBTOOL_CONFIG

AC_PROG_CC
AC_PROG_CC_STDC
AC_C_CONST
AC_PROG_LIBTOOL
AM_PROG_LIBTOOL

AC_PROG_CXX
AC_PROG_CXXCPP
AC_PROG_CXX_C_O


dnl Set install paths.
if test "x$prefix" = "xNONE" ; then
  prefix="/usr/local"
fi
if test "x$exec_prefix" = "xNONE" ; then
  exec_prefix=$prefix
fi

case "$host" in
        *-*-mingw*|*-*-cygwin*)
                AC_DEFINE(PLATFORM_WIN32, 1, [Platform is Win32])
                PLATFORM_STRING="Win32"
                ;;
        *-*-linux*)
                AC_DEFINE(PLATFORM_LINUX, 1, [Platform is Linux])
                PLATFORM_STRING="Linux"
                ;;
        *-*-darwin*)
		AC_MSG_WARN([Hello])
                AC_DEFINE(PLATFORM_APPLE, 1, [Platform is Apple])
                PLATFORM_STRING="Apple"
                ;;
        *)
                AC_MSG_WARN([*** Please add $host to configure.ac checks!])
                ;;
esac


case "$host" in
        i?86-* | k?-* | athlon-* | pentium*-)
                AC_DEFINE(ARCH_X86, 1, [Architecture is x86])
                ARCH_SPECIFIC_CFLAGS=""
                ARCH_STRING="X86"
                ;;
        x86_64-*)
                AC_DEFINE(ARCH_X86_64, 1, [Architecture is x86-64])
                ARCH_SPECIFIC_CFLAGS="-DUSE_ADDR64"
                ARCH_STRING="X86-64"
                with_boost_libdir="/usr/lib/x86_64-linux-gnu"
                libdir=$prefix"/lib"
                ;;
        ppc-* | powerpc-*)
		AC_MSG_WARN([HI THERE!])
                AC_DEFINE(ARCH_PPC, 1, [Architecture is PowerPC])
                ARCH_SPECIFIC_CFLAGS=""
                ARCH_STRING="PowerPC"
                ;;
        *)
                AC_MSG_ERROR([Unknown Architecture])
                ;;
esac

nwjsfiles="nwjs/nw nwjs/credits.html nwjs/nw_100_percent.pak  nwjs/nw_200_percent.pak  nwjs/resources.pak nwjs/icudtl.dat nwjs/v8_context_snapshot.bin"
#nwjsfiles="nwjs/nw nwjs/nwjc nwjs/nw.pak nwjs/credits.html nwjs/libffmpegsumo.so nwjs/icudtl.dat"
nwjslocalesfiles=nwjs/locales/*.*
nwjslibfiles=nwjs/lib/*.*
nwjsswiftshaderfiles=nwjs/swiftshader/*.*
moldeonetdir=${prefix}/share/moldeonet
moldeocontroldir=${moldeonetdir}/moldeocontrol
moldeocontrolapp=${moldeonetdir}/MoldeoControl.nw
nwjsdir=${prefix}/bin/nwjs
nwjsexe=${nwjsdir}/nw
nwjslocalesdir=${nwjsdir}/locales
nwjslibdir=${nwjsdir}/lib
nwjsswiftshaderdir=${nwjsdir}/swiftshader
nwjsfileszip=
nwjsfilesunzip=
nwjspermissions=
# && cd ${DESTDIR}${moldeocontroldir} && npm install"

AC_ARG_ENABLE(host,
[--enable-host[=host name] Specify the host os name:
			64: 64 bit linux os [default]
			86: 32 bits linux os
            raspbian: RASPBIAN/debian 8 32 bits
            xosx: Mac OSX with mac ports],
[ if test "x$enableval" = "x86" ; then
	host_name="86"
  elif test "x$enableval" = "x64" ; then
	host_name="64"
  elif test "x$enableval" = "xraspbian" ; then
	host_name="raspbian"

  elif test "x$enableval" = "xosx" ; then
    	host_name="osx"
	nwjsexe="${nwjsdir}/nwjs.app/Contents/MacOS/nwjs"
	nwjsfiles="nwjs/nwjs.app.zip nwjs/nwjc nwjs/credits.html"
	nwjsfileszip="${nwjsdir}/nwjs.app.zip"
    nwjsfilesunzip="unzip ${nwjsfileszip} -d ${nwjsdir} && "
	nwjslocalesfiles=
    nwjspermissions="chmod -R +rx ${nwjsdir}/nwjs.app && chown -R root:wheel ${nwjsdir}/nwjs.app"
  else
	echo
	echo "Error!"
	echo "Unknown host name"
	exit -1
  fi
])


AC_SUBST([nwjsfilesunzip],$nwjsfilesunzip)
AC_SUBST([moldeonetdir],$moldeonetdir)
AC_SUBST([moldeocontroldir],$moldeocontroldir)
AC_SUBST([moldeocontrolapp],$moldeocontrolapp)

AC_SUBST([nwjsdir],$nwjsdir)
AC_SUBST([nwjsexe],$nwjsexe)
AC_SUBST([nwjslocalesdir],$nwjslocalesdir)
AC_SUBST([nwjslibdir],$nwjslibdir)
AC_SUBST([nwjsswiftshaderdir],$nwjsswiftshaderdir)
AC_SUBST([nwjsfiles],$nwjsfiles)
AC_SUBST([nwjslocalesfiles],$nwjslocalesfiles)
AC_SUBST([nwjslibfiles],$nwjslibfiles)
AC_SUBST([nwjsswiftshaderfiles],$nwjsswiftshaderfiles)
AC_SUBST([nwjspermissions],$nwjspermissions)

AC_CONFIG_FILES([moldeo], [chmod +x moldeo])
AC_CONFIG_SUBDIRS()

dnl autoscan results
AC_CHECK_FUNCS([floor])
AC_CHECK_FUNCS([getcwd])
AC_CHECK_FUNCS([memmove])
AC_CHECK_FUNCS([memset])
AC_CHECK_FUNCS([pow])
AC_CHECK_FUNCS([rint])
AC_CHECK_FUNCS([sqrt])
AC_CHECK_FUNCS([strchr])
AC_CHECK_FUNCS([strstr])
AC_CHECK_HEADERS([fcntl.h])
AC_CHECK_HEADERS([float.h])
AC_CHECK_HEADERS([limits.h])
AC_CHECK_HEADERS([stddef.h])
AC_CHECK_HEADERS([stdlib.h])
AC_CHECK_HEADERS([string.h])
AC_CHECK_TYPES([ptrdiff_t])
AC_C_INLINE
AC_FUNC_MALLOC
AC_FUNC_MEMCMP
AC_FUNC_VPRINTF
AC_HEADER_STDBOOL
AC_HEADER_STDC
AC_PREREQ
AC_PROG_CPP
AC_PROG_CXX
AC_PROG_INSTALL
AC_PROG_LN_S
AC_PROG_MAKE_SET
LT_INIT
AC_STRUCT_TM
AC_TYPE_SIZE_T

AC_OUTPUT([
    Makefile
    MoldeoControl/Makefile
    moldeo.desktop
])
