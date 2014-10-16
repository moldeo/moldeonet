/**

	Utility tools (moldeo independent)

*/


var fs = require('fs');
var moment = require('moment');
var gui = require('nw.gui');
var today = moment();
var execFile = require('child_process').execFile, 
exec = require('child_process').exec,
child;

fs.copyFile = function(source, target, cb) {
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
	
	console.log("Call Program:" + programrelativepath
				+ " arguments:" + programarguments );
				
	child = exec( programrelativepath + " "+ programarguments,
		function(error,stdout,stderr) { 
			if (error) {
				console.log(error.stack); 
				console.log('Error code: '+ error.code); 
				console.log('Signal received: '+ 
				error.signal);
			} 
			console.log('Child Process stdout: '+ stdout);
			console.log('Child Process stderr: '+ stderr);
			if (callback) {
				callback();
			}
		}
	);
	child.on('exit', function (code) { 
		console.log('Child process exited '+'with exit code '+ code);
	});
}

fs.launchFile = function( file_open_path ) {

	console.log("Launching file:" + file_open_path );
	
	fs.callProgram( file_open_path );
	
}

fs.launchPlayer = function( project_file ) {
	
	console.log("Launching player: "+player_full_path+" " + project_file );
	
	fs.callProgram( '"'+player_full_path+'"', project_file, function() {
		console.log("Calling callback for: project_file: " + project_file);
	} );
	
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
		console.log("--ERROR-- " + msg );
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

function classActivated( element, class_name ) {
	if (!element) return error("classActivated() > Element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	var is_on = (actual_class.indexOf(class_name)>=0);
	return is_on;
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
				console.log( "actual_class: " + actual_class );
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
