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
    "browser_samples": "",
    "browser_userfolder": "",
    "browser_moldeolab" : "",
    "player_sdl2_exe": "moldeoplayersdl2",
    "player_sdl_exe": "moldeoplayersdl",
    "player_glut_exe": "moldeoplayerglut",
    "director_exe": "moldeodirector",
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
		config.moldeouser_path = config.home_path+"\\Documents\\Moldeo";

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
			
			console.log("fullArgv:"+gui.App.fullArgv+" dataPath:"+gui.App.dataPath+" process.execPath:"+process.execPath);		
		}

		if( config.IsLinux() ) {
			config.player_file_path = "";
			config.player_full_path = config.player_file_path + config.player_sdl2_exe;
            config.moldeo_path = "/usr/share/moldeo";
            config.data_path = config.moldeo_path + "/data";
            config.sample_path = config.data_path + "/samples";
			config.moldeouser_path = config.home_path+"/Moldeo";
		}	
	},

};
