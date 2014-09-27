var fs = require('fs');
var moment = require('moment');
var gui = require('nw.gui');

var execFile = require('child_process').execFile, 
exec = require('child_process').exec,
child;


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

fs.chooseFile = function( idinput ) {
	var chooser = document.querySelector( idinput );
	
    chooser.addEventListener("change", function(evt) {
      console.log(this.value);
    }, false);
	
	chooser.click();
}



/*END XULRUNNER FCA's "fs" object compatibility END*/


var osc = require('node-osc');
//var ioserver = require('socket.io').listen(8081);

var oscServer, oscClient;
var configOsc = {
				/*MoldeoControl listen to MoldeoPlayer Server in port 3335*/
                server: {
                    port: 3335,
                    host: '127.0.0.1'
                },
				
				/**MoldeoControl Speak to MoldeoPlayer as a Client in port 3334*/
                client: {
                    port: 3334,
                    host: '127.0.0.1'
                }
            };

oscServer = new osc.Server( configOsc.server.port, configOsc.server.host);
oscClient = new osc.Client( configOsc.client.host, configOsc.client.port);

oscServer.on('message', function(msg, rinfo) {
  //console.log( "oscServer.on('message'.....) receive ! msg: " + msg, ' rinfo:' + rinfo);  
  console.log( "oscServer.on('message'.....) receive ! msg: " +JSON.stringify(msg[2],"", "\n") );
  //socket.emit("message", msg);
  var object_regexp = /({.*})/i
  //var data = msg.match( object_regexp );
  var  moldeoapimessage = msg[2];
  var moldeo_message_int = moldeoapimessage[0];
  var moldeo_message_code = moldeoapimessage[1];
  var moldeo_message_target = moldeoapimessage[2];
  var objectinfo = moldeoapimessage[3];
  
  var moldeo_message_int = moldeoapimessage[0];
  var moldeo_message_code = moldeoapimessage[1];
  var moldeo_message_target = moldeoapimessage[2];
  var objectinfo = moldeoapimessage[3];
  var moldeo_message_info;
  
  if (objectinfo) {
	objectinfo = objectinfo.replace( /\'/g , '"');
	objectinfo = objectinfo.replace( /\\/g , '\\\\');
	console.log( "oscServer.on('message'.....) objectinfo:"+objectinfo);
	moldeo_message_info = JSON.parse( objectinfo );
  }
  
  console.log( "\n" + "moldeoapimessage: moldeo_message_int:"+ moldeo_message_int
			+	"\n" + "moldeo_message_code: " + moldeo_message_code
			+	"\n" + "moldeo_message_target: " + moldeo_message_target
			+	"\n" + "moldeo_message_info: " + moldeo_message_info ); 
			
	if (moldeo_message_code=="effectgetstate") {
	
		console.log("processing api message: effectgetstate" );
		// use moldeo_message_target, 
		// to update all controls that 
		// are observers of the object states
		var effect_label_name = moldeo_message_target;
		var effect_activated = moldeo_message_info["Activated"];
		var fxbuttons = document.getElementsByClassName(effect_label_name);
		
		console.log( "fxbuttons:"  + fxbuttons);
		for( var i=0; i<fxbuttons.length; i++ ) {
			var fxbutton = fxbuttons[i];
			console.log( "fxbutton: i: "  + i + " html: " + fxbutton.outerHTML );
			if (fxbutton) {
				console.log( "fxbutton: is activated ? " + effect_activated );
				if ( effect_activated == '1' ) {
					console.log( "activating fxbutton:" );
					activateClass( fxbutton, "object_enabled" );
				} else { /* -1 */
					console.log( "deactivating fxbutton:" );
					deactivateClass( fxbutton, "object_enabled" );
				}
				//recombineClasses( fxbutton );
			}
		}
			
		if (Editor.ObjectSelected==effect_label_name) {
			Editor.States[effect_label_name] = moldeo_message_info;
			UpdateState(effect_label_name);
		}
		
	}
	
	
	if (moldeo_message_code=="objectget") {
		console.log("processing api message: objectget > " +  moldeo_message_info);
				
		UpdateEditor( moldeo_message_target, moldeo_message_info );
		
	}
	
	if (moldeo_message_code=="consoleget") {
	
		console.log("processing api message: consoleget > " +  moldeo_message_info);
		UpdateConsole( moldeo_message_info);
		
		if (Editor.ObjectRequested!=undefined
			&& Editor.ObjectRequested!="")
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + Editor.ObjectRequested + '' } );
		
	}
	
	if (moldeo_message_code=="consolesave") {
		deactivateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
	}
			
  
});
	


	
	
function OscMoldeoSend( obj ) {

	if (obj.msg) {
		if (obj.val0) {
			if (obj.val1) {
				if (obj.val2) {
					if (obj.val3) {
						if (obj.val4) {
							oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3, obj.val4 );
						} else oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3 );
					} else oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2 );
				} else oscClient.send( obj.msg, obj.val0, obj.val1 );
			} else oscClient.send( obj.msg, obj.val0 );
		} else oscClient.send( obj.msg );
	} else oscClient.send( obj );
}

/* version bridge */
/*
ioserver.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.sessionId + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      console.log(msg, rinfo);
      socket.emit("message", msg);
    });
  });
  socket.on("message", function (obj) {
	if (obj.msg) {
		if (obj.val0) {
			if (obj.val1) {
				if (obj.val2) {
					if (obj.val3) {
						oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3 );
					} else oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2 );
				} else oscClient.send( obj.msg, obj.val0, obj.val1 );
			} else oscClient.send( obj.msg, obj.val0 );
		} else oscClient.send( obj.msg );
	} else oscClient.send( obj );
  });
});
*/


var Console = {

	"Info": {}
	
};


function UpdateConsole( info ) {

	Console.Info = info;

}


var today = moment();

//alert(today); 


window.onfocus = function() { 
  console.log("focus");
  //focusTitlebars(true);
}

window.onblur = function() { 
  console.log("blur");
  //focusTitlebars(false);
}

window.onresize = function() {
  /*updateContentStyle();*/
}

window.onload = function() {
  
  document.getElementById("close-window-button").onclick = function() {
    window.close();
  }
  
  //updateContentStyle();
  gui.Window.get().show();
  //fs.chooseFile('#fileDialog');
  RegisterButtonActions();
}

var MoldeoControlActions = function() {

	fs.callProgram(  );

};


var Player = {
	"ObjectSelected": "",
	"PreconfigSelected": {},
	"Objects": {}
};

var mapSelectionsObjects = {
	"W":"W-ICONO",
	"A":"A-PARTICULAS",
	"S":"S-SECUENCIA",
	"D":"D-TUNEL",
	
	"I":"I-CAMARA",
	"J":"J-LAPIZ",
	"K":"K-SONIDO",
	"L":"L-ECO"
};
var mapSelectionsObjectsByLabel = {
	"W-ICONO":"W",
	"A-PARTICULAS":"A",
	"S-SECUENCIA": "S",
	"D-TUNEL":"D",
	
	"I-CAMARA":"I",
	"J-LAPIZ":"J",
	"K-SONIDO":"K",
	"L-ECO":"L"
};
/*
var mapEditorSelections = {
	"W":"W-ICONO",
	"A":"A-PARTICULAS",
	"S":"S-SECUENCIA",
	"D":"D-CUBO",
	
	"I":"V-CAMARA",
	"J":"B-LAPIZ",
	"K":"N-SONIDO",
	"L":"M-ECO"
};
*/


