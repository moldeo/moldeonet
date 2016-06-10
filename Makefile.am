ACLOCAL_AMFLAGS=-I m4
SUBDIRS = MoldeoControl

#bindir = ${prefix}/bin
moldeonetdir = ${prefix}/share/moldeonet
desktopdir = ${prefix}/share/applications
nwjsdir=${prefix}/bin/nwjs
nwjslocalesdir=${nwjsdir}/locales

#bin_PROGRAMS = 
bin_SCRIPTS = moldeo
CLEANFILES = $(bin_SCRIPTS)
EXTRA_DIST = AUTHORS moldeo.in configure.ac Makefile.am

dist_bin_SCRIPTS = moldeo
dist_moldeonet_DATA = moldeocontrol.sh MoldeoControl.nw
dist_desktop_DATA = moldeo.desktop

dist_nwjs_DATA = ${nwjsfiles}
dist_nwjslocales_DATA = ${nwjslocalesfiles}

install-data-hook:
	$(nwjsfilesunzip)$(nwjspermissions)
