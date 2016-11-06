#!/bin/bash
VERSO=$1
moldeoplayersdl2 -mol /media/DATA/0_DESARROLLO/0_MOLDEO/0_desarrollo/Investigacion/Narrativas Interactivas/GirondoExpandido/girondo/girondo.mol &
MOLDEO=$!
echo $MOLDEO > moldeo.id