var mapSelectionStateMod = {
	"LEFT": { "member": "alpha", "value": "decrement", "pressed": false },
	"RIGHT": { "member": "alpha", "value": "increment", "pressed": false },
	
	"UP": { "member": "tempo", "value": "increment", "pressed": false },
	"DOWN": { "member": "tempo", "value": "decrement", "pressed": false }
};

function launchMoldeoPlayer() {


}

function SaveProjectAs( filename ) {
	//must clone!!! Use moDataManager::Export function...
	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesaveas', 'val1': filename } );
}


function selectEffect( selkey ) {
	Player.ObjectSelected = mapSelectionsObjects[selkey];
	if (Player.PreconfigSelected[Player.ObjectSelected]==undefined)
		Player.PreconfigSelected[Player.ObjectSelected] = 0;
	//unselect all
	for( var mkey in mapSelectionsObjects) {
		deactivateClass( document.getElementById("button_"+mkey), "fxselected" );
	}

	//show correct preconfig selected
	UnselectButtonsCircle();
	activateClass( document.getElementById("button_"+(Player.PreconfigSelected[Player.ObjectSelected]+1)), "circle_selected" );
	
	activateClass( document.getElementById("button_"+selkey), "fxselected" );
}

function selectEditorEffect( selkey ) {

	Editor.ObjectSelected = mapSelectionsObjects[selkey];

	//unselect all
	for( var mkey in mapSelectionsObjects) {
		deactivateClass( document.getElementById("buttonED_"+mkey), "fxediting" );
	}

	activateClass( document.getElementById("buttonED_"+selkey), "fxediting" );
}

function selectEditorEffectByLabel( MOBlabel ) {

	Editor.ObjectSelected = MOBlabel;
	selkey = mapSelectionsObjectsByLabel[MOBlabel];

	//unselect all
	for( var mkey in mapSelectionsObjects) {
		deactivateClass( document.getElementById("buttonED_"+mkey), "fxediting" );
	}
	if (document.getElementById("buttonED_"+selkey))
		activateClass( document.getElementById("buttonED_"+selkey), "fxediting" );
}


function RegisterEditorButtonObject() {
	document.getElementById('object_label').innerHTML = Editor.ObjectSelected;
}


function UnselectButtonsCircle() {
	for(var i = 1; i<=3; i++) {
		deactivateClass( document.getElementById("button_"+i), "circle_selected" );
	}
}

function selectPlayerPreconfig( object_selection, preconfig_selection ) { 
	
	console.log("selectPlayerPreconfig > object_selection: "+ object_selection
				+ " preconfig_selection:" + preconfig_selection );
				
	if (object_selection==undefined) object_selection = Player.ObjectSelected;
	
	if (object_selection) {
	
		if (preconfig_selection==undefined) preconfig_selection = 0;
		var APIObj = { 
						'msg': '/moldeo',
						'val0': 'preconfigset', 
						'val1': object_selection, 
						'val2': preconfig_selection 
					};
					
		Player.PreconfigSelected[object_selection] = preconfig_selection;
		
		if (object_selection==Player.ObjectSelected) {
			UnselectButtonsCircle();
			activateClass( document.getElementById("button_" + (preconfig_selection+1) ), "circle_selected" );
		}
			
		OscMoldeoSend( APIObj );
	}
}

function RegisterButtonPreconfigs() {
	
	/** BUTTON 1,2,3 */
	document.getElementById("button_1").addEventListener( "click", function(event) {
		console.log("button_1");
		/*
		UnselectButtonsCircle();
		var APIObj = { 
					'msg': '/moldeo',
					'val0': 'preconfigset', 
					'val1': Player.ObjectSelected, 
					'val2': 0 
					};
		Player.PreconfigSelected[Player.ObjectSelected] = 0;
		activateClass( event.target, "circle_selected" );
		OscMoldeoSend( APIObj );
		*/
		selectPlayerPreconfig( Player.ObjectSelected, 0 );
	});

	document.getElementById("button_2").addEventListener( "click", function(event) {
		console.log("button_2");
		/*
		UnselectButtonsCircle();
		var APIObj = { 
					'msg': '/moldeo',
					'val0': 'preconfigset', 
					'val1': Player.ObjectSelected, 
					'val2': 1 
					};
		Player.PreconfigSelected[Player.ObjectSelected] = 1;
		activateClass( event.target, "circle_selected" );
		OscMoldeoSend( APIObj );
		*/
		selectPlayerPreconfig( Player.ObjectSelected, 1 );
	});

	document.getElementById("button_3").addEventListener( "click", function(event) {
		console.log("button_3");
		/*
		UnselectButtonsCircle();
		var APIObj = { 
					'msg': '/moldeo',
					'val0': 'preconfigset', 
					'val1': Player.ObjectSelected, 
					'val2': 2 
					};
		Player.PreconfigSelected[Player.ObjectSelected] = 2;
		activateClass( event.target, "circle_selected" );
		OscMoldeoSend( APIObj );
		*/
		selectPlayerPreconfig( Player.ObjectSelected, 2 );
	});

}

function RegisterButtonInspectors() {

	/** BUTTON 1,2,3 */
	/*
	document.getElementById("button_1").onclick = function() {
		console.log("button_1");
		var APIObj = { 
					'msg': '/moldeo',
					'val0': 'preconfigset', 
					'val1': selectedEffect, 
					'val2': 0 
					};
		OscMoldeoSend( APIObj );
	};

	document.getElementById("button_2").onclick = function() {
		console.log("button_2");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': selectedEffect, 'val2': 1 } );
	};

	document.getElementById("button_3").onclick = function() {
		console.log("button_3");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': selectedEffect, 'val2': 2 } );
	};
	*/

}

function startSend( tkey ) {
	
	var dataCommand = mapSelectionStateMod[ tkey ]["command"];
	
	OscMoldeoSend( dataCommand );
	
	if (mapSelectionStateMod[ tkey ]["pressed"] == true ) {
		setTimeout( function() { startSend( tkey ); } , 40 );
	}
}

var lastKeyDown, keyIsPressed = {}, keyIsDown={}, keyCodeForCharCode = {},
    charCodeForKeyCode = {};

var keycount = 0;
var editor_active = true;

function activateEditor() {
	var editor = document.getElementById("editor_panel");
	if (editor && editor_active) {
		deactivateClass( editor, "editor_inactive");
	} else if (editor) {
		activateClass( editor, "editor_inactive");
	}
}	

function toggleEditor() {

}

function shiftSelected() {
	var shift_el = document.getElementById("button_SHIFT");
	return classActivated( shift_el, "shiftEnabled" );
}

function ctrlSelected() {
	var ctrl_el = document.getElementById("button_CTRL");
	return classActivated( ctrl_el, "ctrlEnabled" );
}
	
