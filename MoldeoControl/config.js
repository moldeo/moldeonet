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
		"full": false,
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
	"user_path": "",
	"desktop_path": "",
	"browser_window_options": {
		icon: "moldeocontrol.png",
		focus: false,						
		toolbar: false,
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
	"render_video_pipes": {
		"linux": {
			"ogg": {
				ogg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				msmp4: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_msmpeg4 ! avimux ! filesink location="{VIDEONAME}.mp4"',				
			},
			"avi": {
				mjpeg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				wmv: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',
			},
			"mov": {
				mjpeg: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264low: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264high: '"gst-launch-0.10" -v -m multifilesrc location="{FRAMEPATH}/frame_%07d.jpg" index=0 caps=image/jpeg,framerate='+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
		},
		"win32": {
			"ogg": {
				ogg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! theoraenc ! oggmux ! filesink location="{VIDEONAME}.ogg"',
			},
			"mp4": {
				mp4: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.mp4"',				
			},
			"avi": {
				mjpeg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264low: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				h264high: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! avimux ! filesink location="{VIDEONAME}.avi"',
				
				wmv: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! ffenc_wmv2 ! avimux ! filesink location="{VIDEONAME}.avi"',
			},
			"mov": {
				mjpeg: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! jpegenc ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264low: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=10000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=50000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
				
				h264high: '"gst-launch" -v -m multifilesrc location="{FRAMEPATH}/frame_%%07d.jpg" index=0 caps=image/jpeg,framerate=\(fraction\)'+config_fps+'/1 ! jpegdec ! ffmpegcolorspace ! videorate ! x264enc qp-min=18 byte-stream=1 bitrate=100000 threads=0 pass=5 ! ffmux_mov ! filesink location="{VIDEONAME}.mov"',
			},
		},
		"win64": {			
		},		
		"mac": {			
		},
	},
	"IsWindows": function() {
		return config.platform.indexOf("wind")>=0;
	},
	"IsLinux": function() {
		return config.platform.indexOf("linux")>=0;
	},
	"IsOsx": function() {
		return config.platform.indexOf("darwin")>=0 || config.platform.indexOf("osx")>=0;
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
			config.sample_path = config.moldeo_path + "\\samples";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
			config.moldeouser_path = config.home_path+"\\Documents\\Moldeo";
			config.desktop_path = config.home_path+"\\Desktop";
			config.moldeo_version = config.bin_path+"/moldeoversion.txt";
					
			console.log("fullArgv:"+gui.App.fullArgv+" dataPath:"+gui.App.dataPath+" process.execPath:"+process.execPath);		
		}

		if( config.IsLinux() ) {
			config.player_file_path = "";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
            		config.moldeo_path = "/usr/share/moldeo";
            		config.data_path = config.moldeo_path + "/data";
            		config.sample_path = config.moldeo_path + "/samples";
			config.moldeouser_path = config.home_path+"/Moldeo";
			config.desktop_path = config.home_path+"/Desktop";
			config.moldeo_version = config.moldeo_path+"/moldeoversion.txt";
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
			config.desktop_path = config.home_path+"/Desktop";
			config.moldeo_version = config.moldeo_path+"/moldeoversion.txt";
            
            console.log("fullArgv:",gui.App.fullArgv," dataPath:",gui.App.dataPath," process.execPath:",process.execPath,"process.cwd():",process.cwd());
            console.log("config",config);
		}
	},

};
