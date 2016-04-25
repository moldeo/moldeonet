ACLOCAL_AMFLAGS=-I m4
SUBDIRS = MoldeoControl

#bindir = ${prefix}/bin
moldeonetdir = ${prefix}/share/moldeonet
desktopdir = ${prefix}/share/applications
nwjsdir=${prefix}/bin/nwjs
nwjslocalesdir=${nwjsdir}/locales

#dist_bin_DATA = moldeocontrol

#bin_PROGRAMS = 
bin_SCRIPTS = moldeocontrol
CLEANFILES = $(bin_SCRIPTS)
EXTRA_DIST = moldeocontrol.in

dist_bin_SCRIPTS = moldeocontrol
dist_moldeonet_DATA = moldeocontrol.sh
dist_desktop_DATA = moldeo.desktop

nwjs_DATA=${nwjsfiles}
nwjslocales_DATA=${nwjslocalesfiles}

install-data-hook:
	chmod +x $(nwjsexe)

