/*    XULRUNNER FCA's "fs" object compatibility*/
var player_file_path = "D:\\0_DESARROLLO\\0_MOLDEO\\0_desarrollo\\SVNSOURCEFORGE\\binaries\\bin\\win\\";
player_file_path = "";

if (player_file_path=="") {
	var gui = require('nw.gui');
	console.log("fullArgv:"+gui.App.fullArgv+" dataPath:"+gui.App.dataPath+" process.execPath:"+process.execPath);
	
	ppath = process.execPath;
	
	player_file_path = ppath.replace( /nw\.exe/g , '');
	
	console.log(" player_file_path:" + player_file_path );
}

var player_sdl2_exe = "moldeoplayersdl2.exe";
var player_sdl_exe = "moldeoplayersdl.exe";
var player_glut_exe = "moldeoplayerglut.exe";
var director_exe = "moldeodirector.exe";




var player_full_path = player_file_path + player_sdl2_exe;