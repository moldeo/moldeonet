#!/usr/bin/python

# This work is

__version__ = "0.1"

from argparse import ArgumentParser

import os
from PIL import Image, ImageEnhance
import glob


parser = ArgumentParser(description="png2sprite",
                            epilog="Copyright (C) 2022 Fabrice Costa <fabricio.costa@moldeointeractive.com>",
                            )

parser.add_argument("--version", action="version",
                    version="%(prog)s " + __version__)

parser.add_argument("-fw", "--width", dest="width", default=256, type=int,
                    help="frame width (default: 256)")

parser.add_argument("-fh", "--heigth", dest="height", default=256, type=int,
                    help="frame height (default: 256)")

parser.add_argument("-fo", "--offset", dest="offset", default=0, type=int,
                    help="frame offset (default: 0)")

parser.add_argument("-ft", "--total", dest="total", default=8, type=int,
                    help="total frames (default: 8)")

parser.add_argument("-fs", "--step", dest="framestep", default=1, type=int,
                    help="frame step (default: 1)")

parser.add_argument("-o", "--output", dest="output", default="sprite.png", type=str,
                    help="output file (default: sprite.png)")

parser.add_argument("-ff", "--filter", dest="framefilter", default="", type=str,
                    help="frame filter (values: 'lum: 1.5' 'lum: 0.5' )")

parser.add_argument("image", help="image to convert", nargs="?")

args = parser.parse_args()

if not args.image:
    parser.error("required parameter: image")

#get your images using glob
iconMap = glob.glob(args.image)
iconMap.sort()
#just take the even ones
#iconMap = iconMap[::2]
print "##############################"
print "Images found #", len(iconMap)
print "Offset Frame: ", args.offset
print "Frame Step: ", args.framestep
print "Total Max Frames: ", args.total
print "Output: ", args.output
print "Images: ", args.image
print "##############################"
#print str(iconMap)
iconMap2 = []
c = 0
cs = 0
co = args.offset
t = 0
for filename in iconMap:

    #offset
    if (c>=co):

        if (cs==0):
            iconMap2.append(filename)
            t+= 1
            if (t==args.total):
                break;

        #step
        cs+=1

        if (cs==args.framestep):
            cs = 0

    c+=1


images = [ Image.open(filename) for filename in iconMap2 ]

if len(images)==0 or not images:
    parser.error("required parameter: image, check if the folder is empty or your syntax, use quotes!: \"mypngs/*.png\" ")

print "%d images will be combined." % len(images)

image_width, image_height = images[0].size

if (args.width != image_width or args.height != image_height):

    images[0] = images[0].resize( size=(args.width, args.height), resample=Image.BICUBIC )
    image_width, image_height = images[0].size

print "all images assumed to be %d by %d." % (image_width, image_height)

master_width = (image_width * len(images) )
#seperate each image with lots of whitespace
master_height = image_height
print "The sprite image will by %d by %d" % (master_width, master_height)
sprite = Image.new(
    mode='RGBA',
    size=(master_width, master_height),
    color=(0,0,0,0))  # fully transparent

for count, image in enumerate(images):

    if args.framefilter:
        if "lum: " in args.framefilter:
            factor = args.framefilter.split("lum: ")[1]
            print "enhance: lum: " + str(factor)
            enhancer = ImageEnhance.Brightness(image)
            image = enhancer.enhance(float(factor))

    resimage = image.resize( size=(args.width, args.height), resample=Image.BICUBIC )

    location = image_width * count

    print "%i: adding %s at %d..." % (count, iconMap2[count], location),

    sprite.paste(resimage,(location,0))

    print "added."

sprite.save(str(args.output))

print "OK saved output > "+str(args.output)