function RegisterButtonActions() {

	/** BUTTON W,A,S,D */

	for( var key in mapSelectionsObjects ) {
				
		document.getElementById("button_"+key).addEventListener( "click", function(event) {
			//console.log(event);
			
			var mkey = event.target.getAttribute("key");
			console.log("button_"+mkey+" event:" + event.target.getAttribute("id") );
			
			//OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectselect', 'val1': 'icono' } );
			if (shiftSelected() || ctrlSelected()) {
				selectEffect( mkey );
				RegisterButtonPreconfigs();
			} else {
				if ( !classActivated( event.target, "object_enabled") ) {
					OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': mapSelectionsObjects[mkey] } );
				} else {
					OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': mapSelectionsObjects[mkey] } );
				}			
			}
			
		});
		
		activateClass( document.getElementById("button_"+key), mapSelectionsObjects[key] );
		
	}
	
	/** ============== */
	for( var key in mapSelectionStateMod ) {
				
		document.getElementById("button_"+key).addEventListener( "mousedown", function(event) {
			
			mkey = event.target.getAttribute("key");
			console.log("button_"+mkey+" event:" + event.target.getAttribute("id") );
			mapSelectionStateMod[mkey]["pressed"] = true;
			mapSelectionStateMod[mkey]["command"] = { 'msg': '/moldeo',
														'val0': 'effectsetstate', 
														 'val1': Player.ObjectSelected, 
														 'val2': mapSelectionStateMod[mkey]["member"], 
														 'val3': mapSelectionStateMod[mkey]["value"] };
						 
			startSend( 	mkey );
			
		});
		
		document.getElementById("button_"+key).addEventListener( "mouseup", function(event) {
			mkey = event.target.getAttribute("key");
			mapSelectionStateMod[mkey]["pressed"] = false;
		});
		
	}
	
	/*
	document.getElementById("button_X").addEventListener( "click", function(event) {
			//console.log(event);
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': selectedEffect } );
	});
	*/
	
	document.getElementById("editor_button").addEventListener( "click", function(event) {
			//document.getElementById("editor_panel").display = "block";
			if (!classActivated(document.getElementById("editor_panel"),"editor_opened")) {
			
				activateClass( document.getElementById("editor_panel"), "editor_opened");
				
				activateClass( document.getElementById("editor_button"), "editor_button_close");
			} else {
				deactivateClass( document.getElementById("editor_button"), "editor_button_close");
				deactivateClass( document.getElementById("editor_panel"), "editor_opened");
				
			}
	});
	
	
	
	document.getElementById("button_TAB").addEventListener( "click", function(event) {
		//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay', 'val1': selectedEffect } );
		/** cehck if wwe PLAY the SELECTED EFFECT > haria un boton de PLAY GENERAL*/
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolestop' } );
	});
	
	document.getElementById("button_ENTER").addEventListener( "click", function(event) {
		//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay', 'val1': selectedEffect } );
		/** cehck if wwe PLAY the SELECTED EFFECT > haria un boton de PLAY GENERAL*/
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay' } );
	});

	document.getElementById("button_SPACE").addEventListener( "click", function(event) {
		//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay', 'val1': selectedEffect } );
		/** cehck if wwe PLAY the SELECTED EFFECT > haria un boton de PLAY GENERAL*/
		OscMoldeoSend( { 'msg': '/moldeo', 'val0': 'effectsetstate', 'val1': Player.ObjectSelected, 'val2': 'tempo', 'val3': 'beatpulse' } );
	});
	
	
	document.onkeydown = function(evt) {
	/*
	
    left = 37
    up = 38
    right = 39
    down = 40

	*/
		evt = evt || window.event;
				
		if (evt.ctrlKey && evt.keyCode == 90) {
		
			alert("Ctr+Z");
			
		} else {
		
			console.log(evt.charCode);			
			
			if ( 37<=evt.keyCode && evt.keyCode<=40 ) {
				
				if ( keycount==0 ) {
				
				
					console.log("Key down arrow");
					if (evt.keyCode==37) mkey  = "LEFT";
					if (evt.keyCode==38) mkey  = "UP";
					if (evt.keyCode==39) mkey  = "RIGHT";
					if (evt.keyCode==40) mkey  = "DOWN";
					mapSelectionStateMod[mkey]["pressed"] = true;
					mapSelectionStateMod[mkey]["command"] = { 'msg': '/moldeo',
																'val0': 'effectsetstate', 
																 'val1': Player.ObjectSelected, 
																 'val2': mapSelectionStateMod[mkey]["member"], 
																 'val3': mapSelectionStateMod[mkey]["value"] };
								 
					startSend( 	mkey );
					keycount+= 1;
				
				}
			} else {
			
			}
			//mapKeyControls[""+evt.keyCode+""]["pressed"] = true;
			/*mapKeyControls[""+evt.keyCode+""]["object"]*/
		}
		
		if (evt.shiftKey) {
			activateClass( document.getElementById("button_SHIFT"), "shiftEnabled" );
		}
		if (evt.ctrlKey) {
			activateClass( document.getElementById("button_CTRL"), "ctrlEnabled" );
		}
		
	};
	
	document.onkeyup = function(evt) {
		evt = evt || window.event;
		
		key = String.fromCharCode(evt.keyCode);
		console.log("Simulate a click please! key: " + key);
		keyU = key.toUpperCase();
		
		if (mapSelectionsObjects[keyU]) {
			document.getElementById("button_"+keyU ).click();
		}
		if (key=="1" || key=="2" || key=="3") {
			document.getElementById("button_"+keyU ).click();
		}
		
		if ( 37<=evt.keyCode && evt.keyCode<=40) {

			if (evt.keyCode==37) mkey  = "LEFT";
			if (evt.keyCode==38) mkey  = "UP";
			if (evt.keyCode==39) mkey  = "RIGHT";
			if (evt.keyCode==40) mkey  = "DOWN";
			console.log("Keyup arrow! mkey: " + key);
			
			keycount = 0;
			
			mapSelectionStateMod[mkey]["pressed"] = false;
			
		}
		
		if (!evt.shiftKey) {
			deactivateClass( document.getElementById("button_SHIFT"), "shiftEnabled" );
		}
		if (!evt.ctrlKey) {
			deactivateClass( document.getElementById("button_CTRL"), "ctrlEnabled" );
		}
	};
	
/*EDITORS*/
	if (editor_active) {
		
		activateEditor();
		
		for( var key in mapSelectionsObjects ) {
		 
					
			document.getElementById("buttonED_"+key).addEventListener( "click", function(event) {
				//console.log(event);
				
				var mkey = event.target.getAttribute("key");
				
				console.log("buttonED_"+mkey+" event:" + event.target.getAttribute("id") );
				/*
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': mapselections[mkey] } );
				*/
				
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + mapSelectionsObjects[mkey] + '' } ); //retreive all parameters
				//send a request to get full object info...ASYNC
				
				
			});
			
		}
		
		/*
		for( var key in mapSelectionsFx ) {
	 
				
		document.getElementById("buttonED_"+key).addEventListener( "click", function(event) {
			//console.log(event);
			
			var mkey = event.target.getAttribute("key");
			
			console.log("buttonED_"+mkey+" event:" + event.target.getAttribute("id") );
			
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': mapSelectionsFx[mkey] } ); //retreive all parameters
			//send a request to get full object info...ASYNC
			
			selectedEditorEffect = mapSelectionsFx[mkey];
			selectEditorEffect( mkey );
			
			
			if (selectedEditorEffect!="") 
				document.getElementById('object_label').innerHTML = selectedEditEffect;
			
		});
		
	}
	*/
		
		

		
		
		document.getElementById("buttonED_1").addEventListener( "click", function(event) {
				//console.log(event);

				console.log("buttonED_1 > ");
				
				selectEditorPreconfig(0);
		});
		document.getElementById("buttonED_2").addEventListener( "click", function(event) {
				//console.log(event);

				console.log("buttonED_2 > ");
				selectEditorPreconfig(1);
		});
		document.getElementById("buttonED_3").addEventListener( "click", function(event) {
				//console.log(event);

				console.log("buttonED_3 > ");
				selectEditorPreconfig(2);
		});
		
		/*
		
		document.getElementById("buttonED_previous_preconfig").addEventListener( "click", function(event) {
				//console.log(event);

				console.log("buttonED_previous_preconfig > ");
		});
		
		document.getElementById("buttonED_next_preconfig").addEventListener( "click", function(event) {
				//console.log(event);

				console.log("buttonED_next_preconfig > ");
		});
*/		
		document.getElementById("button_object_onoff").addEventListener( "click", function(event) {
			console.log("button_object_onoff");
			
			var mob_label = event.target.getAttribute("moblabel");
			if (mob_label=="" || mob_label==undefined) {
				alert("Debe seleccionar un efecto para poder editarlo.");
				return;
			}
			
			if ( !classActivated( event.target, "object_onoff_on") ) {
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': mob_label } );
			} else {
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': mob_label } );
			}
			
		});
		
		/*INSPECTORS*/
		/*POSITIONS*/
		document.getElementById("selector_POSITION_X").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("POSITION","translatex");
		});
		
		document.getElementById("selector_POSITION_Y").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("POSITION","translatey");
		});
		
		document.getElementById("selector_POSITION_Z").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("POSITION","translatez");
		});
		
		document.getElementById("POSITION_slide").addEventListener("change", ExecuteSliderInspector );
		
		/*SCALE*/
		document.getElementById("selector_SCALE_Vertical").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("SCALE","scaley");
		});
		
		document.getElementById("selector_SCALE_Horizontal").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("SCALE","scalex");
		});
		
		document.getElementById("selector_SCALE_Zoom").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("SCALE","scalex,scaley");
		});		
		
		document.getElementById("SCALE_slide").addEventListener("change", ExecuteSliderInspector );
		
		/*MOTION*/
		document.getElementById("selector_MOTION_Vertical").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("MOTION","translatey");
		});
		
		document.getElementById("selector_MOTION_Horizontal").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("MOTION","translatex");
		});
		
		document.getElementById("selector_MOTION_Circular").addEventListener("click", function(event) {
			UnselectSelectorPositions(event.target.parentNode);
			activateClass( event.target, "selected");
			SetInspectorMode("MOTION","translatex,translatey");
		});	
		
		document.getElementById("MOTION_slide").addEventListener("change", ExecuteSliderInspector );
		
		/** OBJECT/IMAGE EDIT */
		
		document.getElementById("object_edit").addEventListener( "click", function(event) {
			console.log("EDIT IMAGE/OBJECT");
		});
		
		var openproject = document.getElementById("openproject");		
		openproject.addEventListener( "change", function(event) {
			
			var filename = event.target.value;			
			console.log("openproject > " + filename );
			
			OpenProject( filename );
			
		});
		
		var choosefile = document.getElementById("importfile");		
		choosefile.addEventListener( "change", function(event) {
			
			var moblabel = event.target.importobject.getAttribute("moblabel");
			var preconfig = event.target.importobject.getAttribute("preconfig");
			var paramname = event.target.importobject.getAttribute("paramname");
			
			var filename = event.target.value;			
			console.log("choosefile > " + filename );
			
			ImportFile( moblabel, paramname, preconfig, filename );
			
		});
		
		var saveasfile = document.getElementById("saveasfile");		
		saveasfile.addEventListener( "change", function(event) {
			
			//var moblabel = event.target.importobject.getAttribute("moblabel");
			//var preconfig = event.target.importobject.getAttribute("preconfig");
			//var paramname = event.target.importobject.getAttribute("paramname");
			
			var filename = event.target.value;			
			console.log("saveasfile > " + filename );
			
			SaveProjectAs( filename );
			
		});
				
		document.getElementById("object_import").addEventListener( "click", function(event) {
		
			console.log("IMPORT IMAGE/OBJECT");
			
			if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
				alert("Debe seleccionar un efecto antes de importar una imagen.");
				return;
			}
			
			var cfile = document.getElementById("importfile");			
			
			if (cfile) {
				//cfile.setAttribute();
				cfile.setAttribute("importobject","object_edition");
				cfile.importobject = event.target.parentNode;
				cfile.click();
			}
			
		});
		
		document.getElementById("buttonED_OpenProject").addEventListener( "click", function(event) {
			//console.log(event);
			/*
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1':
			selectedEffect } );
			*/
			//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget', 'val1': '' } );
			console.log("buttonED_OpenProject > ");
			
			if ( Editor.SaveNeeded==true  ) {
				if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {
					
				} else return;
			}
			
			var cfile = document.getElementById("openproject");			
			
			if (cfile) {
				cfile.value = "";
				//cfile.setAttribute();
				//cfile.setAttribute("importobject","object_edition");
				//cfile.projectfile = event.target.parentNode;
				cfile.click();
			}
		});
		
		document.getElementById("buttonED_SaveProject").addEventListener( "click", function(event) {
			console.log("buttonED_Presentation > ");
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesave', 'val1': '' } );
		});
		
		document.getElementById("buttonED_SaveProjectAs").addEventListener( "click", function(event) {
			console.log("buttonED_Presentation > ");
			var savefileas = document.getElementById("saveasfile");			
			if (savefileas) {
				savefileas.click();
			}
		});

		document.getElementById("buttonED_Presentation").addEventListener( "click", function(event) {
			console.log("buttonED_Presentation > ");
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepresentation', 'val1': '' } );
		});

		document.getElementById("buttonED_Screenshot").addEventListener( "click", function(event) {
			console.log("buttonED_Screenshot > ");
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolescreenshot', 'val1': '' } );
		});
		

		/*OBJECT COLOR*/
		
		var canvaspalette = document.getElementById("object_color_palette");
		var ctxpalette = canvaspalette.getContext("2d");
		var paletteImg = new Image();
		paletteImg.src = "buttons/color_palette.png";
		
		paletteImg.onload = function() {			
			ctxpalette.drawImage(	paletteImg, 
								0,
								0, 
								canvaspalette.width,
								canvaspalette.height);
		};
		
		canvaspalette.addEventListener("click", function(event) {
		  
			  var x;
			  var y;
			  
			  var rect = this.getBoundingClientRect();
			  
			  x = event.clientX - rect.left;
			  y = event.clientY - rect.top;
			  
			  var pixel = ctxpalette.getImageData( x, y , 1, 1 ).data;
			  
			  var color = "#" + ("000000" + rgbToHex( pixel[0], pixel[1], pixel[2] ) ).slice(-6);
			  console.log( "color: " + color );
			  //App.selectColor( App.color );
			  //activateTool("tool_07");
		});
		
		//INITIALIZE CONSOLE (get INFO)
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget', 'val1': '' } );
		
	}

}

