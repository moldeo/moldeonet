/*
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
		
		Editor.States[effect_label_name] = moldeo_message_info;
		
		if (Editor.ObjectSelected==effect_label_name) {			
			UpdateState(effect_label_name);
		}
		
		//update Player objects
		if (Player.ObjectSelected==effect_label_name) {
			var alphav = moldeo_message_info["alpha"]*100;
			
			console.log("alpha:"+alphav);
			
			var sH = document.getElementById("slide_HORIZONTAL_channel_alpha");
			sH.disabled = false;
			sH.setAttribute("moblabel", effect_label_name);
			sH.updateValue( alphav, sH );
			
			var sV  = document.getElementById("slide_VERTICAL_channel_tempo");
			sV.disabled = false;
			sV.setAttribute("moblabel", effect_label_name);
			sV.updateValue( moldeo_message_info["tempo"]["delta"]*50, sV );
		}
		
	}
	
	
	if (moldeo_message_code=="objectget") {
		console.log("processing api message: objectget > " +  moldeo_message_info);
				
		UpdateEditor( moldeo_message_target, moldeo_message_info );
		
	}
	
	if (moldeo_message_code=="consoleget") {
	
		console.log("processing api message: consoleget > " +  moldeo_message_info);
		Console.UpdateConsole( moldeo_message_info );
		
		if (Editor.ObjectRequested!=undefined
			&& Editor.ObjectRequested!="")
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + Editor.ObjectRequested + '' } );
		
	}
	
	if (moldeo_message_code=="consolesave") {
		deactivateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
		deactivateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		if (moldeo_message_target=="success") {
			alert("Se guardó el proyecto");
			Editor.SaveNeeded = false;
		}
	}
	if (	moldeo_message_code=="consolesaveas"
			&& moldeo_message_target=="success") {
		deactivateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
		deactivateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		if (moldeo_message_target=="success") {
			if (moldeo_message_info && moldeo_message_info["projectfullpath"])
				alert("Se guardó el nuevo proyecto en: "+moldeo_message_info["projectfullpath"]);
			else
				alert("Se guardó el nuevo proyecto");
			Editor.SaveNeeded = false;
		}
	}
	
	if ( moldeo_message_code=="consolesaveas"
		&& moldeo_message_target!="success") {
		alert("Ocurrió un problema al guardar el proyecto.");
	}
	
	if (	moldeo_message_code=="consolescreenshot"
		&& moldeo_message_target=="success") {
		//moldeo_message_info
		//alert("Ocurrió un problema al guardar el proyecto.");
		if (moldeo_message_info && moldeo_message_info["lastscreenshot"]) {
			var fullscreenshotpath = moldeo_message_info["lastscreenshot"];
			console.log("fullscreenshotpath: "+fullscreenshotpath);
			//alert("Se capturó la pantalla en : " + fullscreenshotpath);
			/**
			var new_win = gui.Window.get(
			  window.open( fullscreenshotpath, {
				  position: 'center',
				  toolbar: false,
				  width: 400,
				  height: 300
				} )
			);
			*/
			var saveasscreenshot = document.getElementById("saveasscreenshot");
			saveasscreenshot.setAttribute("lastscreenshot",fullscreenshotpath);
			saveasscreenshot.click();
		}
	}
			
  
});
	

function OscMoldeoSend( obj ) {
	//console.log("obj:"+JSON.stringify(obj));
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
