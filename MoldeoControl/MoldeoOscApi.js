﻿/*
	needs
	MoldeoObjects.js

*/


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


var MoldeoApiReceiver = {

	/** CONSOLE */
	"consoleget": function( message ) {
		if (config.log.full) console.log("processing api message: consoleget > ", message);
		Console.UpdateConsole( message["target"], message["info"] );
		
		if (Editor.ObjectRequested!=undefined
			&& Editor.ObjectRequested!="")
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + Editor.ObjectRequested + '' } );

	},
	"consolegetstate": function( message ) {
		if (config.log.full) console.log("processing api message: consolegetstate > message: ",  message);		
		Console.UpdateState( message["info"] );
	},
	"consolesaveas": function( message ) {
		deactivateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
		deactivateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		var info = message["info"];
		if (message["target"]=="success") {
			if (info && info["projectfullpath"])
				alert("Se guardó el nuevo proyecto en: "+info["projectfullpath"]);
			else
				alert("Se guardó el nuevo proyecto");
			Editor.SaveNeeded = false;
		}
	},
	"consolesave": function( message ) {

		deactivateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
		deactivateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		
		if (message["target"]=="success") {
			alert("Se guardó el proyecto");
			Editor.SaveNeeded = false;
		}	
	
	},
	"consolescreenshot": function( message ) {
		var info = message["info"];
		if (message["target"]=="success") {
			if (info && info["lastscreenshot"]) {
			
				var fullscreenshotpath = info["lastscreenshot"];
				if (config.log.full) console.log("fullscreenshotpath: ",fullscreenshotpath);

				var saveasscreenshot = document.getElementById("saveasscreenshot");
				saveasscreenshot.setAttribute("lastscreenshot",fullscreenshotpath);
				saveasscreenshot.click();
				
			}
		}
	},
	
	/** EFFECT */
	"effectgetstate": function( message ) {

		if (config.log.full) console.log("processing api message: effectgetstate: ",message );
		var info = message["info"];
		// use moldeo_message_target, 
		// to update all controls that 
		// are observers of the object states
		var effect_label_name = message["target"];
		var effect_activated = info["Activated"];
		var fxbuttons = document.getElementsByClassName(effect_label_name);
		
		if (config.log.full) console.log( "fxbuttons:", fxbuttons);
		for( var i=0; i<fxbuttons.length; i++ ) {
			var fxbutton = fxbuttons[i];
			if (config.log.full) console.log( "fxbutton: i: " ,i, " html: ",fxbutton.outerHTML );
			if (fxbutton) {
				if (config.log.full) console.log( "fxbutton: is activated ? ", effect_activated );
				if ( effect_activated == '1' ) {
					if (config.log.full) console.log( "activating fxbutton:" );
					activateClass( fxbutton, "object_enabled" );
				} else { /* -1 */
					if (config.log.full) console.log( "deactivating fxbutton:" );
					deactivateClass( fxbutton, "object_enabled" );
				}
			}
		}
		
		Editor.States[effect_label_name] = info;
		
		if (Editor.ObjectSelected==effect_label_name) {			
			UpdateState(effect_label_name);
		}
		
		//update Control objects
		if (Control.ObjectSelected==effect_label_name) {
			UpdateControl( effect_label_name );
		}
		
		if (Scenes.ObjectSelected==effect_label_name) {
			UpdateScene( effect_label_name );
		}
				
	},
	
	/** PARAM */
	"paramget": function( message ) {
		if (config.log.full) console.log("paramget: ", message );
		UpdateEditorParam( message["target"], message["info"] )
	},
	
	/** VALUE */
	"valueget": function( message ) {
		if (config.log.full) console.log("valueget rec: message: ", message);
		valuegetResponse( message["target"], message["param"], message["preconf"], message["info"]);
		
	},
	
	/** OBJECT */
	"objectget": function( message ) {
		UpdateEditor( message["target"], message["info"] );
	},

};
var history = [];
var historyobj = [];
var nhis = 0;

oscServer.on('message', function(msg, rinfo) {

	try {
		//console.log( "oscServer.on('message'.....) receive ! msg: " + msg, ' rinfo:' + rinfo);  
		if (config.log.full) console.log( "oscServer.on('message'.....) receive ! msg: ",msg );
		//socket.emit("message", msg);
		var object_regexp = /({.*})/i
		//var data = msg.match( object_regexp );
		var  moldeoapimessage = msg[2];
		var moldeo_message = {};

		moldeo_message["int"] = moldeoapimessage[0];
		moldeo_message["code"] = moldeoapimessage[1];
		moldeo_message["target"] = moldeoapimessage[2];

		var objectinfo = moldeoapimessage[3];
		moldeo_message["info"] = undefined;

		history[nhis] = msg[2];

		if (objectinfo!=undefined) {

			//console.log( "oscServer.on('message'.....) objectinfo:" + JSON.stringify( objectinfo,"", "\n") );
			if (config.log.full) console.log( "oscServer.on('message',...)");
			//console.log( "oscServer.on('message'.....) objectinfo:",objectinfo );
			
			if ( moldeo_message["int"]>3) {		
				//console.error("objectinfo: is an array");
				moldeo_message["param"] = moldeoapimessage[3];
				moldeo_message["preconf"] = moldeoapimessage[4];
				objectinfo = moldeoapimessage[5];
			}

			if (config.log.full) console.log( "oscServer.on('message',...) replacing line return: \\n by nothing");
			objectinfo = objectinfo.replace( /\n/g , '');
			//objectinfo = objectinfo.replace( /\"/g , '##quote##');

			if (config.log.full) console.log( "oscServer.on('message',...) replacing apostrophe: \\' by \"");
			objectinfo = objectinfo.replace( /\'/g , '"');
			if (config.log.full) console.log( "oscServer.on('message',...) replacing slash: \\ by double slash \\\\");
			objectinfo = objectinfo.replace( /\\/g , '\\\\');
			//objectinfo = objectinfo.replace( /##quote##/g , '\\\"');
			if (config.log.full) console.log( "oscServer.on('message',...) parsing:");
			if (config.log.full) console.log( "objetinfo:",objectinfo);
			moldeo_message["info"] = JSON.parse( objectinfo );
		}
	  
		if (config.log.full) console.log( "moldeo_message > ",moldeo_message ); 

		var CallingApiFunction = false;
		if (moldeo_message["code"])
			CallingApiFunction = MoldeoApiReceiver[ moldeo_message["code"] ];

		if (CallingApiFunction) {
			CallingApiFunction( moldeo_message );		
		} else {
			console.error("No Moldeo Osc Api function registered for calling code:", moldeo_message["code"] );
		}
  
	} catch(err) {
		console.error("oscServer > on message: ",err);
		alert("Error en el formato de recepción de datos",err);
	}
});
	

function OscMoldeoSend( obj ) {
	if (config.log.full) console.log("obj:",obj);
	var str = "";
	for(var xx in obj) {
		str+= obj[xx];
	}
	if (config.log.full) console.log("obj:",str);
	if (obj.msg!=undefined) {
		if (obj.val0!=undefined) {
			if (obj.val1!=undefined) {
				if (obj.val2!=undefined) {
					if (obj.val3!=undefined) {
						if (obj.val4!=undefined) {
							oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3, obj.val4 );
							//console.log("obj.val4:"+obj.val4);
						} else oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3 );
					} else oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2 );
				} else oscClient.send( obj.msg, obj.val0, obj.val1 );
			} else oscClient.send( obj.msg, obj.val0 );
		} else oscClient.send( obj.msg );
	} else oscClient.send( obj );
}