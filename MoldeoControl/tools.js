/**

	Utility tools (moldeo independent)

*/


var fs = require('fs');
var path = require('path');
var moment = require('moment');
var gui = require('nw.gui');
var today = moment();
var execFile = require('child_process').execFile, 
exec = require('child_process').exec,
spawn = require('child_process').spawn,
child;
/*
var  out = fs.openSync('./out.log', 'a'),
     err = fs.openSync('./out.log', 'a');
	 */
var win = gui.Window.get();

fs.copyFile = function(source, target, cb) {
	
  if (config.log.full) console.log("called fs.copyFile from source: " + source + " to:" + target + " cb:" + cb);
	
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      if (cb!=undefined) cb(err);
      cbCalled = true;
    }
  }
}


fs.callProgram = function( programrelativepath, programarguments, callback ) {
	try {
		moCI.console.log("Call Program: programrelativepath:",programrelativepath
					," programarguments:",programarguments );
					
		
		child = exec( programrelativepath + " "+ programarguments,
			function(error,stdout,stderr) { 
				if (error) {
					//console.log(error.stack); 
					//console.log('Error code: '+ error.code); 
					//console.log('Signal received: '+ 
					//error.signal);
				} 
				//console.log('Child Process stdout: '+ stdout);
				//console.log('Child Process stderr: '+ stderr);
				if (callback) {
					callback();
				}
			}
		);
		
		child.on('exit', function (code) { 
			//moCI.console.log('Child process exited '+'with exit code '+ code);
		});
		
		programarguments = programarguments.trim();
		var args = programarguments.split(" ");
		moCI.console.log("Program:",programrelativepath," args:",args);
		
		//child = spawn( programrelativepath, []);
		
		child.unref();
	} catch(err) {
		moCI.console.error("fs.callProgram > ", err);
		alert(err);
	}
}

fs.launchFile = function( file_open_path ) {

	moCI.console.log("Launching file:" + file_open_path );
	
	moCI.fs.callProgram( file_open_path );
	
}

fs.launchPlayer = function( project_file ) {
	if (config.player_full_path==undefined || config.player_full_path=="") {
		moCI.console.error("fs.launchPlayer > config.player_full_path is undefined");
		return false;
	}
	moCI.console.log("fs.launchPlayer > player_full_path:",config.player_full_path," project_file:",project_file );
		
	return moCI.fs.callProgram( '"'+config.player_full_path+'"', project_file, function() {
		//console.log("Calling callback for: project_file: " + project_file);
	} );
	
}

fs.launchRender = function( render_call, options ) {
	
	var new_render_call = config.home_path+"/render_video.bat";
	
	fd = fs.openSync( new_render_call,"w" );
	fs.write( fd, render_call + options );
	
	return moCI.fs.callProgram( new_render_call, options, function() {
		console.log("fs.launchRender > Calling callback for: project_file");
	} );
}

fs.walk = function (currentDirPath, callback) {
    moCI.fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = moCI.fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
			callback(filePath, stat);
            moCI.fs.walk(filePath, callback);
        }
    });
}


/*
var combinationStates = {
	"fxselected",
	"object_enabled"
};

function recombineClasses( element ) {
	
	if (	classActivated("fxselected") 
			&&
			classActivated("object_enabled")) {
		activateClass("object_enabled_selected");
	}
}
*/
if (error==undefined) {
	function error(msg) {
		console.error("--ERROR-- ",msg );
	}
}

function activateClass( element, class_name, trigger_time, trigger_callback  ) {

	if (!element) return error("activateClass() > Element not defined: " + element + " class_name:" + class_name );

	var actual_class = element.getAttribute("class");
	
	if (actual_class) {
			var is_on = (actual_class.indexOf(class_name)>=0);
			if (!is_on) {
				element.setAttribute( "class", actual_class+" "+class_name );
			}
	} else element.setAttribute( "class", class_name );

	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}

var elementclassError;
function classActivated( element, class_name ) {
	if (!element) return console.error("classActivated() > Element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	//console.log("actual_class:"+actual_class);
	if (actual_class!=undefined && actual_class!="") {
		var is_on = (actual_class.indexOf(class_name)>=0);
		return is_on;
	}
	return false;
}

function deactivateClass( element, class_name, trigger_time, trigger_callback  ) {
	if (!element) console.error("element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	if (actual_class) {
			var position = actual_class.indexOf(class_name);
			var is_on = (position>=0);
			if (is_on) {
				
				if (position==0)/*is first*/
						actual_class = actual_class.replace( new RegExp(class_name,"g"), "" );
				else 
				if( (position+class_name.length)==actual_class.length) /*is last*/
						actual_class = actual_class.replace( new RegExp(" "+class_name,"g"), "" );

				actual_class = actual_class.replace( new RegExp(" "+class_name+" ","g"), " " );				
				element.setAttribute( "class", actual_class );
				if (console.log.full) console.log( "actual_class: " + actual_class );
			}
	} else element.setAttribute( "class", class_name );
	
	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}



function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function rgbToHex2(rgb){
	return '#' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showdiv( ID ) {						
	var el = document.getElementById(ID);
	if (el) {
		el.style.display = 'block';
	} else alert( "div undefined: "+ID );
}
	
function hidediv( ID ) {						
	var el = document.getElementById(ID);
	if (el) {
		el.style.display = 'none';
	} else alert( "div undefined: "+ID );
}

function togglediv( ID ) {						
	var el = document.getElementById(ID);
	if (el.style.display == 'block') {
		el.style.display = 'none'
	} else {
		el.style.display = 'block'
	}
}