function UnselectSelectorPositions( parent ) {
	var buttonsPos = parent.getElementsByTagName("button");
	for( var i=0; i<buttonsPos.length; i++) {
		var targbutton = buttonsPos[i];
		deactivateClass( targbutton, "selected");
	}
	
}


var Translations = {
	"POSITION": "POSICION",
	"MOTION": "MOVIMIENTO",
	"SCALE": "ESCALA",
	"ABERRATION": "VELOCIDAD",
	"RANDOMMOTION": "DESCONTROLADO"
};

function TR( label ) {
	return Translations[label];
}


var Editor = {
	"ObjectSelected": "",
	"PreconfigSelected": 0,
	"SaveNeeded": "",
	
	"Objects": {},
	"States": {},
	"Preconfigs": {},
	"PreconfigsSelected": {},
	
	"Parameters": {},
	"Inspectors": {},
	
	"Images": {},
	"Sounds": {},
	"Models": {},
	
	"CustomInspectors": {
		"POSITION": {
			"translatex": true,
			"translatey": true,
			"translatez": true
		},
		"SCALE": {
			"scalex": true,
			"scaley": true,
			"scalez": true
		},
		"MOTION": {
			"translatex": true,
			"translatey": true,
			"translatez": true,
			"rotatex": true,
			"rotatey": true,
			"rotatez": true,
			"rotate": true
		}
		
	}
};

