/*    XULRUNNER FCA's "fs" object compatibility*/
var OS = require('os');
var osenv = require('osenv')
var gui = require('nw.gui');
var win = gui.Window.get();
/*
var screen = gui.Screen;
screen.Init();
*/
var config_fps = "25";
var config = {
    "platform": OS.platform(),
    "release_mode": "develop" /*"production"*/,

	"log": {
    "player": false,
		"full": true,
		"save": false,
		"logfile": "",
	},

    "player_file_path": "",
	"home_path": "",

	"bin_path": "",
	"moldeo_path": "",
	"moldeo_version": "",
	"data_path": "",
	"sample_path": "",
	"plugin_path": "",
	"moldeouser_path": "",
  "moldeorecents_path": "",
	"user_path": "",
	"desktop_path": "",
  "process_path": "",
  "process_png2sprite": "",
	"browser_window_options": {
		icon: "moldeocontrol.png",
		focus: false,
		/*toolbar: false,*/
		frame: false,
		width: win.width,
		height: 280,
		position: "center",
	},
    "browser_samples": "",
    "browser_userfolder": "",
    "browser_moldeolab" : "",
    "player_sdl2_exe": "moldeoplayersdl2",
    "player_sdl_exe": "moldeoplayersdl",
    "player_glut_exe": "moldeoplayerglut",
    "director_exe": "moldeodirector",
	"render": {
		"session": null,/*receive session["rendered_folder"]*/
		"frame_quality": "JPGGOOD",
		"frame_qualities": {
			"Bad (jpg 10%)": "JPGBAD",
			"Average (jpg 25%)": "JPGAVERAGE",
			"Normal (jpg 50%)": "JPG",
			"Good (jpg 75%)": "JPGGOOD",
			"Superb (jpg 100%)": "JPGSUPERB",
			"Excellent (png 24 bits)": "PNG",
			"Transparency (png 32 bits)": "PNGALPHA",
			"Raw (tga)": "TGA",
		},
	},
	"versioning": {
		"release_version": {
			"release": 0,
			"release candidate": 1,
			"beta": 2,
			"alpha": 3,
		},
	},
    "gstreamer": {
        "version": 1,
        "GSTBIN": "",
        "GSTLAUNCH": "gst-launch-1.0",
        "COLORFILTER": "videoconvert",
		"H264ENCODE": {
			"linux": {
				"low": "x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5",
				"normal": "x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5",
				"high": "x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5"
			},
			"win32": {
				"low": "x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5",
				"normal": "x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5",
				"high": "x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5"
			},
			"darwin": ""
		},
    },
    "imagemagick": {
      'convert': 'convert -delay 10 -loop 0 -alpha copy -dispose Background  {FRAMEPATH}/*.png {VIDEONAME}.gif'
    },
  "audio_video_pipes": {
    "linux": {
      "ogg": {
        ogg: '"{GSTBIN}{GSTLAUNCH}" -v pulsesrc device=alsa_output.pci-0000_00_1b.0.analog-stereo.monitor ! audioconvert ! vorbisenc ! oggmux ! filesink location="{SOUNDNAME}.ogg"'
      }
    }
  },
	"render_video_pipes": {
		"linux": {
			"ogg": {
				ogg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

				h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

				h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videoflip ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

				msmp4: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! ffenc_msmpeg4 ! avimux ! filesink location="{VIDEONAME}.mp4"',
			},
			"avi": {
				mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',

				wmv: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',

        huff: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.png" ! decodebin ! videorate ! videoconvert ! video/x-raw,format=BGRA,framerate='+config_fps+'/1 ! avenc_huffyuv ! avimux ! filesink location="{VIDEONAME}.avi"'
			},
			"mov": {
				mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
      "gif": {
        gif: 'convert -delay 10 -loop 0 -alpha copy -dispose Background  "{FRAMEPATH}/*.png" {VIDEONAME}.gif'
      },
      "png": {
        sprite_256x256x8: '{PROCESSPNG2SPRITE} -fw 256 -fh 256 -fo 2 -fs 10  -ft 8 -o {VIDEONAME}.png "{FRAMEPATH}/*.png"',
        sprite_128x128x16: '{PROCESSPNG2SPRITE} -fw 128 -fh 128 -fo 2 -fs 5 -ft 16 -o {VIDEONAME}.png "{FRAMEPATH}/*.png"',
        sprite_64x64x16: '{PROCESSPNG2SPRITE} -fw 64 -fh 64 -fo 2 -fs 5 -ft 16 -o {VIDEONAME}.png "{FRAMEPATH}/*.png"',
        sprite_32x32x16: '{PROCESSPNG2SPRITE} -fw 32 -fh 32 -fo 2 -fs 5 -ft 16 -o {VIDEONAME}.png "{FRAMEPATH}/*.png"',
        sprite_16x16x8: '{PROCESSPNG2SPRITE} -fw 16 -fh 16 -fo 2 -fs 10 -ft 8 -o {VIDEONAME}.png "{FRAMEPATH}*.png"'
      }
		},
		"win32": {
			"ogg": {
				ogg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				mp4: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE_HIGH} ! avimux ! filesink location="{VIDEONAME}.mp4"',
			},
			"avi": {
				mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE_LOW} ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE} ! avimux ! filesink location="{VIDEONAME}.avi"',

				h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE_HIGH} ! avimux ! filesink location="{VIDEONAME}.avi"',

				wmv: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',
			},
			"mov": {
				mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE_LOW} ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE} ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',

				h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! {H264ENCODE_HIGH} ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
		},
		"win64": {
		},
		"darwin": {
            "ogg": {
            ogg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
            h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

            h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

            h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',

			},
			"avi": {
            mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',

            h264low: '{GSTBIN}{GSTLAUNCH} -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',

            h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',

            h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',


			},
			"mov": {
            mjpeg: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! jpegenc ! qtmux ! filesink location="{VIDEONAME}.mov"',

            h264low: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! qtmux ! filesink location="{VIDEONAME}.mov"',

            h264: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! qtmux ! filesink location="{VIDEONAME}.mov"',

            h264high: '"{GSTBIN}{GSTLAUNCH}" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! {COLORFILTER} ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! qtmux ! filesink location="{VIDEONAME}.mov"',
			},
		},
	},
	"IsWindows": function() {
		return config.platform.indexOf("win32")>=0;
	},
	"IsLinux": function() {
		return config.platform.indexOf("linux")>=0 || config.platform.indexOf("freebsd")>=0 || config.platform.indexOf("sunos")>=0;
	},
	"IsOsx": function() {
		return config.platform.indexOf("darwin")>=0;
	},
	"Init": function( options ) {

		//config.bin_path = osenv.path();
		config.user = osenv.user();
		config.home_path = osenv.home();
    config.custom_path = "";

		if (options) {
			for( var option in options ) {
				this[option] = options[option];
			}
		}


		if ( config.IsWindows() ) {

			config.player_sdl2_exe = "moldeoplayersdl2.exe";
			config.player_sdl_exe = "moldeoplayersdl.exe";
			config.player_glut_exe = "moldeoplayerglut.exe";
			config.director_exe = "moldeodirector.exe";

			if (config.player_file_path=="") {
				ppath = process.execPath;
				config.player_file_path = ppath.replace( /nw\.exe/g , '');
				console.log(" player_file_path:" + config.player_file_path );
			}

			config.player_full_path = config.player_file_path + config.player_sdl2_exe;

			config.bin_path = config.player_file_path;
			config.moldeo_path = config.bin_path.replace(/\\bin\\win\\/gi,'');
			config.data_path = config.moldeo_path + "\\data";
            		config.basic_path = config.data_path + "\\basic";
					config.sample_path = config.data_path + "\\samples";
					config.taller_path = config.data_path + "\\taller";

			config.moldeouser_path = config.home_path+"\\Documents\\Moldeo";
      config.moldeorecents_path = config.moldeouser_path+"\\.recents";
			config.desktop_path = config.home_path+"\\Desktop";
			config.moldeo_version = config.bin_path+"/moldeoversion.txt";

      config.process_path = process.cwd();
      config.process_png2sprite =  config.process_path + "/lib/png2sprite.py";

			console.log("fullArgv:"+gui.App.fullArgv+" dataPath:"+gui.App.dataPath+" process.execPath:"+process.execPath);
		}

		if( config.IsLinux() ) {
			config.player_file_path = "";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
            		config.moldeo_path = "/usr/share/moldeo";
            		config.data_path = config.moldeo_path + "/data";
            		config.basic_path = config.moldeo_path + "/basic";
					config.sample_path = config.moldeo_path + "/samples";
					config.taller_path = config.moldeo_path + "/taller";
			config.moldeouser_path = config.home_path+"/Moldeo";
      config.moldeorecents_path = config.moldeouser_path+"/.recents";
			config.desktop_path = config.home_path+"/Desktop";
			config.moldeo_version = config.moldeo_path+"/moldeoversion.txt";

      config.process_path = process.cwd();
      config.process_png2sprite =  '/usr/bin/python ' + config.process_path + "/lib/png2sprite.py";
      console.log("fullArgv:",gui.App.fullArgv," dataPath:",gui.App.dataPath," process.execPath:",process.execPath,"process.cwd():",process.cwd());
      console.log("config",config);
		}


		if( config.IsOsx() ) {
            config.bin_path = process.cwd().replace("Resources/app.nw","MacOS/");

			config.player_file_path = config.bin_path;
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
            //config.moldeo_path = "/opt/local/share/moldeo";
            config.moldeo_path = process.cwd().replace("/app.nw","");
            config.data_path = config.moldeo_path + "/data";
            config.sample_path = config.moldeo_path + "/samples";
			config.moldeouser_path = config.home_path+"/Moldeo";
      config.moldeorecents_path = config.moldeouser_path+"/.recents";
			config.desktop_path = config.home_path+"/Desktop";
			config.moldeo_version = config.moldeo_path+"/moldeoversion.txt";

      config.process_path = process.cwd();
      config.process_png2sprite =  config.process_path + "/lib/png2sprite.py";

            config.gstreamer.GSTBIN = "/Library/Frameworks/GStreamer.framework/Versions/1.0/bin/";

            console.log("fullArgv:",gui.App.fullArgv," dataPath:",gui.App.dataPath," process.execPath:",process.execPath,"process.cwd():",process.cwd());
            console.log("config",config);
		}
	},

};
