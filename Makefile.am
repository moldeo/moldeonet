ACLOCAL_AMFLAGS=-I m4
SUBDIRS = MoldeoControl

#bindir = ${prefix}/bin
moldeonetdir = ${prefix}/share/moldeonet
desktopdir = ${prefix}/share/applications
nwjsdir=${prefix}/bin/nwjs
nwjslocalesdir=${nwjsdir}/locales
nwjslibdir=${nwjsdir}/lib
nwjsswiftshaderdir=${nwjsdir}/swiftshader


#bin_PROGRAMS = 
bin_SCRIPTS = moldeo
CLEANFILES = $(bin_SCRIPTS)
EXTRA_DIST = AUTHORS moldeo.in configure.ac Makefile.am

dist_bin_SCRIPTS = moldeo
dist_moldeonet_DATA = moldeocontrol.sh MoldeoControl.nw
dist_desktop_DATA = moldeo.desktop

dist_nwjs_DATA = ${nwjsfiles}
dist_nwjslocales_DATA = ${nwjslocalesfiles}
dist_nwjslib_DATA = ${nwjslibfiles}
dist_nwjsswiftshader_DATA = ${nwjsswiftshaderfiles}

install-data-hook:
	chmod +rx ${DESTDIR}${nwjsexe}