function UpdateEditor( MOB_label, fullobjectInfo ) {

	if (Console.Info.datapath==undefined) {
		console.log("ERROR > no console INFO, trying to get it...");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget', 'val1': '' } );
		Editor.ObjectRequested = MOB_label;
		return;
	}
	
	selectEditorEffectByLabel( MOB_label );							
	RegisterEditorButtonObject();
				
	Editor.PreconfigSelected = fullobjectInfo["object"]["objectconfig"]["currentpreconfig"];
	
	Editor.Objects[MOB_label] = fullobjectInfo;
	Editor.States[MOB_label] = fullobjectInfo["effectstate"];
	Editor.Parameters[MOB_label] = fullobjectInfo["object"]["objectconfig"]["parameters"];
	Editor.Preconfigs[MOB_label] = fullobjectInfo["object"]["objectconfig"]["preconfigs"];
	
	//Parameters:
	//console.log("target: "+ target+ " parameters:" + JSON.stringify( Editor.Parameters[target], "", "\t") );
	
	//Preconfigs
	//console.log("target: "+ target+ " preconfigs:" + JSON.stringify( Editor.Preconfigs[target], "", "\t") );
	
	//activamos o desactivamos el boton de Object_Enable
	UpdateState( MOB_label );
	
	UpdatePreconfigs( MOB_label );
	
	for( var ObjectLabel in Editor.Objects ) {
		var psideWin = document.getElementById("parameters_side_" + ObjectLabel );
		deactivateClass( psideWin, "parameters_side_MOB_selected");
	}
	
	var psideWin = document.getElementById("parameters_side_" + MOB_label );
	activateClass( psideWin, "parameters_side_MOB_selected");
	
}

function UpdateState( MOB_label ) {
	console.log("UpdateState("+MOB_label+")");
	var objectState = Editor.States[MOB_label];
	var btn_OnOff = document.getElementById("button_object_onoff");
	btn_OnOff.setAttribute("moblabel", MOB_label );
	
	console.log("MOB_label: "+ MOB_label+ " targetState:" + JSON.stringify( objectState, "", "\t") );
	
	if ( objectState["Activated"]==1 ) {
	
		console.log("Activated");
		activateClass( btn_OnOff, "button_object_onoff_on");
		
	} else {
	
		console.log("Deactivated");
		deactivateClass( btn_OnOff, "button_object_onoff_on");
		
	}
	
	btn_OnOff.setAttribute("moblabel", MOB_label );
	
}

/**/
function selectEditorImage( preconfig_index ) {

	var object_edition = document.getElementById("object_edition");
	object_edition.setAttribute("moblabel", Editor.ObjectSelected );
	object_edition.setAttribute("preconfig", Editor.PreconfigSelected );
	
	
	var object_edition_image = document.getElementById("object_edition_image");
	var ctx = object_edition_image.getContext("2d");
	ctx.clearRect( 0,0, object_edition_image.width, object_edition_image.height);

	console.log("selectEditorImage("+preconfig_index+")");
	var ObjectImages = Editor.Images[Editor.ObjectSelected];
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;
	
	for( var paramName in ObjectImages) {
	
		var filesrc = ObjectImages[paramName]["preconf_"+preconfig_index]["src"];
	
		if (paramName=="texture") {
			object_edition.setAttribute("paramname", paramName );
			object_edition.setAttribute("title", filesrc );
		}		
			
		console.log("selectEditorPreconfig > paramName: "+paramName+" ObjectImages: " + filesrc);
		
		var IMGOBJECT = ObjectImages[paramName]["preconf_"+preconfig_index];
		
		
		if (IMGOBJECT && IMGOBJECT.img) {
			console.log("object_edition_image.width:"+object_edition_image.width+" object_edition_image:"+object_edition_image.height );
			console.log("IMGOBJECT.width:"+IMGOBJECT.img.width+" IMGOBJECT:"+IMGOBJECT.img.height );
		
			ctx.drawImage( IMGOBJECT.img, 0,0, object_edition_image.width, object_edition_image.height );
		} else {
			console.log("selectEditorImage > no images in ["+Editor.ObjectSelected+"]");
		}
	}
}

function InspectorHideAll() {
	var allinspectors = document.getElementsByClassName("parameter_inspector");
	for( var i=0; i<allinspectors.length;i++) {
		var inspector = allinspectors[i];
		deactivateClass( inspector, "inspector_show" );
	}
}


function ParametersUnselectAll() {
	var psideWinPre = document.getElementById("parameters_side_"+Editor.ObjectSelected+"_" + Editor.PreconfigSelected );
	if (psideWinPre) {
		var params = psideWinPre.getElementsByClassName("parameter_group");
		for( var i=0; i<params.length; i++ ) {
			var pgroup = params[i];
			deactivateClass( pgroup, "group_selected" );
		}
	}
}

