var md5 = require('md5-node');

var ConsoleInterface = {
	"Options": {
		"MAX_N_PRECONFIGS": 3,
	},
	
	"Log": true,
	
	"State": {},
	
	"Info": {},
	
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
					selectPlayerPreconfig( Control.ObjectSelected, 0 );
				},
			},
			"button_2": {
				"click": function(event) {
					if (config.log.full) console.log("button_2 > click");
					selectPlayerPreconfig( Control.ObjectSelected, 1 );
				}
			},
			"button_3": {
				"click": function(event) {
					if (config.log.full) console.log("button_3 > click");
					selectPlayerPreconfig( Control.ObjectSelected, 2 );
				}
			},
			"button_F1": {
				"click": function(event) {
					if (config.log.full) console.log("button_F1");
					selectPlayerPreset( 0 );
				},
			},
			"button_F2": {
				"click": function(event) {
					if (config.log.full) console.log("button_F2");
					selectPlayerPreset( 1 );
				}
			},
			"button_F3": {
				"click": function(event) {
					if (config.log.full) console.log("button_F3");
					selectPlayerPreset( 2 );
				}
			}
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
		},
		"mapCursorStateMod": {
			"LEFT": { "member": "alpha", "value": "decrement", "pressed": false },
			"RIGHT": { "member": "alpha", "value": "increment", "pressed": false },
			
			"UP": { "member": "tempo", "value": "increment", "pressed": false },
			"DOWN": { "member": "tempo", "value": "decrement", "pressed": false }
		}
		
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
				"scalez": { "scalez": true, },
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
							if (config.log.full) console.log("editor_button click!");
							
							var editor_panel = document.getElementById("editor_panel");
							var editor_button = document.getElementById("editor_button");
							
							if (!classActivated( editor_panel,"editor_opened")) {
								if (config.log.full) console.log("editor opening");
								activateClass( editor_panel, "editor_opened");
								
								activateClass( editor_button, "editor_button_close");
							} else {
								if (config.log.full) console.log("editor closing");
								deactivateClass( editor_button, "editor_button_close");
								deactivateClass( editor_panel, "editor_opened");
								
							}
						
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
					ConsoleInterface.Browser.Open();
				},
			},
			"buttonED_SaveProject": {
				"click": function(event) { ConsoleInterface.Save(); },
			},
			"buttonED_SaveProjectAs": {
				"click": function(event) {
					if (config.log.full) console.log("buttonED_SaveProjectAs > SaveAsDialog");
					var saveasproject = document.getElementById("saveasproject");			
					if (saveasproject) {
						saveasproject.click();
					}
				}
			},
			"buttonED_Presentation": {
				"click": function(event) { ConsoleInterface.Presentation(); },
			},
			"buttonED_Screenshot": {
				"click": function(event) { ConsoleInterface.Screenshot(); },
			},
			"buttonED_PreviewShot": {
				"click": function(event) { ConsoleInterface.PreviewShot(); },
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
					
					ConsoleInterface.SaveProjectAs( filename );		
				},
			},
			"saveasproject": {
				"change": function(event) {
					var dirname = event.target.value;			
					if (config.log.full) console.log("saveasproject > ", dirname );
					
					ConsoleInterface.SaveProjectAs( dirname );		
				},
			},
			"openproject": {
				"change": function(event) {
					var filename = event.target.value;			
					if (config.log.full) console.log("openproject > ", filename );
		
					ConsoleInterface.OpenProject( filename );
				},
			},
			"saveasscreenshot": {
				"change": function(event) {
					
					var filename = event.target.value;	
					var	screenshot = event.target.getAttribute("lastscreenshot");
					console.log("saveasscreenshot > screenshot:", screenshot," filename:", filename );
					
					ConsoleInterface.SaveScreenshotAs( screenshot, filename );				
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
				return ConsoleInterface.Editor.Functions["reload"]();
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
				ConsoleInterface.ReloadInterface();
			},
			"edit_button_click": function(event) {
				try {
					var mkey = event.target.getAttribute("key");
					
					if (config.log.full) console.log("buttonED_",mkey," event:", event.target.getAttribute("id") );
					if (ConsoleInterface.mapSelectionsObjects)
						if (ConsoleInterface.mapSelectionsObjects[mkey]) {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + ConsoleInterface.mapSelectionsObjects[mkey] + '' } ); //retreive all parameters
							//send a request to get full object info...ASYNC
						}
				} catch(err) {
					console.error("Editor.Functions.edit_button_click > ", err);
					alert(err);					
				}
			},
			
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

				var preeffect = ConsoleInterface.Info.config.parameters["preeffect"].paramvalues;
				var effect = ConsoleInterface.Info.config.parameters["effect"].paramvalues;
				var posteffect = ConsoleInterface.Info.config.parameters["posteffect"].paramvalues;
				var mastereffect = ConsoleInterface.Info.config.parameters["mastereffect"].paramvalues;
				var resources = ConsoleInterface.Info.config.parameters["resources"].paramvalues;
				/* TODO: do it right, searching full objects, with moldeo ids*/
				var moldeo_ids = 0;
				
				for( var group_i in console_tree.children  ) {
				
					var node = console_tree.children[group_i];
					var moldeo_objects_values = ConsoleInterface.Info.config.parameters[ node.name ].paramvalues;
					
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
				ConsoleInterface.Connectors.Tree = console_tree;
				if (config.log.full) console.log("ObjectsToTree", ConsoleInterface.Connectors.Tree );
				
				ConsoleInterface.Connectors.FRib = new FractalRibosome( ConsoleInterface.Connectors.Tree, window.innerWidth, window.innerHeight,
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

				ConsoleInterface.Connectors.FRib.Init( "connector_panel" );	
			},
		}
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
			if ( ConsoleInterface.Editor.SaveNeeded==true  ) {
				if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {
					
				} else {
					if (config.log.full) console.log("Aborting browser opening...");
					return;
				}
			}			
			
			var cfile = ConsoleInterface.document.getElementById("openproject");			
			
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
				if (ConsoleInterface.Browser.initialized) {
					if (config.log.full) console.log("initBrowser > already initialized. returning.");
					return;
				}
				if (ConsoleInterface.Browser.winBrowser) {
					ConsoleInterface.Browser.winBrowser.ConsoleInterface = ConsoleInterface;
					if (ConsoleInterface.Browser.winBrowser.window) {
						ConsoleInterface.Browser.winBrowser.window.ConsoleInterface = ConsoleInterface;
						ConsoleInterface.Browser.winBrowser.window.opener = gui.Window.get();
						if (config.log.full) console.log(this);
						ConsoleInterface.Browser.document = ConsoleInterface.Browser.winBrowser.window.document;
						ConsoleInterface.Browser.document.getElementById("close-window-button").onclick = function() {
							ConsoleInterface.Browser.Close();							
						}
					} else console.error("initBrowser > no .window");
					ConsoleInterface.Browser.updateBrowser();					
					ConsoleInterface.Browser.initialized = true;
				} else {
					ConsoleInterface.Browser.initialized = false;
				}
			} catch(err) {
				console.error("initBrowser:",err);
			}
		},
		"Open": function() {
			try { 
				if (ConsoleInterface.Browser.winBrowser==null) {
					ConsoleInterface.Browser.winBrowser = gui.Window.open('MoldeoBrowser.html', {
						icon: "moldeocontrol.png",
						focus: false,
						position: 'center',
						toolbar: true,
						frame: true,
						width: 834,
						height: 328,
					});
					if (ConsoleInterface.Browser.winBrowser) {
						if (config.log.full) console.log("ConsoleInterface.Browser.Open > registering events.");
						ConsoleInterface.Browser.winVisible	= true;
						//ConsoleInterface.Browser.winBrowser.opener = gui.Window.get();
						ConsoleInterface.Browser.winBrowser.on('loaded', ConsoleInterface.Browser.initBrowser);
						//ConsoleInterface.Browser.winBrowser.on('focus', ConsoleInterface.Browser.initBrowser);
						ConsoleInterface.Browser.winBrowser.on('closed', function() {
							console.log("Browser closed!");
							ConsoleInterface.Browser.winBrowser = null;
							ConsoleInterface.Browser.initialized = false;
						});
						ConsoleInterface.Browser.winBrowser.on('close', function() {
							console.log("Browser closing!");
							ConsoleInterface.Browser.winBrowser = null;
							ConsoleInterface.Browser.initialized = false;
							this.close(true);
						});
						//setTimeout( ConsoleInterface.Browser.initBrowser, 1000 );
						
					} else {
						console.error("ConsoleInterface.Browser.Open > ConsoleInterface.Browser.winBrowser NULL: ", ConsoleInterface.Browser.winBrowser);
					}
				} else {
					if (config.log.full) console.log("Browser.Open() > just show it",ConsoleInterface.Browser.winBrowser.window);
										
					if (ConsoleInterface.Browser.winBrowser.window==undefined) {
						if (config.log.full) console.log("Browser.Open() > re-open");
						ConsoleInterface.Browser.winBrowser.close(true);
						ConsoleInterface.Browser.winBrowser = null;
						ConsoleInterface.Browser.initialized = false;
						ConsoleInterface.Browser.Open();
					}
					
					ConsoleInterface.Browser.winVisible = !ConsoleInterface.Browser.winVisible;
					var result = ConsoleInterface.Browser.winBrowser.show( ConsoleInterface.Browser.winVisible );					
					
				}		
			} catch(err) {
				console.error("Open:",err);
			}
			
			
		},
		"Close": function() {
			if (ConsoleInterface.Browser.winBrowser == null) return;
			ConsoleInterface.Browser.winVisible	= false;
			ConsoleInterface.Browser.initialized = false;			
			ConsoleInterface.Browser.winBrowser.show( ConsoleInterface.Browser.winVisible );
		},
		"scanProjectsFolder": function(base_folder) {
			//* check: https://nodejs.org/api/path.html*/
		
			if (config.log.full) console.log("loadBrowserFolder(",base_folder,") check https://nodejs.org/api/path.html");
			var bProjects = ConsoleInterface.Browser.Projects;
			
			if (bProjects[base_folder]==undefined)
				bProjects[base_folder] = {};
			try {
				ConsoleInterface.fs.walk( base_folder, function( filepath, stat ) {
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
				alert(err);
			}
		},
		"createProjectItem": function( base_mol_file ) {
			if (config.log.full) console.log("createProjectItem > ",base_mol_file);
			var CIB = ConsoleInterface.Browser;
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
				if (ConsoleInterface.fs.existsSync( project_preview_shot )) {
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
						ConsoleInterface.OpenProject( ele_file );
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
				var CIB = ConsoleInterface.Browser;
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
				folderLabel.innerHTML = path.basename(base_folder_path );
				
				folderLabel.addEventListener( "click", function(event) {
				
					var CIB = ConsoleInterface.Browser;
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
				var CIB = ConsoleInterface.Browser;
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
				
				var check_for = [ config.sample_path, config.moldeouser_path ];
				
				/*FIRST CHECK EVERY FOLDER, RECURSIVELY FOR PROJECTS:....*/
				/*from: config.sample_path*/
				/*from: config.moldeouser_path*/
				/*from: config.recent projects ???*/	
				for( var i in check_for ) {
					var base_folder = check_for[i];
					//iterate over
					CIB.scanProjectsFolder( base_folder );
				}
				
				//iterate over the projects folders and mols
				//CREATE HTML divs
				//var base_id = 0;	
				for( var base_folder_name in CIB.Projects ) {
									
					var folderEle = CIB.createProjectFolderView( base_folder_name );				
					//base_id+= 1;
					browser_div.appendChild( folderEle );
				}
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
		"SaveRecents": function() {
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
	
	"mapSelectionsObjects": {
	},
	
	"mapSelectionsObjectsByLabel": {
	
	},
	/**GENERAL CONSOLE FUNCTIONS*/
	"UpdateState": function( info ) {
		ConsoleInterface.State = info;
		if (ConsoleInterface.State==undefined) return;
		if (config.log.full) console.log("ConsoleInterface.UpdateState > "+info);
		if (config.log.full) console.log("ConsoleInterface.State[tempo]:" + ConsoleInterface.State["tempo"]);
		var gtimerstate = ConsoleInterface.State["tempo"]["globaltimer_state"];
		var gtimerclock = ConsoleInterface.State["tempo"]["globaltimer_duration"];
		if (config.log.full) console.log("ConsoleInterface.UpdateState: gtimerstate:" + gtimerstate + " gtimerclock:" + gtimerclock );
		var bENTER = document.getElementById("button_ENTER");
		var button_classes = { "playing": "button_PAUSE", "stopped": "button_ENTER", "paused": "button_ENTER" }
		if (bENTER && gtimerstate) {
			bENTER.setAttribute("class",button_classes[gtimerstate]+" special_button");
		} else {
			console.error("NO button_ENTER for PLAY action or no 'globaltimer_state/duration' received.");
		}
	},	
	"UpdateConsole": function( target, info ) {

		if (this.Log) 
			if (config.log.full) console.log( "ConsoleInterface.UpdateConsole() > info: ",info );
		
		if (target=="__console__")
			if (config.log.full) console.log("OK: __console__ info message: ", info );
		if (info==undefined) return;
		
		ConsoleInterface.Info = info;
		ConsoleInterface.mapSelectionsObjectsByLabel = {};
		ConsoleInterface.mapSelectionsObjects = {};

		if (ConsoleInterface.Info.MapEffects==undefined) return;
		
		for(var label in ConsoleInterface.Info.MapEffects) {
			keyname = ConsoleInterface.Info.MapEffects[label];
			
			if (ConsoleInterface.mapSelectionsObjectsByLabel)
				ConsoleInterface.mapSelectionsObjectsByLabel[ label ]  = keyname;
				
			if (keyname!="" && ConsoleInterface.mapSelectionsObjects)
				ConsoleInterface.mapSelectionsObjects[ keyname ] = label;
		}

		RegisterAllButtonActions();

		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolegetstate', 'val1': '__console__' } );
		
		//if (ConsoleInterface.Info["
		//.setAttribute("class","button_PAUSE special_button");
		
		//update every object states
		for(var label in ConsoleInterface.Info.MapEffects) {
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': label } );
		}
		
		ConsoleInterface.Control.Functions.ObjectsToProjectPanel( ConsoleInterface.Info );
		
		ConsoleInterface.Connectors.Functions.ObjectsToTree();
	
	},
	"OpenProject": function( filename ) {
		ConsoleInterface.filename = ' -mol "'+filename+'" ';
		//filename = filename.replace( /\'/g , '"');
		//filename = filename.replace( /\\/g , '\\\\');
	
		console.log( "OpenProject:" , ConsoleInterface.filename);
	
		ConsoleInterface.fs.launchPlayer( ConsoleInterface.filename );
		ConsoleInterface.Browser.Projects.Recents.push( filename );
		ConsoleInterface.Browser.SaveRecents();
		ConsoleInterface.ReloadInterface();
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
	"GetValuesToData": function( Param, preconfig) {
		var data = '';
		var coma = '';
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
	"AddValue": function( moblabel, param, preconfig, value ) {
		if (config.log.full) console.log("AddValue: moblabel:",moblabel, "param:",param, "preconfig:",preconfig,"value:",value );
Editor.SaveNeeded = true;
		if (value==undefined) 
			return OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig, 'val4': value } );
	},
	"ReloadInterface": function() {
		if (ConsoleInterface.Browser.winBrowser)
			ConsoleInterface.Browser.winBrowser.close();
		
		if (config.log.full) console.log("Console::ReloadInterface()",win);
		//setTimeout( function() { win.reloadDev(); }, 2000 );
	},
	"fs": fs,
	"console": console,
};

var Console = ConsoleInterface;
ConsoleInterface.document = document;
var moCI = Console;
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

