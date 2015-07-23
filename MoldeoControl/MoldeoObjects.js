var md5 = require('md5-node');

var ConsoleInterface = {
	"Options": {
		"MAX_N_PRECONFIGS": 3,
	},
	
	"Log": true,
	
	"State": {},
	
	"Project": {},
	
	"Player": {
		'Display': {
		},
		'moConsole': {
		},
	},
	
	"Control": {
		"ObjectSelected": undefined,
		"PreconfigSelected": {},
		"PreconfigsSelected": {},
		"Objects": {},
		"Buttons": {
			"button_TAB": {
				"click": function(event) {
					OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolestop' } );
				},
			},
			"button_ENTER":	{
				"click": function(event) {
					/*si tiene el estado es playing: hacer una pausa*/
					if (event.target.getAttribute("class")=="button_ENTER special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay' } );
					} else {
						/*si tiene el estado es pausa: hacer una play*/
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepause' } );
					}
				},
			},
			"button_RECORD":	{
				"click": function(event) {
					/*si tiene el estado es playing: hacer una pausa*/
					/*
					if (event.target.getAttribute("class")=="button_RECORD special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerecordsession' } );
					} else if (event.target.getAttribute("class")=="button_RECORDING special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession' } );
					} else {
						//si tiene el estado es pausa: hacer una play
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerecord' } );
					}
					*/
					if (event.target.getAttribute("class")=="button_RECORD special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession' } );
					} else {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession' } );
					}
				},
			},
			"button_RENDERVIDEO": {
				"click": function(event) {
					try {
						console.log("button_RENDERVIDEO > show window options ");
						
						var wini = document.getElementById("render_video_info");
						
						var name = document.getElementById("render_video_info_name");
						var container_codec = document.getElementById("render_video_info_container_codec");
						var videoname = name.value;
						
						if (videoname=="" || videoname==undefined) {
							alert("Debe escribir un nombre de archivo para el video");
							return;
						}
						var videocontainer_codec = container_codec.options[container_codec.selectedIndex].value;
						var arx = videocontainer_codec.split(" codec:");
						var videocontainer = arx[0];						
						var videocodec = arx[1];					
						
						console.log("Rendering in "+videoname+" codec ("+videocodec+")");
						
						$(wini).hide();
						//moCI.Project.datapath+"/temp_render" + XXXX
						frame_path = config.render.session["rendered_folder"];
						frame_path = frame_path.replace(/\\\\/g, "/" );
						frame_path = frame_path.replace(/\\/g, "/" );
												 
						moCI.RenderVideo( frame_path, videocontainer, videocodec, videoname );
						
					} catch(err) {
						if (moCI.console) moCI.console.error(err);
						alert(err);
					}
				}
			},
			"button_SPACE": {
				"click": function(event) {
					//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay', 'val1': selectedEffect } );
					/** cehck if wwe PLAY the SELECTED EFFECT > haria un boton de PLAY GENERAL*/
					OscMoldeoSend( { 'msg': '/moldeo', 'val0': 'effectsetstate', 'val1': Control.ObjectSelected, 'val2': 'tempo', 'val3': 'beatpulse' } );
				},
			},
			"button_LEFT": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_RIGHT": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_UP": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_DOWN": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_1": {
				"click": function(event) {
					if (config.log.full) console.log("button_1 > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 0 );
				},
			},
			"button_2": {
				"click": function(event) {
					if (config.log.full) console.log("button_2 > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 1 );
				}
			},
			"button_3": {
				"click": function(event) {
					if (config.log.full) console.log("button_3 > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 2 );
				}
			},
			"button_F1": {
				"click": function(event) {
					if (config.log.full) console.log("button_F1");
					Control.Functions.selectControlPreset( 0 );
				},
			},
			"button_F2": {
				"click": function(event) {
					if (config.log.full) console.log("button_F2");
					Control.Functions.selectControlPreset( 1 );
				}
			},
			"button_F3": {
				"click": function(event) {
					if (config.log.full) console.log("button_F3");
					Control.Functions.selectControlPreset( 2 );
				}
			},
			"saveasvideo": {
				"change": function(event) {
					var filename = event.target.value;			
					if (config.log.full) console.log("saveasvideo > ", filename );
					
					moCI.Render.SaveAsVideo( filename );		
				},
			},
		},
		"Sliders": {
			"slide_HORIZONTAL_channel_alpha": {
				"change": function(event) {
					if (config.log.full) console.log("slide_HORIZONTAL_channel_alpha: ",event.target.value );
					//event.target.updateValue( event.target.value, event.target, true );	
					updateSliderHorizontalValue(event.target.value, event.target, true);
				},
			},
			"slide_VERTICAL_channel_tempo": {
				"change": function(event) {
					if (config.log.full) console.log("slide_VERTICAL_channel_tempo: ", event.target.value );
					//event.target.updateValue( event.target.value, event.target, true );
					updateSliderVerticalValue(event.target.value, event.target, true);
				}
			}
		},
		"Functions": {
			"ObjectsToProjectPanel": function( ConsoleInfo ) {
				if (config.log.full) console.log("ObjectsToProjectPanel > ", ConsoleInfo);
				document.getElementById("control_project_header").innerHTML = "<label>"+path.basename( ConsoleInfo.configname )+"</label>";
			},
			"cursor_mouse_down": function(event) {
				mkey = event.target.getAttribute("key");
				if (config.log.full) console.log("button_",mkey," event:", event.target.getAttribute("id") );
				if (Control.mapCursorStateMod)
					if (Control.mapCursorStateMod[mkey]) {
						Control.mapCursorStateMod[mkey]["pressed"] = true;
						Control.mapCursorStateMod[mkey]["command"] = { 'msg': '/moldeo',
																'val0': 'effectsetstate', 
																 'val1': Control.ObjectSelected, 
																 'val2': Control.mapCursorStateMod[mkey]["member"], 
																 'val3': Control.mapCursorStateMod[mkey]["value"] };
								 
						startSend( 	mkey );
					}
			},
			"cursor_mouse_up": function(event) {
				mkey = event.target.getAttribute("key");
				if (Control.mapCursorStateMod)
					if (Control.mapCursorStateMod[mkey])
						Control.mapCursorStateMod[mkey]["pressed"] = false;
			},
			"KeyActivation": function(event) {
				//console.log(event);
				
				var mkey = event.target.getAttribute("key");
				var mid = event.target.getAttribute("id");
				if (mkey) {
					if (config.log.full) console.log("RegisterPlayerButtons > button_",mkey," event:",event.target.getAttribute("id") );
					
					//OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectselect', 'val1': 'icono' } );
					if (shiftSelected() || ctrlSelected()) {
						selectEffect( mkey );
						//RegisterPlayerPreconfigsButton();
					} else {
						if ( !classActivated( event.target, "object_enabled") ) {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': moCI.mapSelectionsObjects[mkey] } );
						} else {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': moCI.mapSelectionsObjects[mkey] } );
						}			
					}
				} else console.error("RegisterPlayerButtons > no key attribute in "+mid);
			},
			"selectControlPreconfig": function( object_selection, preconfig_selection, forceselect ) { 
	
				if (config.log.full) console.log("selectControlPreconfig > object_selection: ",object_selection," preconfig_selection:",preconfig_selection );
							
				
				if (object_selection==undefined) object_selection = Control.ObjectSelected;
				if (object_selection==undefined) {
					console.error("selectControlPreconfig > no object selected");		
					return false;
				}
				
				if (object_selection!=undefined) {
				
					if (preconfig_selection==undefined) preconfig_selection = 0;
					
					var APIObj = { 
									'msg': '/moldeo',
									'val0': 'preconfigset', 
									'val1': object_selection, 
									'val2': preconfig_selection 
								};
								
					Control.PreconfigSelected[object_selection] = preconfig_selection;
					
					if (forceselect==true) {
						var key = moCI.mapSelectionsObjectsByLabel[object_selection];
						if (key) {
							selectEffect( key );
						} else {
							console.error("selectControlPreconfig > no key for: " + object_selection);
						}
							
					}
					
					if (object_selection==Control.ObjectSelected) {
						UnselectButtonsCircle();
						var di = document.getElementById("button_" + (preconfig_selection+1) );
						if (di) activateClass( di, "circle_selected" );
					}
					
						
					OscMoldeoSend( APIObj );
				}
			},
			"selectControlPreset": function( preconfig_selection ) { 
				if (config.log.full) console.log("selectControlPreset > ",preconfig_selection);
				for( var object_label in moCI.mapSelectionsObjectsByLabel) {
					if (config.log.full) console.log("object_label:",object_label);
					Control.Functions.selectControlPreconfig( object_label, preconfig_selection );
				}
			},
		},
		"mapCursorStateMod": {
			"LEFT": { "member": "alpha", "value": "decrement", "pressed": false },
			"RIGHT": { "member": "alpha", "value": "increment", "pressed": false },
			
			"UP": { "member": "tempo", "value": "increment", "pressed": false },
			"DOWN": { "member": "tempo", "value": "decrement", "pressed": false }
		},		
		"Register": function() {
			if (config.log.full) console.log("RegisterPlayerButtons");
	
			for( var key in moCI.mapSelectionsObjects ) {
				var keyBtn = document.getElementById("button_"+key);
				if (config.log.full) console.log("RegisterPlayerButtons > key button: ","button_",key);
				if (keyBtn) {
					keyBtn.addEventListener( "click", Control.Functions.KeyActivation );
					if (moCI.mapSelectionsObjects[key])
						activateClass( keyBtn, moCI.mapSelectionsObjects[key] );
				} else {
					console.error("RegisterPlayerButtons > button_"+key+" NOT FOUND!");
				}
				
			}
			
			//buttons and cursors
			if (config.log.full) console.log("RegisterPlayerButtons > all buttons with events"); 
			for( var button in Control.Buttons) {
				var dd = document.getElementById(button);
				for( var eventname in Control.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Control.Buttons[button][eventname]);
				}		
			}
			
			//sliders
			var sH = document.getElementById("slide_HORIZONTAL_channel_alpha");
	
			if (sH) {
				sH.updateValue = updateSliderHorizontalValue;
				sH.addEventListener( "change", Control.Sliders["slide_HORIZONTAL_channel_alpha"]["change"]);
				sH.updateValue( 0 , sH );
			}

			var sV = document.getElementById("slide_VERTICAL_channel_tempo");

			if (sV) {
				sV.updateValue = updateSliderVerticalValue;
				sV.addEventListener( "change", Control.Sliders["slide_VERTICAL_channel_tempo"]["change"]);
				sV.updateValue( 0 , sV );

			};	
			
			//keyboard
			RegisterKeyboardControl();
		},
	},
	
	"Editor": {
		"ObjectSelected": "",
		"PreconfigSelected": 0,
		"SaveNeeded": false,
		"InspectorTabSelected": {},
		"InspectorSelected": {},
		"InspectorGroup": {},
		"InspectorSelectorSelected": {},
		
		"Objects": {},
		"States": {},
		"Preconfigs": {},
		"PreconfigsSelected": {},
		
		"Parameters": {},
		"Inspectors": {},
		"Constraints": {
			"particlessimple": {
				"maxage": {
					"min": "0",
					"max": "120000",
					"step": "1",
				},
				"emitionperiod": {
					"min": "0",
					"max": "10000",
					"step": "1",
				},
				"emitionrate": {
					"min": "0",
					"max": "100",
					"step": "1",
				},
				"emittertype": {
					"min": "0",
					"max": "5",
					"step": "1",
				},
				"randommethod": {
					"min": "0",
					"max": "2",
					"step": "1",
				},
				"creationmethod": {
					"min": "0",
					"max": "2",
					"step": "1",
				},
				"emittervectorx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"emittervectory": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"emittervectorz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				
				"randommotion": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotionx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotiony": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotionz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				
				"randomvelocity": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityy": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
			
				"gravity": {
					"min": "-2",
					"max": "2",
					"step": "0.01",
				},
				"viscosity": {
					"min": "-2",
					"max": "2",
					"step": "0.01",
				},
				"attractortype": {
					"min": "0",
					"max": "4",
					"step": "1",
				},
				"attractormode": {
					"min": "0",
					"max": "4",
					"step": "1",
				},
				"attractorvectorx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"attractorvectory": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"attractorvectorz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
		
				"rotatex_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatey_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatez_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
		
				"width": {
					"min": 1,
					"max": 40,
					"step": 1,
				},
				"height": {
					"min": 1,
					"max": 40,
					"step": 1,
				},
			},
			"standard" : {
				"alpha": {
					"min": 0.0,
					"max": 1.0,
					"step": 0.01,
				},
				"syncro": {
					"min": -5.0,
					"max": 5.0,
					"step": 0.01,
				},
				"phase": {
					"min": 0.0,
					"max": 20.0,
					"step": 0.1,
				},
				"blending": {
					"min": 0,
					"max": 9,
					"step": 1,
				},
				"wireframe": {
					"min": 0,
					"max": 1,
					"step": 1,
				},
				"sides": {
					"min": 2,
					"max": 64,
					"step": 1,
				},
				"segments": {
					"min": 2,
					"max": 100,
					"step": 1,
				},
				"rotatex": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatey": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatez": {
					"min": -180,
					"max": 180,
					"step": 1,
				},

			}
		},
		"Images": {},
		"Movies": {},
		"Sounds": {},
		"Models": {},
		
		"CustomSelectors": {
			"POSITION": {
				"translatexy": {
					"widget": {
						"name": "position_canvas",
						"options": {}
					},
					"events": {
						"click": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mouseup": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousedown": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousemove": function(event) { return ExecuteCanvasPositionInspector(event); },					
					}
				},
				"translatezy": {
					"widget": {
						"name": "position_canvas",
						"options": {}
					},
					"events": {
						"click": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mouseup": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousedown": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousemove": function(event) { return ExecuteCanvasPositionInspector(event); },					
					},
				},
			},
		},
		"CustomInspectors": {
			"POSITION": {
				"translatex": { "translatex": true, },
				"translatey": { "translatey": true, },
				"translatez": { "translatez": true, },
				"translatexy": { "translatex": true, "translatey": true, },
				"translatezy": { "translatey": true, "translatez": true, },
			},
			"SCALE": {
				"scalex": { "scalex": true, },
				"scaley": { "scaley": true, },
				"zoom": { "scalex": true, "scaley": true },
			},
			"SCALEPARTICLE": {
				"scalex_particle": { "scalex_particle": true, },
				"scaley_particle": { "scaley_particle": true, },
				"scalez_particle": { "scalez_particle": true, },
				"zoom": { "scalex_particle": true, "scaley_particle": true },
			},
			"MOTION": {
				"Vertical": { "translatey": true, },
				"Horizontal": { "translatex": true, },
				"Circular": { "translatex": true, "translatey": true },
			},
			"SCENE_OBJECTS": {
				"preeffect": { "preffect": true, },
				"effect": { "effect": true,},
				"posteffect": { "posteffect": true, },
			},
			"SCENE_STATES": {
				"scene_states": { "scene_states": true, },
				"sequence_mode": { "sequence_mode": true, },
				"sequence_loop": { "sequence_loop": true, },
				"sequence_duration": { "sequence_duration": true, },
			},
			"EMITTER": {
				"maxage": { "maxage": true, },
				"emitionperiod": { "emitionperiod": true, },
				"emitionrate": { "emitionrate": true, },
				"emittertype": { "emittertype": true, },
				"emittervectorx": { "emittervectorx": true, },
				"emittervectory": { "emittervectory": true, },
				"emittervectorz": { "emittervectorz": true, },
				"randommethod": { "randommethod": true, },
				"creationmethod": { "creationmethod": true, },
			},
			"ATTRACTOR": {
				"gravity": { "gravity": true, },
				"viscosity": { "viscosity": true, },
				"attractortype": { "attractortype": true, },
				"attractormode": { "attractormode": true, },
				"attractorvectorx": { "attractorvectorx": true, },
				"attractorvectory": { "attractorvectory": true, },
				"attractorvectorz": { "attractorvectorz": true, },
			},
			"BEHAVIOUR": {
				"randomvelocity": { "randomvelocity": true, },
				"randomvelocityx": { "randomvelocityx": true, },
				"randomvelocityy": { "randomvelocityy": true, },
				"randomvelocityz": { "randomvelocityz": true, },
				"randommotion": { "randommotion": true, },
				"randommotionx": { "randommotionx": true, },
				"randommotiony": { "randommotiony": true, },
				"randommotionz": { "randommotionz": true, },
			},
			
		},		
		"Buttons": { 
			"editor_button": { 
				"click": function(event) {
							toggleEditor();						
						}
			},
			"button_object_onoff": {
				"click": function(event) {
					if (config.log.full) console.log("button_object_onoff");
					
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
					
				}
			},			
			"buttonED_1": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_1 > ");
						selectEditorPreconfig(0);
				},
			},
			"buttonED_2": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_2 > ");
						selectEditorPreconfig(1);
				},
			},
			"buttonED_3": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_3 > ");
						selectEditorPreconfig(2);
				},
			},
			"buttonED_OpenProject": {
				"click": function(event) {
					if (config.log.full) console.log("buttonED_OpenProject > ");
					
					if ( Editor.SaveNeeded==true  ) {
						if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {
							
						} else {
							if (config.log.full) console.log("Aborting browser opening...");
							return;
						}
					}
					
					/*
					var cfile = document.getElementById("openproject");			
					
					if (cfile) {
						cfile.value = "";
						cfile.click();
					}
					*/
					moCI.Browser.Open();
				},
			},
			"buttonED_SaveProject": {
				"click": function(event) { moCI.Save(); },
			},
			"buttonED_SaveProjectAs": {
				"click": function(event) {
					if (config.log.full) console.log("buttonED_SaveProjectAs > SaveAsDialog");
					var saveasproject = document.getElementById("saveasproject");			
					var clone_name = prompt("Ingresa el nuevo nombre del proyecto (sin acentos ni caracteres especiales por favor)","mi_clon");
					if (saveasproject && clone_name) {
						saveasproject.setAttribute("clone_name", clone_name );
						saveasproject.setAttribute("value", "" );
						saveasproject.value = "";
						saveasproject.click();
					}
				}
			},
			"buttonED_Presentation": {
				"click": function(event) { moCI.Presentation(); },
			},
			"buttonED_Screenshot": {
				"click": function(event) { moCI.Screenshot(); },
			},
			"buttonED_PreviewShot": {
				"click": function(event) { moCI.PreviewShot(); },
			},
			"importfile": {
				"change": function(event) {
					if (event.target.importobject==undefined) return;
					
					var moblabel = event.target.importobject.getAttribute("moblabel");
					var preconfig = event.target.importobject.getAttribute("preconfig");
					var paramname = event.target.importobject.getAttribute("paramname");
					
					var filename = event.target.value;			
					if (config.log.full) console.log("choosefile > ", filename );
					if (filename!="") {
						ImportFile( moblabel, paramname, preconfig, filename );
					} else {
						console.error("importfile > change > "+paramname+": Nothing selected.");
					}
				},
			},
			"object_import": {
				"click": function(event) {
				
					if (config.log.full) console.log("object_import > IMPORT IMAGE/OBJECT");
					
					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar una imagen.");
						return;
					}
					
					var cfile = document.getElementById("importfile");			
					
					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".jpg,.png");
						cfile.setAttribute("importobject","object_edition");
						cfile.importobject = event.target.parentNode;
						cfile.click();
					}
					
				},
			},
			"audio_import": {
				"click": function(event) {
				
					if (config.log.full) console.log("audio_import > IMPORT SOUND");
					
					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar un sonido.");
						return;
					}
					
					var cfile = document.getElementById("importfile");			
					
					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".mp3,.m4a,.ogg,,wav");
						cfile.setAttribute("importobject","audio_edition");
						cfile.importobject = event.target.parentNode;
						cfile.click();
					}
					
				},
			},
			"video_import": {
				"click": function(event) {
				
					if (config.log.full) console.log("videoo_import > IMPORT MOVIE/VIDEO");
					
					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar un video o película.");
						return;
					}
					
					var cfile = document.getElementById("importfile");			
					
					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".mp4,.mpg,.avi,.mov,.mp2,.m2v,.ogg");
						cfile.setAttribute("importobject","video_edition");
						cfile.importobject = event.target.parentNode;
						cfile.click();
					}
					
				},
			},
			"object_color_palette": {
				"click": function(event) {
					  var canvaspalette = event.target;
					  var ctxpalette = canvaspalette.getContext("2d");
					  if (ctxpalette==undefined) return;
					  ctxpalette.clearRect(0,0,canvaspalette.width,canvaspalette.height);
					  ctxpalette.drawImage(	paletteImg, 
										0,
										0, 
										canvaspalette.width,
										canvaspalette.height);
										
					  var x;
					  var y;
					  
					  var rect = event.target.getBoundingClientRect();
					  var fx = canvaspalette.width/140;
					  var fy = canvaspalette.height/30;
					  
					  x = (event.clientX - rect.left)*fx;
					  y = (event.clientY - rect.top) *fy;
					  
					  
					  var pixel = ctxpalette.getImageData( x, y , 1, 1 );
					  var pixel_data = pixel.data;
					  if (config.log.full) console.log( "object_color_palette>click> color: r: ", pixel_data[0],
					   " g: ", pixel_data[1]
					  ," b: ", pixel_data[2]
					  );
					  Editor.Functions.SetColor( pixel_data[0], pixel_data[1], pixel_data[2], 1.0 );
					  
				},
			},
			"saveasfile": {
				"change": function(event) {
					var filename = event.target.value;			
					if (config.log.full) console.log("saveasfile > ", filename );
					
					moCI.SaveProjectAs( filename );		
				},
			},
			"saveasproject": {
				"change": function(event) {
					
					var dirname = event.target.value+"/" + event.target.getAttribute("clone_name");			
					if (config.log.full) console.log("saveasproject > ", dirname );
					
					moCI.SaveProjectAs( dirname );		
				},
			},
			"openproject": {
				"change": function(event) {
					var filename = event.target.value;			
					if (config.log.full) console.log("openproject > ", filename );
		
					moCI.OpenProject( filename );
				},
			},
			"saveasscreenshot": {
				"change": function(event) {
					
					var filename = event.target.value;	
					var	screenshot = event.target.getAttribute("lastscreenshot");
					console.log("saveasscreenshot > screenshot:", screenshot," filename:", filename );
					
					moCI.SaveScreenshotAs( screenshot, filename );				
				},
			},
			"action_param_unpublished": {
				"click": function(event) {
						if (config.log.full) console.log("toggle param list unpublished");
						var parameter_side_MOB = event.target.parentNode.parentNode;
						if (parameter_side_MOB) {
							var MOB_label = parameter_side_MOB.getAttribute("moblabel");
							if (classActivated( parameter_side_MOB, "show_all")) {
								deactivateClass( parameter_side_MOB, "show_all");
							} else {
								activateClass( parameter_side_MOB, "show_all");
							}							
							var di = document.getElementById("parameters_side_"+MOB_label+"_scroller");
							if (di) {
								if ($("#parameters_side_"+MOB_label+"_scroller").data("plugin_tinyscrollbar")) {
									$("#parameters_side_"+MOB_label+"_scroller").data("plugin_tinyscrollbar").update("relative");
								} else {
									$("#parameters_side_"+MOB_label+"_scroller").tinyscrollbar();
								}
							}
						} else console.error("action_param_unpublished > error");
				},
			},
			"reload_interface_button": function(event) {
				return moCI.Editor.Functions["reload"]();
			}
		},
		"Functions": {
			"SetColor": function( red_byte, green_byte, blue_byte, alpha_float ) {
				var color = "#" + ("000000" + rgbToHex( red_byte, green_byte, blue_byte ) ).slice(-6);
					if (config.log.full) console.log( "SetColor color: ", color, " r: ", red_byte
					 , " g: " , green_byte
					  , " b: " , blue_byte
					  );			  
					  
					  SetValue(	Editor.ObjectSelected, 
								"color",
								Editor.PreconfigsSelected[Editor.ObjectSelected],
								color
								);
			},
			"reload": function() {
				moCI.ReloadInterface();
			},
			"edit_button_click": function(event) {
				try {
					var mkey = event.target.getAttribute("key");
					
					if (config.log.full) console.log("buttonED_",mkey," event:", event.target.getAttribute("id") );
					if (moCI.mapSelectionsObjects)
						if (moCI.mapSelectionsObjects[mkey]) {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + moCI.mapSelectionsObjects[mkey] + '' } ); //retreive all parameters
							//send a request to get full object info...ASYNC
						}
				} catch(err) {
					console.error("Editor.Functions.edit_button_click > ", err);
					alert(err);					
				}
			},
		},
		"Register": function() {
			if (config.log.full) console.log("RegisterEditorButtons");

			for( var key in moCI.mapSelectionsObjects ) {
				var selObject = document.getElementById("buttonED_"+key);
				if (selObject) selObject.addEventListener( "click", Editor.Functions["edit_button_click"]);
			}

			for( var button in Editor.Buttons ) {
				var dd = document.getElementById(button);
				for( var eventname in Editor.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Editor.Buttons[button][eventname]);
				}		
			}
			RegisterEditorColorButtons();
			
			for(var groupName in Editor.CustomInspectors) {
			
				//CUSTOMSELECTORS > define special events! (like a canvas por 2d position)
				for(var paramName in Editor.CustomSelectors[groupName]) {
					var selector = document.getElementById("selector_"+groupName+"_"+paramName );
					if (selector) {
						var events = Editor.CustomSelectors["POSITION"][paramName]["events"];
						if (events)
							for( var eventname in events) {
								selector.addEventListener( eventname, events[eventname] );
							}
					}
				}
				
				//EACH GROUP SELECTOR calls > on click > ActivateInspectorSelector(...)
				for(var paramName in Editor.CustomInspectors[groupName]) {
					var selector = document.getElementById("selector_"+groupName+"_"+paramName );
					if (selector) {
						if ( Editor.CustomSelectors[groupName]==undefined
							||
							Editor.CustomSelectors[groupName][paramName]==undefined) {
							selector.addEventListener("click", ActivateInspectorSelector );
						}
					}
				}
				
				if (document.getElementById(groupName+"_slide"))
					document.getElementById(groupName+"_slide").addEventListener("change", ExecuteSliderInspector );
			}		
			
			
		},
	},

	"Connectors": {
		
		"Objects": {
		
		},
		
		"Tree": {
		
		},
		"Buttons": {
			"connector_panel_close": {
				"click": function(event) {
					hidediv('connector_panel');
				},
			},
		},		
		"Functions": {
			"ObjectsToTree": function() {
				var console_tree = {
					"type": "seccion",
					"wid": "",
					"name": "console",
					"children": [
						{
							"name": "devices",
							"type": "seccion",
							"wid": "devices",
							"order": 0,
							"children": [								
							]
						},
						{
							"name": "preeffect",
							"type": "seccion",
							"wid": "preeffect",
							"order": 1,
							"children": [								
							]
						},
						{
							"name": "effect",
							"type": "seccion",
							"wid": "effect",
							"order": 2,
							"children": [								
							]
						},
						{
							"name": "posteffect",
							"type": "seccion",
							"wid": "posteffect",
							"order": 3,
							"children": [								
							]
						},
						{
							"name": "mastereffect",
							"type": "seccion",
							"wid": "mastereffect",
							"order": 4,
							"children": [								
							]
						},
						{
							"name": "resources",
							"type": "seccion",
							"wid": "resources",
							"order": 5,
							"children": [								
							]
						},						
					],
				};

				var preeffect = moCI.Project.config.parameters["preeffect"].paramvalues;
				var effect = moCI.Project.config.parameters["effect"].paramvalues;
				var posteffect = moCI.Project.config.parameters["posteffect"].paramvalues;
				var mastereffect = moCI.Project.config.parameters["mastereffect"].paramvalues;
				var resources = moCI.Project.config.parameters["resources"].paramvalues;
				/* TODO: do it right, searching full objects, with moldeo ids*/
				var moldeo_ids = 0;
				
				for( var group_i in console_tree.children  ) {
				
					var node = console_tree.children[group_i];
					var moldeo_objects_values = moCI.Project.config.parameters[ node.name ].paramvalues;
					
					for( var index in moldeo_objects_values  ) {
						
						var mob = moldeo_objects_values[index];
						
						MobDefinition = new moMobDefinition();					
						MobDefinition.Init( mob[0].value, mob[1].value, mob[2].value, "moIODevice" );
						MobDefinition.MoldeoId = moldeo_ids;
						moldeo_ids++;
						node["children"].push(
							{
								"name": MobDefinition.MoldeoLabelName,
								"type": "obra",
								"order": index,
								"wid": MobDefinition.MoldeoId,
								"MobDefinition": MobDefinition,
								"children": [],
							}
						);
					}
				}
				moCI.Connectors.Tree = console_tree;
				if (config.log.full) console.log("ObjectsToTree", moCI.Connectors.Tree );
				
				moCI.Connectors.FRib = new FractalRibosome( moCI.Connectors.Tree, window.innerWidth, window.innerHeight,
							{ 
								'glowopacity': 0.2,/*0.3*/
								'glowscalexy': 1.0,/*1.03*/
								'glowduration': 2700, /*2700*/
								'showBox': false,
								'showVars': false,
								'showRiboline': true,
								'riboSteps': 4,
								'riboNoise': 0.3,
								'riboInterpolation': 'basis',
								
								'node_size': 'fixed',
								'node_size_base': 1.0,								
								'node_size_fixed': false, /* true for Vainer */
								
								
								'node_position_mode': "linear",
								/*
								'node_position_radius': 200.0,
								*/
							});

				moCI.Connectors.FRib.Init( "connector_panel" );	
			},
		},
		"Register": function() {
			if (config.log.full) console.log("RegisterConnectorButtons > all buttons with events");
			for( var button in Connectors.Buttons) {
				var dd = document.getElementById(button);
				for( var eventname in Connectors.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Connectors.Buttons[button][eventname]);
				}		
			}
		},
	},
	
	"Scenes": {
		"ObjectSelected": false,
		"ScenePreEffects": {},
		"SceneEffects": {},
		"ScenePostEffects": {},
		"SceneStates": {}
	},
	
	"Browser": {
		"document": null,
		"winBrowser": null,
		"winVisible": true,
		"initialized": false,
		"OpenFile": function() {
			if (config.log.full) console.log("Browser::OpenFile > ");
			try {
			if ( moCI.Editor.SaveNeeded==true  ) {
				if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {
					
				} else {
					if (config.log.full) console.log("Aborting browser opening...");
					return;
				}
			}			
			
			var cfile = moCI.document.getElementById("openproject");			
			
			if (cfile) {
				cfile.value = "";
				cfile.click();
			}
			} catch(err) {
				alert(err);
				console.error(err);
			}
		},
		"initBrowser": function() {
			if (config.log.full) console.log("initBrowser()");
			try {
				if (moCI.Browser.initialized) {
					if (config.log.full) console.log("initBrowser > already initialized. returning.");
					return;
				}
				if (moCI.Browser.winBrowser) {
					moCI.Browser.winBrowser.moCI = moCI;
					if (moCI.Browser.winBrowser.window) {
						moCI.Browser.winBrowser.window.moCI = moCI;
						moCI.Browser.winBrowser.window.opener = gui.Window.get();
						if (config.log.full) console.log(this);
						moCI.Browser.document = moCI.Browser.winBrowser.window.document;
						moCI.Browser.document.getElementById("close-window-button").onclick = function() {
							moCI.Browser.Close();							
						}
					} else console.error("initBrowser > no .window");
					moCI.Browser.updateBrowser();					
					moCI.Browser.initialized = true;
				} else {
					moCI.Browser.initialized = false;
				}
			} catch(err) {
				console.error("initBrowser:",err);
			}
		},
		"Open": function() {
			try { 
				if (moCI.Browser.winBrowser==null) {
					moCI.Browser.winBrowser = gui.Window.open('MoldeoBrowser.html', {
						icon: "moldeocontrol.png",
						focus: false,						
						toolbar: false,
						frame: true,
						width: win.width,
						height: 300,
                        position: "center",
					});
					if (moCI.Browser.winBrowser) {
						if (config.log.full) console.log("moCI.Browser.Open > registering events.");
                        moCI.Browser.winBrowser.moveTo(win.x, win.y-330);
						moCI.Browser.winVisible	= true;
						//moCI.Browser.winBrowser.opener = gui.Window.get();
						moCI.Browser.winBrowser.on('loaded', moCI.Browser.initBrowser);
						//moCI.Browser.winBrowser.on('focus', moCI.Browser.initBrowser);
						moCI.Browser.winBrowser.on('closed', function() {
							console.log("Browser closed!");
							moCI.Browser.winBrowser = null;
							moCI.Browser.initialized = false;
						});
						moCI.Browser.winBrowser.on('close', function() {
							console.log("Browser closing!");
							moCI.Browser.winBrowser = null;
							moCI.Browser.initialized = false;
							this.close(true);
						});
						//setTimeout( moCI.Browser.initBrowser, 1000 );
						moCI.Browser.winBrowser.focus();
					} else {
						console.error("moCI.Browser.Open > moCI.Browser.winBrowser NULL: ", moCI.Browser.winBrowser);
					}
				} else {
					if (config.log.full) console.log("Browser.Open() > just show it",moCI.Browser.winBrowser.window);
										
					if (moCI.Browser.winBrowser.window==undefined) {
						if (config.log.full) console.log("Browser.Open() > re-open");
						moCI.Browser.winBrowser.close(true);
						moCI.Browser.winBrowser = null;
						moCI.Browser.initialized = false;
						moCI.Browser.Open();
					}
					
					moCI.Browser.winVisible = !moCI.Browser.winVisible;
					var result = moCI.Browser.winBrowser.show( moCI.Browser.winVisible );					
					
				}		
			} catch(err) {
				console.error("Open:",err);
			}
			
			
		},
		"Close": function() {
			if (moCI.Browser.winBrowser == null) return;
			moCI.Browser.winVisible	= false;
			moCI.Browser.initialized = false;			
			moCI.Browser.winBrowser.show( moCI.Browser.winVisible );
		},
		"scanProjectsFolder": function(base_folder) {
			//* check: https://nodejs.org/api/path.html*/
		
			if (config.log.full) console.log("loadBrowserFolder(",base_folder,") check https://nodejs.org/api/path.html");
			var bProjects = moCI.Browser.Projects;
			
			if (bProjects[base_folder]==undefined)
				bProjects[base_folder] = {};
			try {
				moCI.fs.walk( base_folder, function( filepath, stat ) {
					//console.log("walk call:", filepath);
					if (stat.isFile()) {
						//check if it's a .mol project
						var extension = path.extname(filepath);
						if (extension==".mol") {
							if (config.log.full) console.log("walk call MOL found: base_folder:",base_folder," path:", filepath);
							bProjects[base_folder][filepath] = false;
						}
					} else if(stat.isDirectory()) {
						//iterate or wait
					}
				});
			} catch(err) {
				console.error("loadBrowserFolder: ",err);
				//alert(err);
			}
		},
		"createProjectItem": function( base_mol_file ) {
			if (config.log.full) console.log("createProjectItem > ",base_mol_file);
			var CIB = moCI.Browser;
			var broDOM = CIB.document;
			var molEle = broDOM.createElement("DIV");
			
			var preview_shot_url = false;
			var project_data_path = path.dirname( base_mol_file );
			var project_preview_path = project_data_path+"/previewshots";
			var project_previews = {};
			
			for( var i=0; i<4;i++) {
				var project_preview_shot = project_preview_path+"/preview_shot_000000"+i+".jpg";
				if (config.log.full) console.log("project_preview_shot:",project_preview_shot);
				project_previews[ project_preview_shot ] = false;
				if (moCI.fs.existsSync( project_preview_shot )) {
					preview_shot_url = project_preview_shot;
					project_previews[ project_preview_shot ] = true;
					if (config.log.full) console.log("project_preview_shot FOUND:",project_preview_shot);
					break;
				}
			}
			
			
			$(molEle).attr("class","browser_project");
			$(molEle).attr("mol",base_mol_file);
			$(molEle).attr("title",base_mol_file);		
			molEle.project_previews = Object.create(project_previews);
			
			if (preview_shot_url) {
				preview_shot_url = preview_shot_url.replace(/\\/g, "/");
				if (config.log.full) console.log("preview_shot_url > ",preview_shot_url);
				molEle.setAttribute("style","background-image: url('file:///"+preview_shot_url+"');");
			}
			
			molEle.addEventListener( "click", function(event) {
			
				if (config.log.full) console.log("Browser.createProjectItem > click browser_project :", event);
				
				try {
					var ele = event.target;
					var ele_file = ele.getAttribute("mol");
					if (ele_file) {
						moCI.OpenProject( ele_file );
					} else {
						console.error("opening ele_file:",ele_file,event);
					}
				} catch(err) {
					alert(err);
					console.error("opening :",event);
				}
				
			});
			
			var molEleLabel = broDOM.createElement("LABEL");
			var bname = path.basename(base_mol_file);
			var dataname = path.basename( path.dirname( base_mol_file )) +" / "+bname;
			molEleLabel.setAttribute("class","project_label");
			molEleLabel.setAttribute("title",dataname);
			//molEleLabel.innerHTML = path.basename(base_mol_file);
			molEleLabel.innerHTML = bname;
			molEle.appendChild( molEleLabel );
			
			return molEle;
		},
		"createProjectFolderView": function( base_folder_path ) {
			var folderEle = undefined;
			
			try {
				//base 
				var CIB = moCI.Browser;
				var broDOM = CIB.document;
				
				folderEle = broDOM.createElement("DIV");
				var base_id = md5(base_folder_path);
				if (config.log.full) console.log("createBrowserFolderView > ", base_folder_path );
				var bProjects = CIB.Projects;
				var bProjectsInFolder = bProjects[ base_folder_path ];

				
				folderEle.setAttribute("id","base_folder_" + base_id );
				folderEle.setAttribute("base_id",base_id);
				folderEle.setAttribute("class","browser_project_category closed");
				
				//label
				var folderLabel = broDOM.createElement("LABEL");
				folderLabel.setAttribute( "base_id", base_id );
				folderLabel.setAttribute( "title", base_folder_path );
				folderLabel.setAttribute( "class", "category_folder_label" );
				folderLabel.innerHTML = path.basename(base_folder_path );
				
				folderLabel.addEventListener( "click", function(event) {
				
					var CIB = moCI.Browser;
					var broDOM = CIB.document;
					var bid = event.target.getAttribute("base_id");
					var container_name_id = "base_folder_"+bid+"_container";
					//togglediv(  );
					if (config.log.full) console.log("folder id is:", "base_folder_" + bid );
					if (config.log.full) console.log("projects container id is:", container_name_id );
					
					$(broDOM.getElementById("base_folder_" + bid) ).toggleClass("closed");
					//$(broDOM.getElementsByClassName("browser_project_category") ).addClass("closed");				
					//$(broDOM.getElementById("browser_panel") ).addClass("browser_selection");
					
				});
				
				folderEle.appendChild( folderLabel );
				
				//samples container
				var samplesContainer = broDOM.createElement("DIV");
				samplesContainer.setAttribute( "id", "base_folder_"+base_id+"_container" );
				samplesContainer.setAttribute( "class", "browser_project_category_container" );
				folderEle.appendChild( samplesContainer );
				
				//now feed with projects .mol
				if (base_folder_path=="Recents") {				
					//its an array of ( [index] = molfile )
					for( var	base_mol_index=bProjectsInFolder.length-1,base_mol_file=bProjectsInFolder[base_mol_index];
								base_mol_index>=0 && base_mol_file; 
								base_mol_index--,base_mol_file=bProjectsInFolder[base_mol_index] ) {
						var molEleProject = CIB.createProjectItem( base_mol_file );					
						samplesContainer.appendChild( molEleProject );
					}
				} else {
					for( var base_mol_file in bProjectsInFolder ) {					
						var molEleProject = CIB.createProjectItem( base_mol_file );					
						samplesContainer.appendChild( molEleProject );
					}
				}
			} catch(err) {
				console.error("createProjectFolderView > ",err);
			}
			return folderEle;
		},
		"updateBrowser": function() {
			try {
				var CIB = moCI.Browser;
				var broDOM = CIB.document;
				if (config.log.full) console.log("updateBrowser() browser DOM: ", broDOM);
				if (broDOM==undefined) {
					console.error("updateBrowser() no browser DOM");
					return;
				}
				var browser_div = broDOM.getElementById("browser_panel");
				if (browser_div==undefined) {
					console.error("updateBrowser() no 'browser_panel'");
					return;
				}
				if (config.log.full) console.log("updateBrowser in: ", browser_div);
				
				var check_for = [ config.desktop_path, config.sample_path, config.moldeouser_path ];
				
				/* SCAN FOLDERS */
				for( var i in check_for ) {
					var base_folder = check_for[i];
					//iterate over
					CIB.scanProjectsFolder( base_folder );
				}
				
				/* CREATE PROJECTS LAUNCHERS */
				var base_id = 0;	
				for( var base_folder_name in CIB.Projects ) {
									
					var folderEle = CIB.createProjectFolderView( base_folder_name );
					base_id+= 1;
					browser_div.appendChild( folderEle );
				}
				
				/* LEAVE OPEN THE "RECENT" FOLDER */
				var categories = browser_div.getElementsByClassName("category_folder_label");
				if (categories.length) $(categories[0]).click();
				
			} catch(err) {
				console.error("updateBrowser() > error",err);
			}
		},		
		"Projects": {			
			"Recents": [],
			/*
			"Favorites": {},
			"MoldeoLab": {},			
			"Samples": {},
			*/
		},
		"SaveRecents": function( filename ) {
			if (filename) moCI.Browser.Projects.Recents.push( filename );
			for( var mol_index in Browser.Projects.Recents ) {
				var recent_mol_file = Browser.Projects.Recents[mol_index];
				
			}
		},		
		"Textures": {
		},
		"Movies": {
		},
		"Sounds": {
		},
		"Functions": {
			
		}
	},
	
	"Render": {
		"document": null,
		"winRender": null,
		"renderOptions": null,
		"initialized": false,
		"Open": function( options ) {
			moCI.Render.renderOptions = options;			
			if (moCI.Render.winRender==null) {
				
				moCI.Render.winRender = gui.Window.open('MoldeoRender.html', {
					icon: "moldeocontrol.png",
					focus: true,						
					toolbar: false,
					frame: true,
					width: win.width,
					height: 200,
					position: "center",
				});
				if (moCI.Render.winRender) {
					moCI.Render.winRender.moveTo(win.x, win.y-230);					
					moCI.Render.winRender.moCI = moCI;
					moCI.Render.winRender.on('loaded', function() {
						moCI.Render.document = moCI.Render.winRender.window.document;
						moCI.Render.initialized = true;
						moCI.Render.renderOptions["stdout_stream"].resume();
					});
					//moCI.Browser.winBrowser.on('focus', moCI.Browser.initBrowser);
					moCI.Render.winRender.on('closed', function() {
						console.log("Render closed!");
						moCI.Render.winRender = null;
						moCI.Render.initialized = false;
					});
					moCI.Render.winRender.on('close', function() {
						console.log("Render closing!");
						moCI.Render.winRender = null;
						moCI.Render.initialized = false;
						this.close(true);
					});
				}
			}
		},
		"ShowVideo": function(error) {
			if (error==false) {
				alert("La grabación finalizó correctamente.");
				moCI.Render.winRender.close();
			} else {
				alert("La grabación NO finalizó. Revise el script, o ");
				return false;
			}
			var cfile = moCI.document.getElementById("saveasvideo");			
			//moCI.Render.renderOptions
			try {
				if (cfile) {
					cfile.value = "";
					cfile.click();			
				} 
			} catch(err) {
				alert(err);
				console.error(err);
			}
		},
		"SaveAsVideo": function( filename ) {
			//moCI.Render.renderOptions
			console.log("SaveAsVideo > filename: ", filename);
			var fullvideoname = moCI.Render.renderOptions["fullvideoname"];
			try {
				fs.copyFile( fullvideoname, filename, function(err) {
					if (err) {
						alert(err);
						console.error("SaveAsVideo > filename: ",filename, err);
					} else {
						alert("Video copiado a :" + filename );
					}
				} );
			} catch(err) {
				alert(err);
				console.error("SaveAsVideo > filename: ",filename, err);
			}
		},
	},
	
	"mapSelectionsObjects": {
	},
	
	"mapSelectionsObjectsByLabel": {
	
	},
	/**GENERAL CONSOLE FUNCTIONS*/
	"UpdateState": function( info ) {
		
		moCI.State = info;
		
		if (moCI.State==undefined) return;
		if (config.log.full) console.log("moCI.UpdateState > "+info);
		if (config.log.full) console.log("moCI.State[effectstate][tempo]:" + moCI.State["effectstate"]["tempo"]);
		
		var gtimerstate = moCI.State["effectstate"]["tempo"]["globaltimer_state"];
		var gtimerclock = moCI.State["effectstate"]["tempo"]["globaltimer_duration"];
		
		if (config.log.full) console.log("moCI.UpdateState: gtimerstate:" + gtimerstate + " gtimerclock:" + gtimerclock );
		
		var bENTER = document.getElementById("button_ENTER");
		var button_classes = { "playing": "button_PAUSE", "stopped": "button_ENTER", "paused": "button_ENTER" }

		if (bENTER && gtimerstate) {
			bENTER.setAttribute("class",button_classes[gtimerstate]+" special_button");
		} else {
			console.error("NO button_ENTER for PLAY action or no 'globaltimer_state/duration' received.");
		}
		
		if ( moCI.State.mode=="rendersession" ) {
			document.getElementById("button_RECORD").setAttribute("class","button_RECORD_on special_button");
		} else {
			document.getElementById("button_RECORD").setAttribute("class","button_RECORD special_button");
		}

	},	
	"UpdateConsole": function( target, info ) {

		if (this.Log) 
			if (config.log.full) console.log( "moCI.UpdateConsole() > info: ",info );
		
		if (target=="__console__")
			if (config.log.full) console.log("OK: __console__ info message: ", info );
		if (info==undefined) return;
		
		moCI.Project = info;
		moCI.mapSelectionsObjectsByLabel = {};
		moCI.mapSelectionsObjects = {};

		if (moCI.Project.MapEffects==undefined) return;
		
		for(var label in moCI.Project.MapEffects) {
			keyname = moCI.Project.MapEffects[label];
			
			if (moCI.mapSelectionsObjectsByLabel)
				moCI.mapSelectionsObjectsByLabel[ label ]  = keyname;
				
			if (keyname!="" && moCI.mapSelectionsObjects)
				moCI.mapSelectionsObjects[ keyname ] = label;
		}

		RegisterAllButtonActions();

		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolegetstate', 'val1': '__console__' } );
		
		//if (moCI.Project["
		//.setAttribute("class","button_PAUSE special_button");
		
		//update every object states
		for(var label in moCI.Project.MapEffects) {
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': label } );
		}
		
		moCI.Control.Functions.ObjectsToProjectPanel( moCI.Project );
		
		moCI.Connectors.Functions.ObjectsToTree();
	
	},
	"OpenProject": function( filename ) {
		moCI.filename = ' -mol "'+filename+'" ';
		//filename = filename.replace( /\'/g , '"');
		//filename = filename.replace( /\\/g , '\\\\');
	
		console.log( "OpenProject:" , moCI.filename);
	
		moCI.launchPlayer( moCI.filename );
		
		moCI.Browser.SaveRecents( filename );
		moCI.ReloadInterface();
	},
	"Save": function() {			
		if (config.log.full) console.log("buttonED_Presentation > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesave', 'val1': '' } );		
	},
	"SaveProjectAs": function( filename ) {
		//must clone!!! Use moDataManager::Export function...
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesaveas', 'val1': filename } );
	},	
	"SaveScreenshotAs": function( screenshot, filename ) {
		console.log("screenshot:",screenshot," filename:",filename);
		try {
			fs.copyFile( screenshot, filename, function(err) {
				if (err) {				
					console.error("fs.copyFile ERROR: ", err);
				} else {
					if (config.log.full) console.log("fs.copyFile OK!");
				}
			} );
		} catch(bigerr) {
			alert("Error copiando captura, intente de nuevo."+bigerr);
		}
	},
	"RecordSession": function( info ) {
		console.log("Record Session");	
		console.log("Record Session", info);
		moCI.UpdateState( info );
	},
	"RenderSession": function( info ) {
		console.log("Render Session", info );
		//$("#button_RECORD").toggleClass("button_RECORD_on");
		moCI.UpdateState( info["consolestate"] );
		
		if (info["consolestate"].mode=="live") {
			config.render.session = info["session"];
		
			//finaliza el render mostrando una ventana para elegir el codec para el video
			var wini = document.getElementById("render_video_info");
			var wini_container_codec = document.getElementById("render_video_info_container_codec");
			//clean options
			wini_container_codec.innerHTML = "";
			
			var rvideoplatform = config.render_video_pipes[config.platform];
			
			
			for( var container in rvideoplatform ) {
			
				var codecs = rvideoplatform[ container ];
				
				for( var codec in codecs ) {
				
					videocontainer_codec = container+" codec:" + codec;
					
					var option = document.createElement("option");
					option.setAttribute("value", videocontainer_codec );
					option.innerHTML = videocontainer_codec;
					wini_container_codec.appendChild( option );
				}				
			}
			$(wini).show();
		}
	},
	"RenderVideo": function( frame_path, videocontainer, videocodec, videoname ) {
		console.log("RenderVideo:",frame_path,videocontainer,videocodec,videoname,config.platform);		
		
		//Render Options
		var rOptions = { 
			"frame_path": frame_path,
			"videoname": videoname,
			"videocontainer": videocontainer,
			"videocodec": videocodec, 
			"platform": config.platform,			
			"full_call":  "",
			"rendered_folder": config.render.session["rendered_folder"],
			};
		var rvideoplat = config.render_video_pipes[ config.platform ];
		
		if (rvideoplat) {
			rOptions["full_call"] = rvideoplat[rOptions["videocontainer"]];
			if (rOptions["full_call"])
				rOptions["full_call"] = rOptions["full_call"][rOptions["videocodec"]];
			else return false;
		} else return;
		if (rOptions["full_call"]=="") {
			alert("No gstreamer pipeline prepared for codec:"+rOptions["videocodec"] );
			return false; 
		}
		//video in same folder!!
		rOptions["videoname"] = rOptions["frame_path"]+"/"+rOptions["videoname"];
		rOptions["fullvideoname"] = rOptions["videoname"]+"."+rOptions["videocontainer"] 
		
		rOptions["full_call"] = rOptions["full_call"].replace("{VIDEONAME}", rOptions["videoname"] );
		rOptions["full_call"] = rOptions["full_call"].replace("{FRAMEPATH}", rOptions["frame_path"] );
		
		//fs.write("render_video.bat");
		console.log("full_call:",rOptions["full_call"]);
		
		launchRender( rOptions["full_call"], rOptions );
		
	},
	"Presentation": function() {
		if (config.log.full) console.log("buttonED_Presentation > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepresentation', 'val1': '' } );
	},
	"Screenshot": function() {
		if (config.log.full) console.log("buttonED_Screenshot > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolescreenshot', 'val1': '' } );
	},
	"PreviewShot": function() {
		if (config.log.full) console.log("buttonED_PreviewShot > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepreviewshot', 'val1': '' } );		
	},
	"GetValuesToStr": function( moblabel, paramName, preconfig) {
		var data = '';
		var coma = '';
		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return false;
		
		var Param = Params[ paramName ];
		if (Param==undefined) return;
		var paramValue = Param.paramvalues[preconfig];
		if (paramValue && paramValue.length) {
			for(var sub=0; sub<paramValue.length; sub++) {
				var valuedef = paramValue[sub]["valuedefinition"];
				data+= coma+paramValue[sub]["value"];
				coma = ",";
			}
		}
		return data;
	},
	
	/**
	* TOOLS:

	*	retreive "paramvalues"
	*/
	"GetParamValues": function( moblabel, paramName, preconfig ) {
		
		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return false;
		
		var Param = Params[ paramName ];					
		if ( Param == undefined) return false;
		if ( Param.paramvalues==undefined ) return false;
			
		var pvals = Param.paramvalues[preconfig];
		if ( pvals ) 
			return pvals
			
		return false;

	},
	/**
	*	Retreive Parameters object of a Moldeo Object named [moblabel]
	*/
	"GetParams": function( moblabel ) {
		return Editor.Parameters[moblabel];
	},
	// Save preconfig for moblabel
	"MemorizePreconfigSelection": function( moblabel, preconfig ) {
		Editor.PreconfigsSelected[ moblabel ] = preconfig;
	},
	// Get last preconfig for moblabel
	"RememberPreconfigSelection": function( moblabel ) {
		return Editor.PreconfigsSelected[ moblabel ];
	},
	// Set the inspector htmlElement with attributes so it can inspect the Object:
	// moblabel and preconfig
	"SubscribeInspectorToMob": function( inspEle, moblabel, preconfig ) {
		
		//SET inspectorElement with attributes: moblabel // preconfig
		if (inspEle && moblabel && preconfig>=0) {
		
			inspEle.setAttribute("moblabel", moblabel);
			inspEle.setAttribute("preconfig", preconfig );
			
			//remember the preconfig selection!
			moCI.MemorizePreconfigSelection( moblabel, preconfig );
		}
		
	},	
	
	
	"AddValue": function( moblabel, param, preconfig, value ) {
		if (config.log.full) console.log("AddValue: moblabel:",moblabel, "param:",param, "preconfig:",preconfig,"value:",value );
		Editor.SaveNeeded = true;
		if (value==undefined) 
			return OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig, 'val4': value } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );		
		if (Editor.SaveNeeded) {
			activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
			activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		}
	},
	"AddPreconfig": function( moblabel, preconfig ) {		
		if (config.log.full) console.log("AddPreconfig: moblabel:",moblabel, "preconfig:",preconfig );
		Editor.SaveNeeded = true;
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigadd', 'val1': moblabel, 'val2': preconfig } );		
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );		
		if (Editor.SaveNeeded) {
			activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
			activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		}
	},
	"ReloadInterface": function() {
		if (moCI.Browser.winBrowser)
			moCI.Browser.winBrowser.close();
		
		if (config.log.full) console.log("Console::ReloadInterface()",win);
		//setTimeout( function() { win.reloadDev(); }, 2000 );
	},
	"launchPlayer": launchPlayer,
	"fs": fs,
	"console": console,
};

var MCI = ConsoleInterface;
MCI.document = document;
var moCI = MCI;
/** SHORTCUTS */
var Player = moCI.Player;
var Browser = moCI.Browser;
var Connectors = moCI.Connectors;
var Options = moCI.Options;
var Control = moCI.Control;
var Editor = moCI.Editor;
var Scenes = moCI.Scenes;

var sliderMessages = {
	'channel_alpha': { 
		'osc': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "alpha", "val3": msgvalue }', 
		'divisor' : 100.0 
	},
	'channel_tempo': {
		'osc': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "tempo", "val3": msgvalue }',
		'divisor': 50.0
	}
};