function UpdatePreconfigs( MOB_label ) {
	console.log("UpdatePreconfigs("+MOB_label+")");
	//global Elements
	var parameters_side_AllWin = document.getElementById("parameters_side");
	
	if (!parameters_side_AllWin)
		console.log("ERRRRRRROR");

	// Check and create DIV "parameter_side_MOB_LABEL"
	var psideWin = document.getElementById("parameters_side_" + MOB_label );
	
	if (!psideWin) {
		//FIRST TIME ALWAYS SET ON FIRST PRECONFIG
		Editor.PreconfigSelected = 0;
		//Create DIV "parameter_side_MOB_LABEL"
		psideWin = document.createElement("DIV");
		psideWin.setAttribute("id","parameters_side_"+MOB_label);
		psideWin.setAttribute("class", "parameters_side_MOB");
		
		parameters_side_AllWin.appendChild( psideWin );
		
		//Create DIV "parameter_side_MOB_LABEL_0/1/2" PRECONFIGS GROUPS
		for( var pi=0; pi<3;pi++) {
		
			var psideWinPre = document.createElement("DIV");
			psideWinPre.setAttribute("id","parameters_side_"+MOB_label+"_" + pi );
			psideWinPre.setAttribute("class", "parameters_side_MOB_preconf");
			
			psideWin.appendChild( psideWinPre );
			
			//Create DIVs for every published/grouped parameters
			var pgroup_object_base = "parameter_group_"+MOB_label;
			Editor.Inspectors[MOB_label] = {};
			var Inspectors = Editor.Inspectors[MOB_label];
			Editor.Images[MOB_label] = {};
			var ObjectImages = Editor.Images[MOB_label];
			Editor.Sounds[MOB_label] = {};
			var ObjectSounds = Editor.Sounds[MOB_label];
			
			for( var paramname in Editor.Parameters[MOB_label] ) {
			
				var Param = Editor.Parameters[MOB_label][paramname];
				var ParamType = Param.paramdefinition["type"];
				var ParamProperty = Param.paramdefinition["property"];
				var ParamValues = Param.paramvalues;
				
				if ( ParamProperty=="published" ) {
					
					if (	Editor.CustomInspectors["POSITION"][paramname]
							||
							Editor.CustomInspectors["MOTION"][paramname]
							||
							Editor.CustomInspectors["SCALE"][paramname]
						) {
						
						if (Editor.CustomInspectors["POSITION"][paramname]) {
							if (!Inspectors["POSITION"]) Inspectors["POSITION"] = {};
							Inspectors["POSITION"][paramname] = true;
						}
						if (Editor.CustomInspectors["MOTION"][paramname]) {
							if (!Inspectors["MOTION"]) Inspectors["MOTION"] = {};
							Inspectors["MOTION"][paramname] = true;
						}
						if (Editor.CustomInspectors["SCALE"][paramname]) {
							if (!Inspectors["SCALE"]) Inspectors["SCALE"] = {};
							Inspectors["SCALE"][paramname] = true;
						}	
					} else if (	ParamType=="TEXTURE"
								|| ParamType=="SOUND"
								|| ParamType=="OBJECT") {
						//create a...
						//object_edition_image
						if (ParamType=="TEXTURE") {
							if (!ObjectImages[paramname]) ObjectImages[paramname] = {};
							
							if (ObjectImages[paramname]["preconf_0"]==undefined) ObjectImages[paramname]["preconf_0"] = {};
							ObjectImages[paramname]["preconf_0"]["src"] = ParamValues[0][0]["value"];
							ObjectImages[paramname]["preconf_0"]["img"] = new Image();
							ObjectImages[paramname]["preconf_0"]["img"].src = Console.Info.datapath + ParamValues[0][0]["value"];
							
							ObjectImages[paramname]["preconf_0"]["img"].onload = function() {
								selectEditorImage(0);
							};
							
							if (ObjectImages[paramname]["preconf_1"]==undefined) ObjectImages[paramname]["preconf_1"] = {};
							ObjectImages[paramname]["preconf_1"]["src"] = ParamValues[1][0]["value"];ObjectImages[paramname]["preconf_1"]["img"] = new Image();
							ObjectImages[paramname]["preconf_1"]["img"].src = Console.Info.datapath +ParamValues[1][0]["value"];
							ObjectImages[paramname]["preconf_1"]["img"].onload = function() {
							};
							
							if (ObjectImages[paramname]["preconf_2"]==undefined) ObjectImages[paramname]["preconf_2"] = {};
							ObjectImages[paramname]["preconf_2"]["src"] = ParamValues[2][0]["value"];
							ObjectImages[paramname]["preconf_2"]["img"] = new Image();
							ObjectImages[paramname]["preconf_2"]["img"].src = Console.Info.datapath +ParamValues[2][0]["value"];
							ObjectImages[paramname]["preconf_2"]["img"].onload = function() {
							};
						}
						
						if (ParamType=="SOUND") {
							if (!ObjectSounds[paramname]) ObjectSounds[paramname] = {};
							
							if (ObjectSounds[paramname]["preconf_0"]==undefined) ObjectSounds[paramname]["preconf_0"] = {};
							ObjectSounds[paramname]["preconf_0"]["src"] = ParamValues[0][0]["value"];
							//ObjectSounds[paramname]["preconf_0"]["img"] = new Image();
							//ObjectSounds[paramname]["preconf_0"]["img"].src = Console.Info.datapath + ParamValues[0][0]["value"];
							
							//ObjectSounds[paramname]["preconf_0"]["img"].onload = function() {
							//	selectEditorSound(0);
							//};
							
							if (ObjectSounds[paramname]["preconf_1"]==undefined) ObjectSounds[paramname]["preconf_1"] = {};
							ObjectSounds[paramname]["preconf_1"]["src"] = ParamValues[1][0]["value"];ObjectSounds[paramname]["preconf_1"]["img"] = new Image();
							//ObjectSounds[paramname]["preconf_1"]["img"].src = Console.Info.datapath +ParamValues[1][0]["value"];
							//ObjectSounds[paramname]["preconf_1"]["img"].onload = function() {
							//};
							
							if (ObjectSounds[paramname]["preconf_2"]==undefined) ObjectSounds[paramname]["preconf_2"] = {};
							ObjectSounds[paramname]["preconf_2"]["src"] = ParamValues[2][0]["value"];
							//ObjectSounds[paramname]["preconf_2"]["img"] = new Image();
							//ObjectSounds[paramname]["preconf_2"]["img"].src = Console.Info.datapath +ParamValues[2][0]["value"];
							//ObjectSounds[paramname]["preconf_2"]["img"].onload = function() {
							//};
						}
					
					} else {
					
						var ParamDiv = document.createElement("DIV");
						ParamDiv.setAttribute( "id", pgroup_object_base + "_"+ paramname+"_"+pi);
						ParamDiv.setAttribute( "moblabel", MOB_label );
						ParamDiv.setAttribute( "preconfig", pi );
						ParamDiv.setAttribute( "inspector", "parameter_inspector_"+ParamType );
						ParamDiv.setAttribute( "class","parameter_group");
						
						var ParamDivLabel = document.createElement("LABEL");
						ParamDivLabel.innerHTML = paramname;
						//ParamDivLabel.setAttribute("id",);
						ParamDiv.appendChild(ParamDivLabel);
						
						ParamDivLabel.addEventListener( "click", function(event) {
							console.log("clicked parameter > show inspector:");
							var inspectorName = event.target.parentNode.getAttribute("inspector");
							var inspector = document.getElementById(inspectorName);
							
							ParametersUnselectAll();
							activateClass( inspector, "inspector_show");
							activateClass( event.target.parentNode, "group_selected" );
						});
						
						psideWinPre.appendChild(ParamDiv);
					}
				}
			}
		
			if (Inspectors) {
				//create groups to activate this custom inspectors
				for( var Group in Inspectors ) {
					var Inspector = Inspectors[Group];
					if (Inspector) {
						var ParamGroup = document.createElement("DIV");
						ParamGroup.setAttribute( "id", pgroup_object_base + "_"+ Group+"_"+pi);
						ParamGroup.setAttribute( "moblabel", MOB_label );
						ParamGroup.setAttribute( "preconfig", pi );
						ParamGroup.setAttribute( "inspector", "parameter_inspector_"+Group );
						ParamGroup.setAttribute( "group", Group );
						//ParamGroup.setAttribute( "params",  );
						ParamGroup.setAttribute( "class","parameter_group");
						
						var ParamGroupLabel = document.createElement("LABEL");
						ParamGroupLabel.innerHTML = TR(Group);
						//ParamDivLabel.setAttribute("id",);
						ParamGroup.appendChild(ParamGroupLabel);
						
						ParamGroupLabel.addEventListener( "click", function(event) {
						
							var inspectorName = event.target.parentNode.getAttribute("inspector");
							console.log("clicked parameter > show inspector:" + inspectorName);
							var inspector = document.getElementById(inspectorName);
							
							ParametersUnselectAll();
							InspectorHideAll();
							
							activateClass( inspector, "inspector_show");
							activateClass( event.target.parentNode, "group_selected" );
							var mobLabel = event.target.parentNode.getAttribute("moblabel");
							
							UpdateInspector( inspector, mobLabel, Editor.PreconfigSelected );

							
						});
						
						psideWinPre.appendChild(ParamGroup);
					}
				}
			}
		}
		
		
		
	}
	
	/** changed Object, repopulate parameters!!! */
	/*
	ActivatePreconfigsParameters(0);
	ActivatePreconfigsParameters(1);
	ActivatePreconfigsParameters(2);
	*/
	selectEditorPreconfig( Editor.PreconfigSelected );
	
}

