#
# autoheader
# libtoolize
# automake –add-missing –foreign
# autoconf
# ./configure
# make
# make install
#
AC_INIT([MoldeoNet], [1.0.0.0], [info@moldeointeractive.com.ar], [moldeonet])

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


nwjsfiles=nwjs/nw nwjs/nwjc nwjs/nw.pak nwjs/credits.html nwjs/libffmpegsumo.so nwjs/icudtl.dat
nwjslocalesfiles=nwjs/locales/*.*
moldeonetdir=${prefix}/share/moldeonet
moldeocontroldir=${prefix}/share/moldeonet/moldeocontrol
nwjsdir=${prefix}/bin/nwjs
nwjsexe=${nwjsdir}/nw
nwjslocalesdir=${nwjsdir}/locales

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
	nwjsexe=${nwjsdir}/nwjs.app/Contents/MacOS/nwjs
	nwjsfiles=nwjs/nwjs.app nwjs/nwjc nwjs/credits.html
	nwjslocalesfiles=
  else
	echo
	echo "Error!"
	echo "Unknown host name"
	exit -1
  fi
])



AC_SUBST([moldeonetdir],$moldeonetdir)
AC_SUBST([moldeocontroldir],$moldeocontroldir)
AC_SUBST([nwjsdir],$nwjsdir)
AC_SUBST([nwjsexe],$nwjsexe)
AC_SUBST([nwjslocalesdir],$nwjslocalesdir)
AC_SUBST([nwjsfiles],$nwjsfiles)
AC_SUBST([nwjslocalesfiles],$nwjslocalesfiles)

AC_CONFIG_FILES([moldeocontrol], [chmod +x moldeocontrol])

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
]
)
