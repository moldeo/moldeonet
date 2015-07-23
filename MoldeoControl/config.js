/*    XULRUNNER FCA's "fs" object compatibility*/
var OS = require('os');
var osenv = require('osenv')
var gui = require('nw.gui');
//gui.Screen.Init();

var config = {
    "platform": OS.platform(),
    "release_mode": "develop" /*"production"*/,
	"release_version": "1.0",
	
	"log": {
		"full": false,
		"save": false,
		"logfile": "",
	},
	
    "player_file_path": "",
	"home_path": "",
	
	"bin_path": "",
	"moldeo_path": "",
	"data_path": "",
	"sample_path": "",
	"plugin_path": "",
	"moldeouser_path": "",
	"user_path": "",
	"desktop_path": "",
    "browser_samples": "",
    "browser_userfolder": "",
    "browser_moldeolab" : "",
    "player_sdl2_exe": "moldeoplayersdl2",
    "player_sdl_exe": "moldeoplayersdl",
    "player_glut_exe": "moldeoplayerglut",
    "director_exe": "moldeodirector",
	"render": {
		"session": null,/*receive session["rendered_folder"]*/
	},
	"render_video_pipes": {
		"linux": {
			"ogg": {
				ogg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				msmp4: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_msmpeg4 ! avimux ! filesink location="{VIDEONAME}.mp4"',				
			},
			"avi": {
				mjpeg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				wmv: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',
			},
			"mov": {
				mjpeg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
		},
		"win32": {
			"ogg": {
				ogg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				mp4: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',				
			},
			"avi": {
				mjpeg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264low: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				wmv: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',
			},
			"mov": {
				mjpeg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264low: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264high: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)24/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
		},
		"win64": {			
		},		
		"mac": {			
		},
	},
	"IsWindows": function() {
		return config.platform.indexOf("win")>=0;
	},
	"IsLinux": function() {
		return config.platform.indexOf("linux")>=0;
	},
	"IsOsx": function() {
		return config.platform.indexOf("mac")>=0;
	},
	"Init": function( options ) {

		//config.bin_path = osenv.path();
		config.user = osenv.user();
		config.home_path = osenv.home();

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

			config.bin_path = config.player_file_path;
			config.moldeo_path = config.bin_path.replace(/\\bin\\win\\/gi,'');
			config.data_path = config.moldeo_path + "\\data";
			config.sample_path = config.data_path + "\\samples";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
			config.moldeouser_path = config.home_path+"\\Documents\\Moldeo";
			config.desktop_path = config.home_path+"\\Desktop";
					
			console.log("fullArgv:"+gui.App.fullArgv+" dataPath:"+gui.App.dataPath+" process.execPath:"+process.execPath);		
		}

		if( config.IsLinux() ) {
			config.player_file_path = "";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
            config.moldeo_path = "/usr/share/moldeo";
            config.data_path = config.moldeo_path + "/data";
            config.sample_path = config.data_path + "/samples";
			config.moldeouser_path = config.home_path+"/Moldeo";
			config.desktop_path = config.home_path+"/Desktop";
		}	
	},

};