function SetInspectorMode( group, parammode ) {

	if (group=="POSITION") {
		var slider = group+"_slide";
		var sliderEl  = document.getElementById( slider );
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		sliderEl.setAttribute("min", "-1" );
		sliderEl.setAttribute("max", "1.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("value", inputEl.getAttribute("value") );
		sliderEl.value = inputEl.getAttribute("value");
		sliderEl.setAttribute("selector", parammode );
	}
	

	if (group=="SCALE") {
		var slider = group+"_slide";
		var sliderEl  = document.getElementById( slider );
		if (parammode=="scalex" || parammode=="scaley") {
			var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			sliderEl.value = inputEl.getAttribute("value");
			sliderEl.setAttribute("selector", parammode );
		} else if (parammode=="scalex,scaley") {
			var inputElx = document.getElementById( "selector_"+group+"_scalex_input" );
			var inputEly = document.getElementById( "selector_"+group+"_scaley_input" );
			var aver =  (inputElx.getAttribute("value")+inputEly.getAttribute("value"))/2;
			sliderEl.setAttribute("min", "-2.0" );
			sliderEl.setAttribute("max", "2.0" );
			sliderEl.setAttribute("step", "0.01" );
			sliderEl.setAttribute("value", aver );
			sliderEl.value = aver;
			sliderEl.setAttribute("selector", parammode );
		}
	}
	
	if (group=="MOTION") {
		var slider = group+"_slide";
		var sliderEl  = document.getElementById( slider );
		if (parammode=="translatex" || parammode=="translatey") {
			var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			sliderEl.value = inputEl.getAttribute("value");
			sliderEl.setAttribute("selector", parammode );
		} else if (parammode=="translatex,translatey") {
			var inputElx = document.getElementById( "selector_"+group+"_translatex_input" );
			var inputEly = document.getElementById( "selector_"+group+"_translatey_input" );
		}
	}

}

function ExecuteSliderInspector(event) {
	var group = event.target.parentNode.getAttribute("group");
	var moblabel = event.target.parentNode.getAttribute("moblabel");
	var preconfig = event.target.parentNode.getAttribute("preconfig");
	
	var selector = event.target.getAttribute("selector");
	var sliderValue = event.target.value;
	
	console.log("ExecuteSliderInspector > group:" +group
				+" selector: " + selector
				+" value: " + sliderValue );
				
	if ( group=="POSITION" ) {
		var inputEl = document.getElementById("selector_"+group+"_"+selector+"_input");
		if (inputEl) inputEl.setAttribute("value",sliderValue);
		SetValue( moblabel, selector, preconfig, sliderValue );
	} else if ( group=="MOTION" ) {
		if (selector=="translatex,translatey") {
			var inputElx = document.getElementById("selector_"+group+"_translatex_input");
			var inputEly = document.getElementById("selector_"+group+"_translatey_input");
			if (inputElx) inputElx.setAttribute("value",sliderValue);
			if (inputEly) inputEly.setAttribute("value",sliderValue);
			SetValue( moblabel, "translatex", preconfig, sliderValue );
			SetValue( moblabel, "translatey", preconfig, sliderValue );
		} else {
			var inputEl = document.getElementById("selector_"+group+"_"+selector+"_input");
			if (inputEl) inputEl.setAttribute("value",sliderValue);
			SetValue( moblabel, selector, preconfig, sliderValue );
		}
	} else if ( group=="SCALE" ) {
		if (selector=="scalex,scaley") {
			var inputElx = document.getElementById("selector_"+group+"_scalex_input");
			var inputEly = document.getElementById("selector_"+group+"_scaley_input");
			if (inputElx) inputElx.setAttribute("value",sliderValue);
			if (inputEly) inputEly.setAttribute("value",sliderValue);
			SetValue( moblabel, "scalex", preconfig, sliderValue );
			SetValue( moblabel, "scaley", preconfig, sliderValue );
		} else {
			var inputEl = document.getElementById("selector_"+group+"_"+selector+"_input");
			if (inputEl) inputEl.setAttribute("value",sliderValue);
			SetValue( moblabel, selector, preconfig, sliderValue );
		}
	} else {
		var inputEl = document.getElementById("selector_"+group+"_"+selector+"_input");
		if (inputEl) inputEl.setAttribute("value",sliderValue);
		SetValue( moblabel, selector, preconfig, sliderValue );
	}
	
	
	
	
}

function OpenProject( filename ) {
	filename = ' -mol "'+filename+'" ';
	//filename = filename.replace( /\'/g , '"');
	//filename = filename.replace( /\\/g , '\\\\');
	
	console.log( "oscServer.on('message'.....) filename:" + filename);
	
	fs.launchPlayer( filename );
	
}

function ImportFile( moblabel, paramname, preconfig, filename ) {

	console.log("ImportFile > moblabel: " + moblabel + " paramname: " + paramname +" preconfig:" + preconfig + " filename:" + filename);
	
	SetValue( moblabel, paramname, preconfig, filename );
	
	//delete and re Update...
	
	var ObjectImages = Editor.Images[moblabel];
	ObjectImages[paramname]["preconf_"+preconfig]["src"] = filename;//ParamValues[0][0]["value"];
	ObjectImages[paramname]["preconf_"+preconfig]["img"] = new Image();
	ObjectImages[paramname]["preconf_"+preconfig]["img"].src = filename;
	//Console.Info.datapath + ParamValues[0][0]["value"];
	
	ObjectImages[paramname]["preconf_"+preconfig]["img"].onload = function() {
		selectEditorImage(preconfig);
	};
	
	//var psideWin = document.getElementById("parameters_side_" + moblabel );
	//var pare = psideWin.parentNode;
	//pare.removeChild(psideWin);
	//UpdatePreconfigs( moblabel );
	
}

function SetValue( moblabel, selector, preconfig, sliderValue ) {
	
	console.log("SetValue("+moblabel+","+selector+","+preconfig+","+sliderValue+")");
	var success = false;
	var Params = Editor.Parameters[moblabel];
	if (Params) {
		var Param = Params[selector];
		if (Param) {
			var ParamValues = Param.paramvalues;
			if (ParamValues) {
				var ParamValue = ParamValues[preconfig];
				if (ParamValue) {
					var Data = ParamValue[0];
					if (Data) {
						Data["value"] = sliderValue;
						success = true;
					} else error("SetValue > no Data for " + selector +" preconf:"+selector+" subvalue: 0 ");
				} else error("SetValue > no ParamValue for " + preconfig);
			} else error("SetValue > no ParamValues for " + selector);
		} else error("SetValue > no Param for " + selector);
	} else error("SetValue > no Params for " + moblabel);
	
	
	if (success) {
		var APIObj = { 
					'msg': '/moldeo',
					'val0': 'valueset', 
					'val1': moblabel, 
					'val2': selector,
					'val3': preconfig,
					'val4': sliderValue
					};
		Editor.SaveNeeded = true;
		if (Editor.SaveNeeded) {
			activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
			//activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		}
		OscMoldeoSend( APIObj );
	}
}

function UpdateInspector( inspectorElement, moblabel, preconfig ) {

	console.log("UpdateInspector("+inspectorElement+","+moblabel+","+preconfig+")");

	if (inspectorElement==undefined) return;
	if (moblabel==undefined) return;
	if (preconfig==undefined) return;

	var Params = Editor.Parameters[moblabel];
	//SETTING INSPECTOR ATTRIBUTES
	inspectorElement.setAttribute("moblabel", moblabel);
	//inspector.setAttribute("preconfig", Editor.PreconfigsSelected[mobLabel]);
	inspectorElement.setAttribute("preconfig", preconfig );
	
	//group is
	var group = inspectorElement.getAttribute("group");
	if (group==undefined || group=="")
		return error( "UpdateInspector > no group! in inspectorElement:" + inspectorElement.getAttribute("id") );
	
	var inspectors = Editor.Inspectors[moblabel];
	if (inspectors==undefined) return;
	
	var inspectorParams = inspectors[group];
	
	console.log("UpdateInspector > assing parameters");
	for( var paramName in inspectorParams) {
		if (inspectorParams[paramName]==true) {
			//significa que este parametro existe en este CONFIG
			//lo buscamos y asignamos...
			var Param =  Params[paramName];
			if (Param && Param.paramvalues) {
				var paramValue = Param.paramvalues[preconfig];
				if (paramValue) {
					var valuedef = paramValue[0]["valuedefinition"];
					var data = paramValue[0]["value"];
					//now that we have it, assign it to inspector...
					var inputInspectorName = "selector_"+group+"_"+paramName+"_input";
					var inputInspector = document.getElementById( inputInspectorName );
					if (inputInspector)
						inputInspector.setAttribute("value", data);
					else
						error("UpdateInspector > " + inputInspectorName+" not found!");
				} else console.log("NO PRECONFIG VALUE FOR : " + moblabel+"."+paramName+" ("+preconfig+")" );
			}
			
		}
	}
	

}

function ActivatePreconfigsParameters( preconf_index ) {

	//Populate parameters with preconfigs
	var btn_escala = document.getElementById("parameter_group_ESCALA_label_"+preconf_index);
	
	btn_escala.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		console.log( event.target.getAttribute("id") );
	});
	
	var btn_position = document.getElementById("parameter_group_POSICION_label_"+preconf_index);
	
	btn_position.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		console.log( event.target.getAttribute("id") );
	});
	
	var btn_movimiento = document.getElementById("parameter_group_MOVIMIENTO_label_"+preconf_index);
	
	btn_movimiento.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		console.log( event.target.getAttribute("id") );
	});
	
}

/**
	SET
	TODO: always select first parameter inspector!!
	TODO: in inspector always select first value...
*/
function selectEditorPreconfig( preconfig_index ) {

	if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
		alert("Debe seleccionar un efecto antes de editar una preconfiguración.");
		return;
	}

	console.log("selectEditorPreconfig("+preconfig_index+")");

	Editor.PreconfigSelected = preconfig_index;
	Preconfs = Editor.Preconfigs[ Editor.ObjectSelected ];
	
	/* selectPlayerPreconfig */
	selectPlayerPreconfig( Player.ObjectSelected, Editor.PreconfigSelected );
	
	
	
	var parameters_side_winID = "parameters_side_"+Editor.ObjectSelected+"_";
	
	var CurrentPreconfig = Preconfs[preconfig_index];
	var win_Preconfigs = document.getElementById("object_preconfigs");
	var btn_Preconfig = document.getElementById("buttonED_"+(preconfig_index+1) );
	
	var win_parameters_Preconfig = document.getElementById( parameters_side_winID+preconfig_index );

	//reset class
	for( var p=1;p<=3;p++) {
		//PRECONFIG SELECTORS
		deactivateClass( win_Preconfigs, "object_preconfigs_" + p );
		
		btn_Preconfigx = document.getElementById("buttonED_"+p );
		deactivateClass( btn_Preconfigx, "circle_selected" );
		
		//PARAMETERS SIDE
		win_parameters_Preconfigx = document.getElementById( parameters_side_winID + (p-1) );
		if (win_parameters_Preconfigx) {
			deactivateClass( win_parameters_Preconfigx, "parameters_selected" );
		} else {
			console.log("selectEditorPreconfig > win_parameters_Preconfigx:"+win_parameters_Preconfigx+" null in "+Editor.ObjectSelected+"");
		}
	}
	
	//activate class for window
	activateClass( win_Preconfigs, "object_preconfigs_" + (preconfig_index+1) );
	//activate class for circle button
	activateClass( btn_Preconfig, "circle_selected" );
	//activate class for parameters side
	activateClass( win_parameters_Preconfig, "parameters_selected" );
	
	
	//perform click() on paramter group...
	var group_selected = win_parameters_Preconfig.getElementsByClassName("group_selected");
	
	if ( group_selected && group_selected.length>0 ) {
		
		console.log("Parameter group selected: " + group_selected.length );
		
		var item_group_selected = group_selected[0];
		
		var item_group_label = item_group_selected.getElementsByTagName("label");
		if (item_group_label.length>0) {
			var item_group_label_selected = item_group_label[0];
			item_group_label_selected.click();
		}
		
	} else {
	
		var param_groups = win_parameters_Preconfig.getElementsByClassName("parameter_group");
		
		var item_group_label = param_groups[0].getElementsByTagName("label");
		
		if (item_group_label.length>0) {
		
			var item_group_label_selected = item_group_label[0];
			
			item_group_label_selected.click();
			
		}
		
	}
	
	//LOAD IMAGE in canvas for this Preconfig
	//EN funcion de las imagenes que tenemos en ObjectImages generamos THUMBNAILS
	// aqui solo para 1	
	selectEditorImage();
	
	console.log( "Preconfig selected: " + JSON.stringify(CurrentPreconfig, "", "\t" ) );
}



