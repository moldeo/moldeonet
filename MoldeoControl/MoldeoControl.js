
var Controls = {
	"Windows": {
		"parameters_preconfig": {},
	},
	"Widgets": {
		"standard_input": {			
		},
		"select_input": {			
		},
		"color_picker": {			
		},
		"canvas_position": {			
		}
	}
};


function updateSliderHorizontalValue( value, target, send ) {

	var message = target.getAttribute("msg");
	var moblabel =  target.getAttribute("moblabel");
	var msg = sliderMessages[message]["osc"];
	var divisor = sliderMessages[message]["divisor"];
	var min = target.getAttribute("min");
	var max = target.getAttribute("max");
	
	if (send==undefined) send = false;
	var rect = target.getBoundingClientRect();
	x = rect.left;
	y = rect.top;
	w = rect.right - rect.left;
	h = rect.bottom - rect.top;
	
	target.setAttribute("style","background-position: -"+( w - value*w/(max-min) )+"px 0px;");
	target.setAttribute("value",value);
	target.value = value;
	if (send) {		
		if (moblabel) {
			msg = msg.replace( /moblabel/g , moblabel );
			msg = msg.replace( /msgvalue/g , value/divisor );
			if (config.log.full) console.log("msg:",msg);
			OscMoldeoSend( JSON.parse( msg ) );	
		}
		
	}
};
			
function updateSliderVerticalValue( value, target, send ) {

	var message = target.getAttribute("msg");
	var moblabel =  target.getAttribute("moblabel");
	var msg = sliderMessages[message]["osc"];
	var divisor = sliderMessages[message]["divisor"];
	var min = target.getAttribute("min");
	var max = target.getAttribute("max");
	
	if (send==undefined) send = false;
	var rect = target.getBoundingClientRect();
	x = rect.left;
	y = rect.top;
	w = rect.right - rect.left;
	h = rect.bottom - rect.top;
	
	target.setAttribute("style","background-position: -"+( h - value*h/(max-min) )+"px 0px;");
	target.setAttribute("value",value);
	target.value = value;
	
	if (send) {
		if (moblabel) {
			msg = msg.replace( /moblabel/g , moblabel );
			msg = msg.replace( /msgvalue/g , value/divisor );
			if (config.log.full) console.log("msg:",msg);
			OscMoldeoSend( JSON.parse( msg ) );	
		}
		
	}
	
};



/**
*	selectEffect
*
*	select the effect mapped by selkey
*
*	@param selkey key is keyboard ( "A", "W", ... ) 
*
*/
function selectEffect( selkey ) {

	if (config.log.full) console.log("selectEffect > selkey: ",selkey);

	var dSEL = document.getElementById("button_"+selkey);
	if (moCI.mapSelectionsObjects && moCI.mapSelectionsObjects[selkey]) {
	
	} else return console.error("selectEffect > NO MAPPING for this OBJECT > mapSelectionsObjects[" + selkey +"] > " + moCI.mapSelectionsObjects[selkey] );
	
	Control.ObjectSelected = moCI.mapSelectionsObjects[selkey];
	if (Control.PreconfigsSelected[Control.ObjectSelected]==undefined)
		Control.PreconfigsSelected[Control.ObjectSelected] = 0;
	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dkey = document.getElementById("button_"+mkey);
		if (dkey) deactivateClass( dkey, "fxselected" );
	}

	//show correct preconfig selected
	UnselectButtonsCircle();
	var dc = document.getElementById("button_"+(Control.PreconfigSelected[Control.ObjectSelected]+1));
	if (dc) activateClass( dc, "circle_selected" );
	
	//set sliders
	OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': moCI.mapSelectionsObjects[selkey] } );
	
	if (dSEL) activateClass( dSEL, "fxselected" );
}

function selectEditorEffect( selkey ) {

	Editor.ObjectSelected = moCI.mapSelectionsObjects[selkey];
	var dSEL = document.getElementById("buttonED_"+selkey);

	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dED = document.getElementById("buttonED_"+mkey);
		if (dED) deactivateClass( dED, "fxediting" );
	}

	if (dSEL) activateClass( dSEL, "fxediting" );
}

function selectEditorEffectByLabel( MOBlabel ) {
	if (config.log.full) console.log("UpdateEditor > selectEditorEffectByLabel");

	Editor.ObjectSelected = MOBlabel;
	selkey = moCI.mapSelectionsObjectsByLabel[MOBlabel];
	
	var dED = document.getElementById("buttonED_"+selkey);

	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dd = document.getElementById("buttonED_"+mkey);
		if (dd) deactivateClass( dd, "fxediting" );
	}
	
	if (dED) activateClass( dED, "fxediting" );
}


function UnselectButtonsCircle() {
	for(var i = 1; i<=Options["MAX_N_PRECONFIGS"]; i++) {
		var PreI = document.getElementById("button_"+i);
		if (PreI) deactivateClass( PreI, "circle_selected" );
	}
}





var editor_active = true;

function activateEditor() {
	if (config.log.full) console.log("activateEditor");
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

var canvaspalette;
var ctxpalette;
var paletteImg;


/****************************** CONTROL BUTTONS ************************************************




CONTROL BUTTONS 





****************************** CONTROL BUTTONS ************************************************/

/** SCENE SLIDE CONTROLS: ALPHA , TEMPO */
function RegisterSceneCursorSliders() {
	
	var sH = document.getElementById("scene_slide_VERTICAL_channel_alpha");
	 
	if (sH) {
		sH.updateValue = updateSliderVerticalValue;
		sH.addEventListener( "change",
			function(event) {
				if (config.log.full) console.log("scene_slide_VERTICAL_channel_alpha", event.target.value );
				event.target.updateValue( event.target.value, event.target, true );	
			}
		);
		sH.disabled = false;
		sH.updateValue( 0 , sH );
	} else console.error("RegisterSceneCursorSliders > no  scene_slide_VERTICAL_channel_alpha");
	
	var sV = document.getElementById("scene_slide_VERTICAL_channel_tempo");

	if (sV) {
		sV.updateValue = updateSliderVerticalValue;
		sV.addEventListener( "change",
			function(event) {
				if (config.log.full) console.log("scene_slide_VERTICAL_channel_tempo",event.target.value );
				event.target.updateValue( event.target.value, event.target, true );	
			}
		);
		sV.disabled = false;
		sV.updateValue( 0 , sV );
	} else console.error("RegisterSceneCursorSliders > no  scene_slide_VERTICAL_channel_tempo");

}


/** left = 37, up = 38, right = 39, down = 40 */
function startSend( tkey ) {
	
	var dataCommand = Control.mapCursorStateMod[ tkey ]["command"];
	
	OscMoldeoSend( dataCommand );
	
	if (Control.mapCursorStateMod[ tkey ]["pressed"] == true ) {
		setTimeout( function() { startSend( tkey ); } , 40 );
	}
}

var keycount = 0;
var elevent;
function RegisterKeyboardControl() {

	if (config.log.full) console.log("RegisterKeyboardControl");

	document.onkeydown = function(evt) {

		evt = evt || window.event;
		
		elevent = evt;
		if (evt.target) if (classActivated(evt.target,"param_input")) return;
				
		if (evt.ctrlKey && evt.keyCode == 90) {
		
			alert("Ctr+Z");
			
		} else {
		
			if (config.log.full) console.log(evt.charCode);			
			
			if ( 37<=evt.keyCode && evt.keyCode<=40 ) {
				
				if ( keycount==0 ) {
				
				
					if (config.log.full) console.log("Key down arrow");
					if (evt.keyCode==37) mkey  = "LEFT";
					if (evt.keyCode==38) mkey  = "UP";
					if (evt.keyCode==39) mkey  = "RIGHT";
					if (evt.keyCode==40) mkey  = "DOWN";
					if (mkey) {
						Control.mapCursorStateMod[mkey]["pressed"] = true;
						Control.mapCursorStateMod[mkey]["command"] = { 'msg': '/moldeo',
																	'val0': 'effectsetstate', 
																	 'val1': Control.ObjectSelected, 
																	 'val2': Control.mapCursorStateMod[mkey]["member"], 
																	 'val3': Control.mapCursorStateMod[mkey]["value"] };
									 
						startSend( 	mkey );
						keycount+= 1;
					}
				
				}
			}
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
		elevent = evt;
		
		if (evt.target) if (classActivated(evt.target,"param_input")) return;
		
		key = String.fromCharCode(evt.keyCode);
		if (config.log.full) console.log("Simulate a click please! key: ", key);
		keyU = key.toUpperCase();
		
		//mapped keys trigger click in buttons (button_W,button_S,etc...)
		if (moCI.mapSelectionsObjects[keyU]) {
			document.getElementById("button_"+keyU ).click();
		}
		if (key=="1" || key=="2" || key=="3") {
			document.getElementById("button_"+keyU ).click();
		}


		if (evt.keyIdentifier=="F1" || evt.keyIdentifier=="F2" || evt.keyIdentifier=="F3") {
			document.getElementById("button_"+evt.keyIdentifier ).click();
		}
		
		
		var mkey = undefined;
		if (evt.keyCode==37) mkey  = "LEFT";
		if (evt.keyCode==38) mkey  = "UP";
		if (evt.keyCode==39) mkey  = "RIGHT";
		if (evt.keyCode==40) mkey  = "DOWN";
		
		if (mkey) {
			if (config.log.full) console.log("Keyup arrow! mkey: ", key);				
			keycount = 0;				
			Control.mapCursorStateMod[mkey]["pressed"] = false;
		}
		
		if (!evt.shiftKey) {
			deactivateClass( document.getElementById("button_SHIFT"), "shiftEnabled" );
		}
		if (!evt.ctrlKey) {
			deactivateClass( document.getElementById("button_CTRL"), "ctrlEnabled" );
		}
	};

}



/****************************** EDITOR BUTTONS ************************************************




EDITOR BUTTONS 





****************************** EDITOR BUTTONS ************************************************/

var ctx;
var elcanvas;
var lastevent;
var mdown = false;

function ExecuteCanvasPositionInspector(event) {

	if (config.log.full) console.log("ExecuteCanvasPositionInspector > ");
	//check position and draw cross for object position...
	lastevent = event;
	if (event.type=="mousedown") mdown = true;
	if (event.type=="mouseup") mdown = false;
	if (event.type="mousemove" && !mdown) return;
	
	elcanvas = event.target;
	ctx = elcanvas.getContext('2d');
	
	var x;
	var y;
	var fx = 1;
	var fy = 1;
	var rect = elcanvas.getBoundingClientRect();
	
	x = (event.clientX - rect.left)*fx;
	y = (event.clientY - rect.top) *fy;

	elcanvas.width = rect.width;
	elcanvas.height = rect.height;
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#FFFFFF';
		
	ctx.beginPath();
    ctx.moveTo(x-4,y);
    ctx.lineTo(x+4,y);
    ctx.stroke();

	ctx.beginPath();
    ctx.moveTo(x,y-4);
    ctx.lineTo(x,y+4);
    ctx.stroke();
	
	var Inspector = GetSliderInspector( event.target );
	if (Inspector==undefined) {
		console.error("ExecuteCanvasPositionInspector > parent Inspector not found for target:", event.target );
		return;
	}
	
	var group = Inspector.getAttribute("group");
	var moblabel = Inspector.getAttribute("moblabel");
	var preconfig = Inspector.getAttribute("preconfig");
	
	var selector = event.target.parentNode.getAttribute("selector");

	SetInspectorMode( group , selector );
	
	if (selector=="translatexy") {
		ExecuteStandardSlider( "POSITION", moblabel, "translatex", preconfig, (x-elcanvas.width*0.5)/(0.5*elcanvas.width) );
		ExecuteStandardSlider( "POSITION", moblabel, "translatey", preconfig, -(y-elcanvas.height*0.5)/(0.5*elcanvas.height) );		
	} else if (selector=="translatezy") {
		ExecuteStandardSlider( "POSITION", moblabel, "translatez", preconfig, (x-elcanvas.width*0.5)/(0.5*elcanvas.width) );
		ExecuteStandardSlider( "POSITION", moblabel, "translatey", preconfig, -(y-elcanvas.height*0.5)/(0.5*elcanvas.height) );		
	}
}

function RegisterInspectorButtons() {

/*INSPECTORS*/

	try {
		if (config.log.full) console.log("RegisterInspectorButtons");
		
		
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
				if (selector && Editor.CustomSelectors[groupName] ) {
					if (Editor.CustomSelectors[groupName][paramName]==undefined) {
						selector.addEventListener("click", ActivateInspectorSelector );
					}
				}
			}
			
			if (document.getElementById(groupName+"_slide"))
				document.getElementById(groupName+"_slide").addEventListener("change", ExecuteSliderInspector );
		}		
		
		/*POSITIONS*/
		/*
		//change position X Y
		for(var paramName in Editor.CustomSelectors["POSITION"]) {
			var selector = document.getElementById("selector_POSITION_"+paramName );
			if (selector) {
				var events = Editor.CustomSelectors["POSITION"][paramName]["events"];
				if (events)
					for( var eventname in events) {
						selector.addEventListener( eventname, events[eventname] );
					}
			}
		}
		
		for(var paramName in Editor.CustomInspectors["POSITION"]) {
			var selector = document.getElementById("selector_POSITION_"+paramName );
			if (selector && Editor.CustomSelectors["POSITION"][paramName]==undefined) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}
		document.getElementById("POSITION_slide").addEventListener("change", ExecuteSliderInspector );
		*/
		/*SCALE*/
		/*
		for(var selectorName in Editor.CustomInspectors["SCALE"]) {
			var selector = document.getElementById("selector_SCALE_"+selectorName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}		
		document.getElementById("SCALE_slide").addEventListener("change", ExecuteSliderInspector );
		*/
		/*SCALEPARTICLE*/
		/*
		for(var selectorName in Editor.CustomInspectors["SCALEPARTICLE"]) {
			var selector = document.getElementById("selector_SCALEPARTICLE_"+selectorName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}		
		document.getElementById("SCALEPARTICLE_slide").addEventListener("change", ExecuteSliderInspector );
		*/
		/*MOTION*/
		/*
		for(var selectorName in Editor.CustomInspectors["MOTION"]) {
			var selector = document.getElementById("selector_MOTION_"+selectorName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}
		document.getElementById("MOTION_slide").addEventListener("change", ExecuteSliderInspector );
		*/
		/*
		for(var paramName in Editor.CustomInspectors["EMITTER"]) {
			var selector = document.getElementById("selector_EMITTER_"+paramName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}
		document.getElementById("EMITTER_slide").addEventListener("change", ExecuteSliderInspector );
		
		for(var paramName in Editor.CustomInspectors["ATTRACTOR"]) {
			var selector = document.getElementById("selector_ATTRACTOR_"+paramName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}
		document.getElementById("ATTRACTOR_slide").addEventListener("change", ExecuteSliderInspector );
		
		for(var paramName in Editor.CustomInspectors["BEHAVIOUR"]) {
			var selector = document.getElementById("selector_BEHAVIOUR_"+paramName );
			if (selector) {
				selector.addEventListener("click", ActivateInspectorSelector );
			}
		}
		document.getElementById("BEHAVIOUR_slide").addEventListener("change", ExecuteSliderInspector );
		*/
	} catch(err) {
		console.error( "RegisterInspectorButtons > ", err);
		alert(err);
	}
}

function RegisterEditorColorButtons() {
		/*OBJECT COLOR*/
		if (config.log.full) console.log("RegisterEditorColorButtons");
		
		canvaspalette = document.getElementById("object_color_palette");
		ctxpalette = canvaspalette.getContext("2d");
		
		paletteImg = new Image();
		paletteImg.src = "buttons/color_palette_bn.png";
		
		paletteImg.onload = function() {			
			ctxpalette.drawImage(	paletteImg, 
								0,
								0, 
								canvaspalette.width,
								canvaspalette.height);
		};
		
		//canvaspalette.addEventListener("click", Editor.Buttons["object_color_palette"]["click"]);
}

function RegisterEditorLabelObject() {
	if (config.log.full) console.log("RegisterEditorLabelObject");
	document.getElementById('object_label_text').innerHTML = Editor.ObjectSelected;
}

function RegisterAllButtonActions() {
	
	if (config.log.full) console.log("RegisterAllButtonActions");
	
	Control.Register();
	Connectors.Register();
	
	
	/*EDITORS*/
	if (editor_active) {
		
		activateEditor();
		
		Editor.Register();

	}

}






function UnselectSelectorPositions( parent ) {
	var buttonsPos = parent.getElementsByTagName("button");
	for( var i=0; i<buttonsPos.length; i++) {
		var targbutton = buttonsPos[i];
		deactivateClass( targbutton, "selected");
	}
	
}

function UpdateControl( MOB_label ) {

	var moldeo_message_info = Editor.States[MOB_label];

	if (moldeo_message_info) {
		var alphav = moldeo_message_info["alpha"]*100;
		
		if (config.log.full) console.log("alpha:",alphav);
		
		var sH = document.getElementById("slide_HORIZONTAL_channel_alpha");
		if (sH) {
			sH.disabled = false;
			sH.setAttribute("moblabel", MOB_label);
			sH.updateValue( alphav, sH );
		}
		
		var sV  = document.getElementById("slide_VERTICAL_channel_tempo");
		
		if (sV) {
			sV.disabled = false;
			sV.setAttribute("moblabel", MOB_label);
			sV.updateValue( moldeo_message_info["tempo"]["delta"]*50, sV );
		}
	}
}

function valueMemorize( moblabel, param, preconf, value ) {
	try {
		Editor.Parameters[moblabel][param]["paramvalues"][preconf] = value;
	} catch(err) {
		console.error(err);
	}
}

function valuegetResponse( moblabel, param, preconf, value ) {
	if (config.log.full) console.log("valuegetResponse > mob: ",moblabel," param:",param," preconf:",preconf," value:",value);
	
	//search all inspectors??? maybe it's better to just subscribe inspectors as active!!!
	UpdateValue( moblabel, param, preconf, value );
	
	//SELECT the InspectorTab!! and click it
	if (Editor.InspectorTabSelected[moblabel]) {
	
		if (Editor.InspectorTabSelected[moblabel][preconf]) {
		
			InspectorTab = Editor.InspectorTabSelected[moblabel][preconf];
			if (config.log.full) console.log("valuegetResponse > Editor.InspectorTab: ", InspectorTab );
			var labelelem = InspectorTab.getElementsByTagName("label");
			if (labelelem) if (labelelem[0]) labelelem[0].click();
			
		}
	
	}
	
}

function UpdateValue( moblabel, param, preconf, value ) {
	//Memorize Value!!!
	valueMemorize( moblabel, param, preconf, value );
	
	//REACTIVATE ACTIVE INSPECTOR SO VALUES ARE UPDATED
	if (param=="texture") {
		if (value[0] && value[0]["value"])
			UpdateImage( moblabel, param, preconf, value[0]["value"] );
		//ImportMovie( moblabel, param, preconf, value );
	}
	if (param=="movies") {
		if (value[0] && value[0]["value"])
			UpdateMovie( moblabel, param, preconf, value[0]["value"] );
		//ImportMovie( moblabel, param, preconf, value );
	}
	if (param=="sound") {
		if (value[0] && value[0]["value"])
			UpdateSound( moblabel, param, preconf, value[0]["value"] );
	}
	if (param=="color") {
		if (value[0] && value[0]["value"])
			UpdateColor( moblabel, param, preconf, value[0]["value"] );
	}
}

function UpdateEditor( MOB_label, fullobjectInfo ) {

	if (moCI.Project.datapath==undefined) {
		console.error("ERROR > no console INFO, trying to get it...");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget', 'val1': '' } );
		Editor.ObjectRequested = MOB_label;
		return;
	}
	
	selectEditorEffectByLabel( MOB_label );							
	RegisterEditorLabelObject();
				
	Editor.PreconfigSelected = fullobjectInfo["object"]["objectconfig"]["currentpreconfig"];
	
	Editor.Objects[MOB_label] = fullobjectInfo;
	Editor.States[MOB_label] = fullobjectInfo["effectstate"];
	Editor.Parameters[MOB_label] = fullobjectInfo["object"]["objectconfig"]["parameters"];
	Editor.Preconfigs[MOB_label] = fullobjectInfo["object"]["objectconfig"]["preconfigs"];
	
	// Parameters:
	// console.log("target: "+ target+ " parameters:" + JSON.stringify( Editor.Parameters[target], "", "\t") );
	
	// Preconfigs
	// console.log("target: "+ target+ " preconfigs:" + JSON.stringify( Editor.Preconfigs[target], "", "\t") );
	
	// activamos o desactivamos el boton de Object_Enable
	if (config.log.full) console.log("UpdateEditor > UpdateState > label: ",MOB_label);
	UpdateState( MOB_label );
	
	if (config.log.full) console.log("UpdateEditor > UpdatePreconfigs > label: ",MOB_label);
	UpdatePreconfigs( MOB_label );

	if (config.log.full) console.log("UpdateEditor > UpdateState > label: ",MOB_label);
	UpdateScene( MOB_label );
	
	if (config.log.full) console.log("UpdateEditor > deactivate parameters_side_*");
	for( var ObjectLabel in Editor.Objects ) {
		var psideWin = document.getElementById("parameters_side_" + ObjectLabel );
		if (psideWin) deactivateClass( psideWin, "parameters_side_MOB_selected");
	}
	
	if (config.log.full) console.log("UpdateEditor > activate parameters_side_",MOB_label);
	var psideWin = document.getElementById("parameters_side_" + MOB_label );
	if (psideWin) activateClass( psideWin, "parameters_side_MOB_selected");
	
}

function UpdateEditorParam( MOB_label, fullparaminfo ) {
	//recorre el Editor > Parameters
	if (config.log.full) console.log("UpdateEditorParam > MOB_label: ", MOB_label, " fullparaminfo:",fullparaminfo);
	var Param = Editor.Parameters[MOB_label];
	
	var paramName = fullparaminfo["name"];
	ParamDef = Param[ paramName ]["paramdefinition"];
	ParamDef = fullparaminfo;
	var ParamProperty = ParamDef["property"];
	
	//buscar todos los parametros: (usando el id)
	var parameter_name_base = "parameter_group_"+MOB_label+"_"+paramName;
	for(var preconfigi=0; preconfigi<Options["MAX_N_PRECONFIGS"]; preconfigi++) {
		var paramid = parameter_name_base+"_"+preconfigi;
		var elem = document.getElementById(paramid);
		if (elem) {
			elem.setAttribute("class", "parameter_group parameter_is_"+ParamProperty);
		}
	}
}

function UpdateState( MOB_label ) {

	if (config.log.full) console.log("UpdateState(",MOB_label,")");
	
	var objectState = Editor.States[MOB_label];
	var btn_OnOff = document.getElementById("button_object_onoff");
	
	if (btn_OnOff) {
	
		btn_OnOff.setAttribute("moblabel", MOB_label );
	
		if (config.log.full) console.log("MOB_label: ",MOB_label," objectState:",objectState );
		
		if ( objectState["Activated"]==1 ) {
		
			if (config.log.full) console.log("UpdateState > btn_OnOff Activated");
			activateClass( btn_OnOff, "button_object_onoff_on");
			
		} else {
		
			if (config.log.full) console.log("UpdateState > btn_OnOff Deactivated");
			deactivateClass( btn_OnOff, "button_object_onoff_on");
			
		}
		
		btn_OnOff.setAttribute("moblabel", MOB_label );
	}
}


function UpdateSceneStateInfo( MOB_label, NewIndex ) {

	if (config.log.full) console.log("UpdateSceneStateInfo > ", MOB_label );

	var dNumber = document.getElementById("scene_state_number");
	var dText = document.getElementById("sequence_state_indicator_input");
	var dNextText = document.getElementById("sequence_state_indicator_input_next");

// scene_state_number
	if (NewIndex!=undefined)
		Editor.PreconfigsSelected[ MOB_label ] = NewIndex;
	else
		NewIndex = Editor.PreconfigsSelected[ MOB_label ];
	
	NextIndex = NewIndex + 1;
	//TODO: esto debe actualizarse por un feedback del moldeoplayer (effectgetstate)
	var ValueP = Editor.Parameters[MOB_label]["scene_states"]["paramvalues"][NewIndex];
	
	if (dText && ValueP) {
		dText.value = ValueP[0].value;
		dText.setAttribute("title", dText.value );
		
		ValueNext = Editor.Parameters[MOB_label]["scene_states"]["paramvalues"][NextIndex];
		
		if (ValueNext) {
			dNextText.value = ValueNext[0].value;
			dNextText.setAttribute("title", dNextText.value );
		} else {
			dNextText.value = "---";
			dNextText.setAttribute("title", dNextText.value );
		}
	}

	if (dNumber)
		dNumber.innerHTML = NewIndex;

}

function UpdateSceneSliders( MOB_label ) {

	var moldeo_message_info = Editor.States[MOB_label];
	
	if (moldeo_message_info) {
		var alphav = moldeo_message_info["alpha"]*100;
		if (config.log.full) console.log("alpha:",alphav);
		
		var sH = document.getElementById("scene_slide_VERTICAL_channel_alpha");
		if (sH) {
			sH.disabled = false;
			sH.setAttribute("moblabel", MOB_label);
			sH.updateValue( alphav, sH );
		} else console.error("UpdateSceneSliders > no scene_slide_VERTICAL_channel_alpha");
		
		var sV  = document.getElementById("scene_slide_VERTICAL_channel_tempo");
		
		if (sV) {
			sV.disabled = false;
			sV.setAttribute("moblabel", MOB_label);
			sV.updateValue( moldeo_message_info["tempo"]["delta"]*50, sV );
		} else console.error("UpdateSceneSliders > no scene_slide_VERTICAL_channel_tempo");
	}
}

function UpdateScene( MOB_label ) {
	
	var Object = Editor.Objects[MOB_label];
	if (Object) {
		ObjectName = Object["object"]["objectdefinition"]["name"];
		if (ObjectName=="scene") {
			var SceneParams = Editor.Parameters[MOB_label];
			if (SceneParams) {
				Scenes.ScenePreEffects[MOB_label] = SceneParams["preeffect"];
				Scenes.SceneEffects[MOB_label] = SceneParams["effect"];
				Scenes.ScenePostEffects[MOB_label] = SceneParams["posteffect"];
				Scenes.SceneStates[MOB_label] = SceneParams["scene_states"];
				
				if (config.log.full) console.log( "UpdateScene(",MOB_label," ok.");
				
				UpdateSceneStateInfo( MOB_label );	
				UpdateSceneSliders( MOB_label );
				
				SelectScene( MOB_label );
			}
		}
	}
	
}

function SelectScene( MOB_label ) {
	Scenes.ObjectSelected = MOB_label;
}

var param_groups;

function selectEditorParameter( preconfig_index ) {

	try {
		if (config.log.full) console.log("SelectEditorParameter > reselect or select a parameter group");	
			
		//perform click() on parameter group...
		var parameters_side_winID = "parameters_side_"+Editor.ObjectSelected+"_";
		var win_parameters_Preconfig = document.getElementById( parameters_side_winID+preconfig_index );	
		if (!win_parameters_Preconfig) return console.error("SelectEditorParameter > no " + parameters_side_winID);
		
		var group_selected = win_parameters_Preconfig.getElementsByClassName("group_selected");
		
		if (config.log.full) console.log("SelectEditorParameter > group_selected: ", group_selected );
		
		if (group_selected)
			if (config.log.full) console.log("SelectEditorParameter > group_selected.length: ", group_selected.length );
		
		if ( group_selected && group_selected.length>0 ) {
			
			if (config.log.full) console.log("SelectEditorParameter > Parameter group already selected: ",group_selected[0] );
			
			var item_group_selected = group_selected[0];
			
			var item_group_label = item_group_selected.getElementsByTagName("label");
			
			if (item_group_label && item_group_label.length>0) {
				
				var item_group_label_selected = item_group_label[0];
				if (config.log.full) console.log("SelectEditorParameter > item_group_label_selected.click() ");
				item_group_label_selected.click();
				return;
			}
			
		} else {
		
			if (config.log.full) console.log("SelectEditorParameter > NO SELECTION!, inducing click and selection on first parameter (published) group for: ", Editor.ObjectSelected );
			
			param_groups = win_parameters_Preconfig.getElementsByClassName("parameter_group");
			
			for( var i=0; i<param_groups.length; i++) {
				var item_group = param_groups[i];
				if ( item_group.getAttribute("group")!=undefined
					|| classActivated( item_group, "parameter_is_published") ) {
					if (config.log.full) console.log("SelectEditorParameter > found: " );
					var item_group_label = item_group.getElementsByTagName("label");
					if (item_group_label.length>0) {	
						var item_group_label_selected = item_group_label[0];				
						item_group_label_selected.click();
						return;					
					}
				}
			}
			
		}
	} catch(err) {
		console.error("selectEditorParameter > ",err);
		alert("selectEditorParameter > " + err );
	}
}

function unselectEditorObjects( preconfig_index ) {

	if (config.log.full) console.log("unselectEditorObjects > ", preconfig_index);
	var object_edition = document.getElementById("object_edition");
	if (object_edition) activateClass( object_edition, "object_edition_collapsed");
	
	var audio_edition = document.getElementById("audio_edition");
	if (audio_edition) activateClass( audio_edition, "object_edition_collapsed");
	
	var video_edition = document.getElementById("video_edition");
	if (video_edition) activateClass( video_edition, "object_edition_collapsed");

}

function selectEditorMovie( preconfig_index ) {
	
	var video_edition = document.getElementById("video_edition");
	if (video_edition==undefined) return;
	
	if (video_edition) video_edition.setAttribute("moblabel", Editor.ObjectSelected );
	if (video_edition) video_edition.setAttribute("preconfig", Editor.PreconfigSelected );
	
	if (config.log.full) console.log("selectEditorMovie(",preconfig_index,")");

	
	
	var ObjectMovies = Editor.Movies[ Editor.ObjectSelected ];
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;
	

	for( var paramName in ObjectMovies) {
		var preconfidx = "preconf_"+preconfig_index;
		var filesrc = ObjectMovies[paramName][preconfidx]["src"];
		unselectEditorObjects(preconfig_index);
		deactivateClass( video_edition, "object_edition_collapsed");
		//var PreconfSound = ObjectSounds[paramName]["preconf_"+preconfig_index];
		if (video_edition) video_edition.setAttribute("paramname", paramName );
		if (video_edition) video_edition.setAttribute("title", filesrc );
		
	}
}

function selectEditorSound( preconfig_index ) {


	var audio_edition = document.getElementById("audio_edition");
	if (audio_edition==undefined) return;
	
	if (audio_edition) audio_edition.setAttribute("moblabel", Editor.ObjectSelected );
	if (audio_edition) audio_edition.setAttribute("preconfig", Editor.PreconfigSelected );
	
	if (config.log.full) console.log("selectEditorSound(",preconfig_index,")");

	
	
	var ObjectSounds = Editor.Sounds[ Editor.ObjectSelected ];
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;
	

	for( var paramName in ObjectSounds) {
		var preconfidx = "preconf_"+preconfig_index;
		var filesrc = ObjectSounds[paramName][preconfidx]["src"];
		unselectEditorObjects(preconfig_index);
		deactivateClass( audio_edition, "object_edition_collapsed");
		//var PreconfSound = ObjectSounds[paramName]["preconf_"+preconfig_index];
		if (audio_edition) audio_edition.setAttribute("paramname", paramName );
		if (audio_edition) audio_edition.setAttribute("title", filesrc );
		
	}
	
	
}
	
function drawParamImage( moblabel, param_name, preconfig ) {
	try {
		var EI = Editor.Images[ moblabel ];
		var IMGOBJECTS = EI[param_name];		
		var IMGOBJECT = IMGOBJECTS["preconf_"+preconfig];
				
		var object_edition = document.getElementById("object_edition");						
		var object_edition_image = document.getElementById("object_edition_image");
		
		var canvas_image_context = object_edition_image.getContext("2d");
		canvas_image_context.clearRect( 0,0, object_edition_image.width, object_edition_image.height);

		if (IMGOBJECT && IMGOBJECT.img) {
			object_edition.setAttribute("title", IMGOBJECT.img.filesrc );
			if (IMGOBJECT.img.width>0 && IMGOBJECT.img.height>0) {
				canvas_image_context.drawImage( IMGOBJECT.img, 0,0, object_edition_image.width, object_edition_image.height );
			}
		} else {
			if (config.log.full) console.log("selectEditorImage > no images in [",moblabel,"]");
		}
	}catch(err) {
		console.error("drawParamImage > ",err );
	}
}


function fetchValue( moblabel, param_name, preconfig ) {
	try {
		var EP = Editor.Parameters;	
		if ( EP[ moblabel ]==undefined ) { console.error("fetchValue > no parameters for "+moblabel ); return false; }
		
		var EPO = EP[ moblabel ];
		if (EPO[param_name]==undefined)  { console.error("fetchValue > no parameter "+moblabel+"."+param_name ); return false; }
		
		var ParamValues = EPO[param_name].paramvalues;
		
		if ( ParamValues[ preconfig ] == undefined ) {
			console.error("fetchValue > no values for "+preconfig+" - trying to add default value" );
			moCI.AddValue( moblabel, param_name, preconfig );
			return false;
		}
		return ParamValues[ preconfig ];
	} catch(err) {
		console.error("fetchValue > ",err);		
	}
	return false;
}

function ValueToSrc( value ) {
	if (value=="default") {
		return config.data_path+"/icons/moldeologo.png";
	}
	return moCI.Project.datapath + value;
	
}

function fetchImageRemote( moblabel, param_name, preconfig ) {
	var ParamValue = fetchValue( moblabel, param_name, preconfig );
	if (ParamValue==false)  { console.error("fetchImage > no values for "+preconfig ); return false; }
	//send moldeo signal: for fetching image/thumbnail !!!
	//same if we want to save remote image: we must transfer it... using mime???
	return false;
}

function onloadImage(event) {
	var m = event.target.moblabel;
	var p = event.target.param_name;
	var i = event.target.preconfig;
	if (i==Editor.PreconfigSelected)
		selectEditorImage( m, p, i );
};

function fetchImage( moblabel, param_name, preconfig, remote ) {
	try {
		if (remote) return fetchImageRemote( moblabel, param_name, preconfig );
		
		var ParamValue = fetchValue( moblabel, param_name, preconfig );
		if (ParamValue==false)  {
			console.error("fetchImage > no values for "+preconfig ); 
			return false; 
		}
		
		var EI = Editor.Images; if (EI[ moblabel ]==undefined) EI[ moblabel ] = {};
		var OEI = EI[ moblabel ]; if (OEI[ param_name ]==undefined) OEI[ param_name ] = {};
		var OEIP = OEI[ param_name ];
		var preconfidx = "preconf_"+preconfig;
		var IMGOBJECT = OEIP[preconfidx]; 
		if (IMGOBJECT==undefined) { OEIP[preconfidx] = {}; IMGOBJECT = OEIP[ preconfidx ]; }
		
		if (IMGOBJECT) {
			IMGOBJECT["src"] = ParamValue[0]["value"];		
			if (IMGOBJECT["img"]==undefined) {
				IMGOBJECT["img"] = new Image();
			}
			IMGOBJECT["img"].moblabel = moblabel;
			IMGOBJECT["img"].param_name = param_name;
			IMGOBJECT["img"].preconfig = preconfig;
			IMGOBJECT["img"].remote = remote;			
			IMGOBJECT["img"].onload = onloadImage;				
			//using real-path for this image, if we are in local-control
			var newsrc = ValueToSrc( ParamValue[0]["value"] );
			if (IMGOBJECT["img"].filesrc!=newsrc) {
			
				IMGOBJECT["filesrc"] = newsrc;
				IMGOBJECT["img"].filesrc = newsrc;
				IMGOBJECT["img"].src = newsrc;
				
			}			
			return true;
		}
	} catch(err) {
		console.error("fetchImage > ",err);	
	}
	return false;
}

/**
*	
*/
function selectEditorImage( moblabel, param_name, preconfig ) {
	try {
		if (config.log.full) console.log("selectEditorImage(",moblabel,param_name,preconfig,")");

		var object_edition = document.getElementById("object_edition");
		
		if (fetchImage( moblabel, param_name, preconfig )) {

			object_edition.setAttribute("moblabel", moblabel );
			object_edition.setAttribute("paramname", param_name );
			object_edition.setAttribute("preconfig", preconfig );

			unselectEditorObjects(preconfig);
			deactivateClass( object_edition, "object_edition_collapsed");
		
			drawParamImage( moblabel, param_name, preconfig );
		}
	} catch(err) {
		console.error("selectEditorImage > ",err);
	}
	/*
	for( var paramName in EI) {
		if (config.log.full) console.log("selectEditorImage > Editor.Images[",Editor.ObjectSelected,"][",paramName,"] > ", EI[paramName], " preconf: ","preconf_",preconfig);
		
		var PreconfImage = EI[paramName]["preconf_"+preconfig];
		var filesrc = "";
		if (PreconfImage) {
			filesrc = PreconfImage["src"];
		} else {
			console.error("selectEditorImage > no preconf for: " + preconfig );
		}
		if (	paramName=="texture" //in general
				|| paramName=="images" //just for SECUENCIA -> FLOW
				) {
			object_edition.setAttribute("paramname", paramName );
			object_edition.setAttribute("title", filesrc );
		}		
		
		unselectEditorObjects(preconfig);
		deactivateClass( object_edition, "object_edition_collapsed");	
			
		if (config.log.full) console.log("selectEditorPreconfig > paramName: ",paramName," EI: ", filesrc);
		
		var IMGOBJECT = EI[paramName]["preconf_"+preconfig];
				
		if (IMGOBJECT && IMGOBJECT.img) {
			if (config.log.full) console.log("object_edition_image.width:",object_edition_image.width," object_edition_image:",object_edition_image.height );
			if (config.log.full) console.log("IMGOBJECT.width:",IMGOBJECT.img.width," IMGOBJECT:",IMGOBJECT.img.height );
		
			if (IMGOBJECT.img.width>0 && IMGOBJECT.img.height>0) {
				canvas_image_context.drawImage( IMGOBJECT.img, 0,0, object_edition_image.width, object_edition_image.height );
			}
		} else {
			if (config.log.full) console.log("selectEditorImage > no images in [",Editor.ObjectSelected,"]");
		}
	}
	*/
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function selectEditorColor( preconfig_index ) {
	/*
	var object_edition = document.getElementById("object_edition");
	object_edition.setAttribute("moblabel", Editor.ObjectSelected );
	object_edition.setAttribute("preconfig", Editor.PreconfigSelected );
	*/
	var object_color_sel = document.getElementById("object_color_sel");
	
	if (config.log.full) console.log("selectEditorColor(",preconfig_index,")");
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;
	
	var Color = Editor.Parameters[Editor.ObjectSelected]["color"]["paramvalues"][preconfig_index];
	//create hexa color:
	if (Color && Color.length>3) {
		var red = Math.floor( Color[0]["value"]*255 );
		var green = Math.floor( Color[1]["value"]*255 );
		var blue = Math.floor( Color[2]["value"]*255 );
		if (config.log.full) console.log("rgbToHex( ",red,", ",green,",", blue," ):",rgbToHex( red, green, blue ));
		object_color_sel.setAttribute( "style" , "background-color:"+ rgbToHex( red, green, blue )+";");
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

function ActivateInspectorSelector( event ) {

	try {
		var Inspector = GetInspector(event.target);
		
		if (Inspector==undefined) {
			console.error("ActivateInspectorSelector > Inspector parent not found",event);
			return;
		}
		
		var InspectorSelector = event.target;
		
		UnselectSelectorPositions(Inspector);
		
		activateClass( InspectorSelector, "selected");
		
		var selector = InspectorSelector.getAttribute("selector");
		var group = Inspector.getAttribute("group");
		var moblabel = Inspector.getAttribute("moblabel");
		var preconfig = Inspector.getAttribute("preconfig");
		
		//register selected GROUP for this (moblabel, preconfig)
		if (Editor.InspectorGroup[ moblabel ]==undefined)
			Editor.InspectorGroup[ moblabel ] = {};
		Editor.InspectorGroup[ moblabel ][ preconfig ] = group;
		
		//register selected group SELECTOR for this (moblabel, group, preconfig)
		if (Editor.InspectorSelectorSelected[ moblabel ] == undefined )
			Editor.InspectorSelectorSelected[ moblabel ] = {};		
		Editor.InspectorSelectorSelected[ moblabel ][ group ] = {};
		Editor.InspectorSelectorSelected[ moblabel ][ group ][ preconfig ] = selector;
		
		if (group==undefined) {
			console.error("ActivateInspectorSelector > Inspector group not defined!",Inspector);
			return;
		}
		SetInspectorMode( group, selector );
	} catch(err) {
		console.error("ActivateInspectorSelector > ", err, event);
		alert("ActivateInspectorSelector > "+err);
	}
}

function ActivateInspector( event ) {

	try {
		var InspectorTab = event.target.parentNode;
		var inspectorName = InspectorTab.getAttribute("inspector");
		if (config.log.full) console.log("ActivateInspector > clicked parameter > show inspector:",inspectorName);
		var Inspector = document.getElementById(inspectorName);
		
		ParametersUnselectAll();
		InspectorHideAll();
		
		var mobLabel = InspectorTab.getAttribute("moblabel");
		if (Inspector) {
			activateClass( Inspector, "inspector_show");
			activateClass( InspectorTab, "group_selected" );

			Inspector.setAttribute("moblabel", mobLabel );
			Inspector.setAttribute("preconfig", Editor.PreconfigSelected );
			
			if (Editor.InspectorTabSelected[mobLabel]==undefined)
				Editor.InspectorTabSelected[mobLabel] = {};
			Editor.InspectorTabSelected[mobLabel][Editor.PreconfigSelected] = InspectorTab;
			
			if (Editor.InspectorSelected[mobLabel]==undefined)
				Editor.InspectorSelected[mobLabel] = {};
			Editor.InspectorSelected[mobLabel][Editor.PreconfigSelected] = Inspector;

			
			UpdateInspector( InspectorTab, Inspector, mobLabel, Editor.PreconfigSelected );
		} else {
			console.error("ActivateInspector > No inspector for tab : "  + inspectorName);
		}
	} catch(err) {
		console.error("ActivateInspector > ", err);
		alert("ActivateInspector > "+err);
	}
}


/**

CHECK IF A SPECIFIC PARAM_NAME "parameter" is REQUIRED FOR ANY CUSTOM_INSPECTORS

( so if it this, we return true, so the core notice this is a required parameter for a custom inspector (as EMITTER, POSITION, SCALE, etc...)
and it will not be rendered control for his own...!!!! )

Checking for every group dependencies of 
parameter defined in Editor.CustomInspectors 
and saving it in Editor.Inspectors:

Example:
Group "POSITION" has "selectors" "translatex","translatey","translatez" that needs paramaters "translatex", "translatey" and "translatez" 
to be published in the actual Moldeo Object Configuration .

Group "SCALE" has "scalex,scaley" selector that needs "scalex" and "scaley" parameters.

*/

function PrepareGroupParameters( MOB_label, param_name ) {

	if (config.log.full) console.log("PrepareGroupParameters > MOB_label:",MOB_label," param_name:",param_name );
	
	var ret = false;
	//iterate over: Editor.CustomInspectors
	if ( Editor.Inspectors[MOB_label]==undefined )
		Editor.Inspectors[MOB_label] = {};
		
	MobInspectors = Editor.Inspectors[MOB_label];
	
	for( var inspector_custom_name in Editor.CustomInspectors ) {
		
		var CustomInspector = Editor.CustomInspectors[ inspector_custom_name ];
		
		for( var inspector_selector_name in CustomInspector ) {
		
			if ( CustomInspector[inspector_selector_name][param_name]==true ) {
			
				if (config.log.full) console.log("PrepareGroupParameters() > ",param_name," OK! for inspector: ", inspector_custom_name, " in selector:", inspector_selector_name );
				
				//create Inspector if not created
				if (MobInspectors[inspector_custom_name]==undefined)
					MobInspectors[inspector_custom_name] = {};
					
				//MobInspectors[inspector_custom_name][param_name] = true;
				if (MobInspectors[inspector_custom_name][inspector_selector_name] == undefined )
					MobInspectors[inspector_custom_name][inspector_selector_name] = {};
				
				MobInspectors[inspector_custom_name][inspector_selector_name][param_name] = true;
				
				ret = true;
			}
		}
	}

	if (config.log.full) console.log("PrepareGroupParameters > ended ok: ret:",ret);
	
	return ret;
}

/**
*	CreateGroupInspector
*
*	Group inspectors are inspector that take more than one parameters that are somehow related and are
*	better handled together like POSITION for parameters "translatex", "translatey", "translatez"
*
*	Create the elements of the group inspector defined by "Group" name and for the Moldeo Object "MOB_label"
*	
*	@param MOB_label Moldeo Object unique label name
*	@param Group group name
*	@param preconfig Preconfig number index (0..N)
*	@param psideWinPre Parent window (usually the Preconfig side window)
*
*/
function CreateGroupedParameter( MOB_label, Group, preconfig, psideWinPre ) {
	var ret = false;
	try {
	
		if (psideWinPre==undefined)
			return ret;

		if (config.log.full) console.log("CreateGroupedParameter() > ",MOB_label,", ",Group,", ",preconfig);
	
		var ObjectInspector = Editor.Inspectors[MOB_label][Group];
		if (!ObjectInspector) { console.error("Editor.Inspectors["+MOB_label+"]["+Group+"] is not prepared. Check if PrepareGroupParameter() was called..."); return false; }
		if (!psideWinPre) { console.error("CreateGroupedParameter() > psideWinPre missing!"); return false; }
		
		if (ObjectInspector) {
			var ParamGroup = document.createElement("DIV");
			ParamGroup.setAttribute( "id", "parameter_group_"+MOB_label + "_"+ Group+"_"+preconfig);
			ParamGroup.setAttribute( "moblabel", MOB_label );
			ParamGroup.setAttribute( "preconfig", preconfig );
			ParamGroup.setAttribute( "inspector", "parameter_inspector_"+Group );
			ParamGroup.setAttribute( "group", Group );
			//ParamGroup.setAttribute( "params",  );
			ParamGroup.setAttribute( "class","parameter_group");
			
			var ParamGroupLabel = document.createElement("LABEL");
			ParamGroupLabel.innerHTML = TR(Group);
			//ParamDivLabel.setAttribute("id",);
			ParamGroup.appendChild(ParamGroupLabel);
			
			//FOR EACH CLICK INSPECTOR IS UPDATED...
			ParamGroupLabel.addEventListener( "click", ActivateInspector );
			
			if (psideWinPre) psideWinPre.appendChild(ParamGroup);
			ret = true;
		}
	} catch(err) {
		console.error("CreateGroupedParameter > ", err);
		alert( "CreateGroupedParameter > " + err);
	}
	return ret;
}

function CreateGroupedParameters( MOB_label, preconfig, psideWinPre ) {
	var ret = false;
	try {
	
		if (psideWinPre==undefined)
			return ret;
		if (config.log.full) console.log("CreateGroupedParameters() > ",MOB_label);
		for( var Group in Editor.Inspectors[MOB_label] ) {
			CreateGroupedParameter( MOB_label, Group, preconfig, psideWinPre );
		}
		ret = true;
	} catch(err) {
		console.error("CreateGroupedParameters > " , err );
		alert( "CreateGroupedParameters > " + err );
	}
	return ret;
}

function ToggleParameterProperty( event ) {
	var pNode = event.target.parentNode;
	var mob_label = pNode.getAttribute("moblabel");
	var param = pNode.getAttribute("param");
	if (config.log.full) console.log("ToggleParameterProperty > moblabel: ",mob_label," param:",param," toggle:",event.target.checked);
	if (event.target.checked) {
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'paramset', 'val1': mob_label, 'val2': param, 'val3': 'property','val4': 'published' } );
	} else {
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'paramset', 'val1': mob_label, 'val2': param, 'val3': 'property','val4': '' } );
	}

}

/**
*	Create Parameter List Item
*/
function CreateStandardParameter( MOB_label, param_name, preconfig, psideWinPre ) {
	
	var ret = false;
	try {
	
		if (psideWinPre==undefined)
			return ret;
			
		if (config.log.full) console.log("CreateStandardParameter() for ",MOB_label,", ",param_name,", pre:",preconfig);
		
		var Parameters = Editor.Parameters[MOB_label];
		
		if ( Parameters==undefined ) { 
			console.error("CreateStandardParameter > no parameters for label: " + MOB_label ); 
			return ret; 
		}

		var pgroup_object_base = "parameter_group_"+MOB_label;
		var Param = Parameters[ param_name ];
		
		if (Param==undefined) {
			console.error("CreateStandardParameter > no parameter: " +param_name + "in mob: " + MOB_label);
			return ret;
		}
		
		var ParamType = Param.paramdefinition["type"];
		var ParamProperty = Param.paramdefinition["property"];

		var ParamDiv = document.createElement("DIV");
		if (ParamDiv) {
			ParamDiv.setAttribute( "id", pgroup_object_base + "_"+ param_name+"_"+preconfig);
			ParamDiv.setAttribute( "moblabel", MOB_label );
			ParamDiv.setAttribute( "preconfig", preconfig );
			ParamDiv.setAttribute( "param", param_name );
			ParamDiv.setAttribute( "paramtype", ParamType );
			ParamDiv.setAttribute( "inspector", "parameter_inspector_"+ParamType );
			ParamDiv.setAttribute( "class","parameter_group parameter_is_"+ParamProperty);

			var ParamDivLabel = document.createElement("LABEL");
			var ParamDivButton = document.createElement("INPUT");
			if (ParamDivButton) {
				ParamDivButton.setAttribute("type","checkbox");
				if (ParamProperty=="published") ParamDivButton.setAttribute("checked","");
			}
			
			if (ParamDivLabel) {
			
				ParamDivLabel.innerHTML = param_name;
				//ParamDivLabel.setAttribute("id",);
				ParamDiv.appendChild( ParamDivLabel );
				ParamDiv.appendChild( ParamDivButton );
			
				ParamDivLabel.addEventListener( "click", ActivateInspector );
				ParamDivButton.addEventListener( "change", ToggleParameterProperty );
			}
			psideWinPre.appendChild(ParamDiv);
			ret = true;
		}
	} catch(err) {
		console.error("CreateStandardParameter > " , err );
		alert( "CreateStandardParameter > " + err );
	}
	return ret;
}

function CreateTextureParameter( MOB_label, param_name, preconfig ) {

	if (config.log.full) console.log("CreateTextureParameter  > ",MOB_label," param_name:",param_name," pre:",preconfig);
	fetchImage( MOB_label, param_name, preconfig );
	/*
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param.paramvalues;
	
	var EI = Editor.Images;
	if (EI[MOB_label]==undefined) EI[MOB_label] = {};
	
	var OEI = Editor.Images[MOB_label];
	
	if (OEI[param_name]==undefined) OEI[ param_name ] = {};
	
	var preconfidx = "preconf_"+preconfig;
	
	if (ParamValues[preconfig]) {	
		if (param_name!="movies") {
			
			if (OEI[ param_name ][ preconfidx ]==undefined) OEI[param_name][ preconfidx ] = {};
			OEI[ param_name ][ preconfidx ]["src"] = ParamValues[preconfig][0]["value"];
			OEI[ param_name ][ preconfidx ]["img"] = new Image();
			OEI[ param_name ][ preconfidx ]["img"].src = moCI.Project.datapath + ParamValues[preconfig][0]["value"];
			if ( preconfig==0 ) {
				if (OEI[ param_name ][ preconfidx ]["img"])
					OEI[ param_name ][ preconfidx ]["img"].onload = function() {
						selectEditorImage(0);
					};
			}
			
		}
		
	} else {
		//TODO: create value for this preconfig... and update all PRECONFIGS??
		console.error("CreateTextureParameter > no param values for ",param_name," MUST ADD! " );
		moCI.AddValue( MOB_label, param_name, preconfig );
	}
	*/
	
	

}

function CreateMovieParameter( MOB_label, param_name, preconfig, prewindow ) {

	if (config.log.full) console.log("CreateMovieParameter  > ",MOB_label," param_name:",param_name," pre:",preconfig);
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param.paramvalues;

	if (Editor.Movies[MOB_label]==undefined) Editor.Movies[MOB_label] = {};
	
	var ObjectMovies = Editor.Movies[MOB_label];
	
	if (ObjectMovies[param_name]==undefined) ObjectMovies[ param_name ] = {};
	
	var preconfidx = "preconf_"+preconfig;
	
	if (ParamValues[preconfig]) {	

		if ( param_name=="movies" ) {
			if (ObjectMovies[ param_name ][ preconfidx ]==undefined) ObjectMovies[param_name][ preconfidx ] = {};
			 ObjectMovies[param_name][ preconfidx ]["src"] = ParamValues[preconfig][0]["value"];
			selectEditorMovie(0);
		}
		
	} else {
		/** TODO: create value for this preconfig... and update all PRECONFIGS?? */
		console.error("CreateMovieParameter > no param values for " + param_name+" MUST ADD! " );
	}
	

}

function CreateSoundParameter( MOB_label, param_name, preconfig, psideWin ) {
	if (config.log.full) console.log("CreateSoundParameter > ",MOB_label," param_name:",param_name );
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param.paramvalues;

	if (Editor.Sounds[MOB_label]==undefined) Editor.Sounds[MOB_label] = {};
	var ObjectSounds = Editor.Sounds[MOB_label];
	if (!ObjectSounds[param_name]) ObjectSounds[param_name] = {};
	
	var preconfidx = "preconf_"+preconfig;
	
	if (ObjectSounds[param_name][preconfidx]==undefined) ObjectSounds[param_name][preconfidx] = {};
	
	if (ParamValues[preconfig]) {
		if (config.log.full) console.log("CreateSoundParameter > value: ", ParamValues[preconfig][0]["value"] );
		ObjectSounds[param_name][preconfidx]["src"] = ParamValues[preconfig][0]["value"];
		selectEditorSound(0);
	}
	else
		console.error("CreateSoundParameter > no paramvalues for "+MOB_label+" param_name: " + param_name+" preconfig:"+preconfig);
	
}

/**
*	CreateParametersPreconfigWindows
*	
*	Create a parameter preconfig window for each preconfig index (TODO: must check it exists ?? or creates itself ? )
*/
function CreateParametersPreconfigWindows( MOB_label, psideWin ) {
	
	if (config.log.full) console.log("CreateParametersPreconfigWindows > ", MOB_label, " psideWin:",psideWin);
	if (!psideWin) return console.error("CreateParametersPreconfigWindows > no psideWin");
	var ret = false;
	
	var psideWinPreScroller = document.createElement("DIV");
	psideWinPreScroller.setAttribute("id","parameters_side_"+MOB_label+"_scroller");
	psideWinPreScroller.setAttribute("class","parameters_side_MOB_scroller scroll-pane");
	
	
	//scrollbar
	var psideWinPreScrollbar = document.createElement("DIV");
	psideWinPreScrollbar.setAttribute("id","parameters_side_"+MOB_label+"_scrollbar");
	psideWinPreScrollbar.setAttribute("class","parameters_side_MOB_scrollbar scrollbar");
	psideWinPreScroller.appendChild( psideWinPreScrollbar );
		//track
	var psideWinPreScrolltrack = document.createElement("DIV");
	psideWinPreScrolltrack.setAttribute("id","parameters_side_"+MOB_label+"_scrolltrack");
	psideWinPreScrolltrack.setAttribute("class","parameters_side_MOB_scrolltrack track");
	psideWinPreScrollbar.appendChild( psideWinPreScrolltrack );
		//thumb
	var psideWinPreScrollthumb = document.createElement("DIV");
	psideWinPreScrollthumb.setAttribute("id","parameters_side_"+MOB_label+"_scrollthumb");
	psideWinPreScrollthumb.setAttribute("class","parameters_side_MOB_scrolltrack thumb");
	psideWinPreScrolltrack.appendChild( psideWinPreScrollthumb );
		//end
	var psideWinPreScrollend = document.createElement("DIV");
	psideWinPreScrollend.setAttribute("id","parameters_side_"+MOB_label+"_scrollend");
	psideWinPreScrollend.setAttribute("class","parameters_side_MOB_scrolltrack end");
	psideWinPreScrollthumb.appendChild( psideWinPreScrollend );
		//viewport
	var psideWinPreScrollviewport = document.createElement("DIV");
	psideWinPreScrollviewport.setAttribute("id","parameters_side_"+MOB_label+"_scrollviewport");
	psideWinPreScrollviewport.setAttribute("class","parameters_side_MOB_scrollviewport viewport");
	psideWinPreScroller.appendChild( psideWinPreScrollviewport );
		//overview
	var psideWinPreScrolloverview = document.createElement("DIV");
	psideWinPreScrolloverview.setAttribute("id","parameters_side_"+MOB_label+"_scrolloverview");
	psideWinPreScrolloverview.setAttribute("class","parameters_side_MOB_scrollviewport overview");
	psideWinPreScrollviewport.appendChild( psideWinPreScrolloverview );
	
	psideWin.appendChild( psideWinPreScroller );
	
	//FOR THREE FIRST PRECONFIGS create DIVS !!! class="parameters_side_MOB_preconf"
	//Create DIV "parameter_side_MOB_LABEL_0/1/2" PRECONFIGS GROUPS (could be more!!!!)
	for( var preconfigi=0; preconfigi<Options["MAX_N_PRECONFIGS"]; preconfigi++ ) {
	
		var psideWinPre = document.createElement("DIV");
		psideWinPre.setAttribute("id","parameters_side_"+MOB_label+"_" + preconfigi );
		psideWinPre.setAttribute("class", "parameters_side_MOB_preconf");
		
		if (psideWinPre) psideWinPreScrolloverview.appendChild( psideWinPre );
		
		if (config.log.full) console.log("CreateParametersPreconfigWindows > CREATED parameters side for preconfig ",preconfigi," with id: ", "parameters_side_",MOB_label,"_",preconfigi);
		
		//Create DIVs for every published/grouped parameters
		var pgroup_object_base = "parameter_group_"+MOB_label;

		ret = true;
		
		//CHECK FOR EVERY PARAM GROUP DEPENDENCIES
		//SO WE CREATE THE BUTTONS REFERENCING THE INSPECTORS
		// IN "PARAMETER_INSPECTOR_SIDE"
		for( var param_name in Editor.Parameters[MOB_label] ) {
		
			var Param = Editor.Parameters[MOB_label][param_name];
			var ParamType = Param.paramdefinition["type"];
			var ParamProperty = Param.paramdefinition["property"];
			var ParamValues = Param.paramvalues;
			
			if (config.log.full) console.log("CreateParametersPreconfigWindows > PARAM: ",param_name," PRE:",preconfigi," INFO:",Param);
			
			//ANY PARAM MUST BE PUBLISHED TO BE SHOWN!!!
			//if ( ParamProperty=="published" ) {
				
				/*CHECK IF this param is defined in any GROUP inspector*/
				if ( PrepareGroupParameters( MOB_label,  param_name ) ) {
					//ret = ret && true;
					//YES! SO WE WILL CREATE THE GROUP INSPECTOR AFTER THAT.... see: CreateGroupInspectors()
				} else if (param_name!=undefined && param_name!=false && param_name!="false") {
					
					if ( ParamType=="TEXTURE" && 
						( param_name=="texture" || param_name=="images") ) {
						
						CreateTextureParameter( MOB_label, param_name, preconfigi );
												
					} else if ( ParamType=="TEXTURE" && 
						( param_name=="movies") ) {
						
						CreateMovieParameter( MOB_label, param_name, preconfigi, psideWinPre );
												
					} else if (param_name=="sound" && ParamType=="SOUND") {
						
						CreateSoundParameter( MOB_label, param_name, preconfigi, psideWinPre );
						
					} else if (ParamType=="TEXT" 
						|| ParamType=="TEXTURE" 
						|| ParamType=="NUM"
						|| ParamType=="FUNCTION"
						|| ParamType=="COLOR"
						|| ParamType=="ALPHA"
						|| ParamType=="SYNC"
						|| ParamType=="PHASE"
						|| ParamType=="BLENDING"
						|| ParamType=="TRANSLATEX"
						|| ParamType=="TRANSLATEY"
						|| ParamType=="TRANSLATEZ"
						|| ParamType=="ROTATEX"
						|| ParamType=="ROTATEY"
						|| ParamType=="ROTATEZ"
						|| ParamType=="SCALEX"
						|| ParamType=="SCALEY"
						|| ParamType=="SCALEZ")	{
						CreateStandardParameter(MOB_label, param_name, preconfigi, psideWinPre );
					}
				}
			//}
		}
	
		//ret = ret && 
		CreateGroupedParameters( MOB_label, preconfigi, psideWinPre );
		
	}
	
	$("#parameters_side_"+MOB_label+"_scroller").tinyscrollbar();
	return ret;
}


/**
*	CreateParametersSideWindow
*
*	Create Parameters Side Window for this Moldeo Object ( identified by his label name: MOB_label )
*
*	@param MOB_label Moldeo Object Label Name (must be unique)
*/
function CreateParametersSideWindow( MOB_label, parameters_side_AllWin ) {
	
	if (config.log.full) console.log("CreateParametersSideWindow > ",MOB_label);
	// Check and create DIV "parameter_side_MOB_LABEL"
	
	var ret = false;
	var psideWin = document.getElementById("parameters_side_" + MOB_label );
	
	if (!psideWin) {
		if (config.log.full) console.log("CreateParametersSideWindow > Create Parameters Side for ",MOB_label);
		//FIRST TIME ALWAYS SET ON FIRST PRECONFIG
		Editor.PreconfigSelected = 0;
		//Create DIV "parameter_side_MOB_LABEL"
		psideWin = document.createElement("DIV");
		psideWin.setAttribute("id","parameters_side_"+MOB_label);
		psideWin.setAttribute("class", "parameters_side_MOB");
		psideWin.setAttribute("moblabel", MOB_label );
		
		if (psideWin) {
			parameters_side_AllWin.appendChild( psideWin );
			ret = CreateParametersSideWindowActions( MOB_label, psideWin );
			ret = ret && CreateParametersPreconfigWindows( MOB_label, psideWin );
		}
		
	}
	
	return ret;
}

function CreateParametersSideWindowActions( MOB_label, psideMobWin ) {
	if (config.log.full) console.log("CreateParametersSideWindowActions > ",MOB_label);
	
	var ret = false;
	var psideNameA = "parameters_side_" + MOB_label + "_actions";
	var psideWinActions = document.getElementById(psideNameA);
	
	if (psideWinActions==undefined) {
		psideWinActions = document.createElement("DIV");
		
		if (psideWinActions) {
			psideWinActions.setAttribute("id",psideNameA);
			psideWinActions.setAttribute("class", "parameters_side_MOB_actions");
			
			var actionUnpublished = document.createElement("button");
			actionUnpublished.setAttribute( "id", "action_param_"+MOB_label+"_unpublished");
			actionUnpublished.setAttribute( "class", "action_param_SHOW_ALL");
			actionUnpublished.innerHTML = "++";
			/*
			var actionUp = document.createElement("button");
			actionUp.setAttribute("class", "action_param_UP_ONE");
			actionUp.innerHTML = "UP";
			
			var actionDown = document.createElement("button");
			actionDown.setAttribute("class", "action_param_DOWN_ONE");
			actionDown.innerHTML = "DO";
			*/
			psideWinActions.appendChild(actionUnpublished);
			//psideWinActions.appendChild(actionUp);
			//psideWinActions.appendChild(actionDown);
			
			if (psideMobWin) {
				psideMobWin.appendChild( psideWinActions );
				ret = true;
			}
			
			//actionUnpublished.addEventListener( "click", Editor.Buttons["action_param_unpublished"]["click"]);
			actionUnpublished.addEventListener( "click", Editor.Buttons["action_param_unpublished"]["click"]);
		}
		
	} 
	
	return ret;
	
}



function UpdatePreconfigs( MOB_label ) {

	if (config.log.full) console.log("UpdatePreconfigs(",MOB_label,")");
	//global Elements
	var parameters_side_AllWin = document.getElementById("parameters_side");
	
	if (!parameters_side_AllWin)
		return console.error("UpdatePreconfigs > No parameters side where to place windows");
	else
		CreateParametersSideWindow( MOB_label, parameters_side_AllWin );
	/** changed Object, repopulate parameters!!! */
	selectEditorPreconfig( Editor.PreconfigSelected );
	
}


var sliderpos;
/**
*
*/
function SetPositionMode( group, parammode ) {
	group = "POSITION";
	
	if (config.log.full) console.log("SetPositionMode > parammode: ", parammode);
	
	//CANVAS
	{
	//do nothing
	}
	
	//SLIDER
	if (parammode=="translatex"
		|| parammode=="translatey"
		|| parammode=="translatez"
	) {

		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		activateClass( inputEl, "param_input_selected");
	
		var slider = group+"_slide";
		
		//the slider (one slider per group, N selectors )
		var sliderEl  = document.getElementById( slider );
		sliderEl.setAttribute("min", "-1.0" );
		sliderEl.setAttribute("max", "1.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("selector", parammode );
		if (sliderEl === document.activeElement ) {
			$(sliderEl).css("border", "solid 1px transparent");
			setTimeout(function()
			{
				$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
			}, 100);
		} else {
			sliderEl.value = inputEl.getAttribute("value");
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			if (config.log.full) console.log("HasFocus: ", parammode);
		}
	}
}

function ExecutePositionCanvas( moblabel, selector, preconfig, sliderValue1, sliderValue2 ) {
	
}

function SetScaleMode( group, parammode ) {
	group = "SCALE";
	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );
	
	if (parammode=="scalex" || parammode=="scaley") {
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");
			
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
			sliderEl.setAttribute("selector", parammode );	

			if (sliderEl === document.activeElement ) {
				$(sliderEl).css("border", "solid 1px transparent");
				setTimeout(function()
				{
					$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
				}, 100);
			} else {
				sliderEl.value = inputEl.getAttribute("value");
				sliderEl.setAttribute("value", inputEl.getAttribute("value") );
				if (config.log.full) console.log("HasFocus: ", parammode);
			}
		}
		
	} else if (parammode=="zoom") {
	
		var inputElx = document.getElementById( "selector_"+group+"_scalex_input" );
		var inputEly = document.getElementById( "selector_"+group+"_scaley_input" );
		var aver =  ( Number(inputElx.value) + Number(inputEly.value) ) / 2.0;
		if (config.log.full) console.log("SetScaleMode > aver:",aver," inputElx.value:",inputElx.value," inputEly.value:",inputEly.value);
		activateClass( inputElx, "param_input_selected");
		activateClass( inputEly, "param_input_selected");
		activateClass( inputEly, "param_input_selected_2");

		sliderEl.setAttribute("min", "-2.0" );
		sliderEl.setAttribute("max", "2.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("value", aver );
		sliderEl.value = aver;
		sliderEl.setAttribute("selector", parammode );
	}
	/*
	$(sliderEl).css("border", "solid 1px transparent");
	setTimeout(function()
	{
		$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
	}, 100);
	*/

}

function SetScaleParticleMode( group, parammode ) {
	group = "SCALEPARTICLE";
	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );
	
	if (parammode=="scalex_particle" || parammode=="scaley_particle") {
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");
			
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
			sliderEl.setAttribute("selector", parammode );	

			if (sliderEl === document.activeElement ) {
				$(sliderEl).css("border", "solid 1px transparent");
				setTimeout(function()
				{
					$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
				}, 100);
			} else {
				sliderEl.value = inputEl.getAttribute("value");
				sliderEl.setAttribute("value", inputEl.getAttribute("value") );
				if (config.log.full) console.log("HasFocus: ",parammode);
			}
		}
		
	} else if (parammode=="zoom") {
	
		var inputElx = document.getElementById( "selector_"+group+"_scalex_particle_input" );
		var inputEly = document.getElementById( "selector_"+group+"_scaley_particle_input" );
		var aver =  ( Number(inputElx.value) + Number(inputEly.value) ) / 2.0;
		if (config.log.full) console.log("SetScaleMode > aver:",aver," inputElx.value:",inputElx.value," inputEly.value:",inputEly.value);
		activateClass( inputElx, "param_input_selected");
		activateClass( inputEly, "param_input_selected");
		activateClass( inputEly, "param_input_selected_2");

		sliderEl.setAttribute("min", "-2.0" );
		sliderEl.setAttribute("max", "2.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("value", aver );
		sliderEl.value = aver;
		sliderEl.setAttribute("selector", parammode );
	}
	/*
	$(sliderEl).css("border", "solid 1px transparent");
	setTimeout(function()
	{
		$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
	}, 100);
	*/

}


function SetMotionMode( group, parammode ) {

	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );
	
	if (parammode=="translatex" || parammode=="translatey") {
	
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (sliderEl) {
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
		}
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");
			//aqui hay que interpretar la funcion!! A + B*C( C*time + D )
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			sliderEl.value = inputEl.getAttribute("value");
		}
		sliderEl.setAttribute("selector", parammode );
		/*
		$(sliderEl).css("border", "solid 1px transparent");
		setTimeout(function()
		{
			$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
		}, 100);
		*/


		
	} else if (parammode=="translatex,translatey") {
	
		var inputElx = document.getElementById( "selector_"+group+"_translatex_input" );
		var inputEly = document.getElementById( "selector_"+group+"_translatey_input" );
		if (inputElx) activateClass( inputElx, "param_input_selected");
		if (inputEly) activateClass( inputEly, "param_input_selected");
		if (inputEly) activateClass( inputEly, "param_input_selected_2");
		
	}

}


/**
*	SetSceneObjectsMode
*/
function SetSceneObjectsMode( group, parammode ) {
}

/**
*	SetSceneStatesMode
*
*	there is no scene states modes??
*/
function SetSceneStatesMode( group, parammode ) {

}


function SetStandardMode( group, parammode ) {

	var slider = group+"_slide";
	
	//the slider (one slider per group, N selectors )
	var sliderEl  = document.getElementById( slider );
	
	//the label field
	var labelEl = document.getElementById( group+"_slide_label" );
	
	if (labelEl) {
		//update slide label if any
		labelEl.innerHTML = parammode;
		labelEl.setAttribute("title",parammode);
	}	
	//the input field
	var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
	
	if (inputEl==undefined) {
		inputEl = document.getElementById( "selector_"+group+"_input" );
		if (inputEl) {
			inputEl.setAttribute("selector",parammode);
		}
	}
	
	if (inputEl) {
		activateClass( inputEl, "param_input_selected");
	}
	
	var min = -5;
	var max = 5;
	var step = 0.01;
	
	Cons = Editor.Constraints["particlessimple"][parammode];
	//if (Cons) Cons = Editor.Constraints["particlessimple"][parammode];
	
	if (Cons==undefined) {
		Cons = Editor.Constraints["standard"][parammode];
	}

	if (Cons) {
		if (Cons["min"]!=undefined) min = Cons["min"];
		if (Cons["max"]!=undefined) max = Cons["max"];
		if (Cons["step"]!=undefined) step = Cons["step"];
	}
	
	if (config.log.full) console.log("SetStandardMode(",parammode,") > min:",min," max:",max," step:",step );
	
	if (sliderEl && inputEl) {
		sliderEl.setAttribute("min", min );
		sliderEl.setAttribute("max",  max );
		sliderEl.setAttribute("step",  step );
		
		sliderEl.setAttribute("value", inputEl.getAttribute("value") );
		sliderEl.value = inputEl.value;
		sliderEl.setAttribute("selector", parammode );
		
		$(sliderEl).css("border", "solid 1px transparent");
		setTimeout(function()
		{
			$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
		}, 100);
	}
}

/**
*	SetInspectorMode( group, param_mode )
*	
*	SetInspectorMode set the mode for a group inspector where many parameters are used but only one is controlled
*	by the only slide available...
*
*	For SCALE group inspector, modes available are "horizontal", "vertical", and "proportional", so the behaviour for the slide is different
*
*/
function SetInspectorMode( group, parammode ) {

	//the label field
	var labelEl = document.getElementById( group+"_slide_label" );
	if (labelEl) {
		//update slide label if any
		labelEl.innerHTML = parammode;
		labelEl.setAttribute("title",parammode);
	}
	
	var Inspector = document.getElementById("parameter_inspector_"+group);
	if (Inspector==undefined) {
		console.error("SetInspectorMode failed > not founded:  ", "parameter_inspector_", group, " parammode:",parammode);
		return;
	}
	var inputs = Inspector.getElementsByClassName("param_input");
	for(var i=0; i<inputs.length; i++) {
		var inp = inputs[i];
		if (inp) deactivateClass( inp,"param_input_selected");
		if (inp) deactivateClass( inp,"param_input_selected_2");
		if (inp) deactivateClass( inp,"param_input_selected_3");
	}
	

	if (group=="POSITION") {
		SetPositionMode( group, parammode );
	} else
	if (group=="SCALE") {
		SetScaleMode( group, parammode );
	}else	
	if (group=="SCALEPARTICLE") {
		SetScaleParticleMode( group, parammode );
	}else
	if (group=="MOTION") {
		SetMotionMode( group, parammode );
	} else
	if (group=="SCENE_OBJECTS") {
		if (config.log.full) console.log("SetInspectorMode !!! for SCENE_OBJECTS");
		SetSceneObjectsMode( group, parammode );
	} else	
	if (group=="SCENE_STATES") {
		if (config.log.full) console.log("SetInspectorMode !!! for SCENE_STATES");
		SetSceneStatesMode( group, parammode );
	} else	
	if (group=="EMITTER") {
		if (config.log.full) console.log("SetInspectorMode !!! for EMITTER: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode );
	} else	
	if (group=="BEHAVIOUR") {
		if (config.log.full) console.log("SetInspectorMode !!! for BEHAVIOUR: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode );
	} else	
	if (group=="ATTRACTOR") {
		if (config.log.full) console.log("SetInspectorMode !!! for ATTRACTOR: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode );
	} else {
		if (config.log.full) console.log("SetInspectorMode !!! for group: ",group, " parammode: ", parammode);
		SetStandardMode( group, parammode );	
	}
}

function controlId( group, selector ) {
	if (selector=="" || selector==undefined) return "selector_"+group+"_input";
	return "selector_"+group+"_"+selector+"_input";
}

function ExecuteStandardSlider( group, moblabel, selector, preconfig, sliderValue ) {
	try {
		if (config.log.full) console.log("ExecuteStandardSlider > ",
					" group:",group,
					" moblabel:",moblabel,
					" selector:",selector,
					" pre:",preconfig,
					" sliderValue:",sliderValue);
		
		if (selector==undefined) {  console.error("ExecuteStandardSlider > selector is undefined for:",group, moblabel); return; }

		if (Editor.CustomInspectors[group])
			if (Editor.CustomInspectors[group][selector]) {
				var composed_selector = "";
				var coma = "";
				for( var subsel in Editor.CustomInspectors[group][selector]) {
					var subsel_active = Editor.CustomInspectors[group][selector][subsel];
					if (subsel_active) {
						composed_selector+=coma+subsel;
						coma = ",";
					}
				}
				if (config.log.full) console.log("ExecuteStandardSlider > composed_selector:", composed_selector);
				selector = composed_selector;
			}
		
		var selector_composition = selector.split(",");	
		if (selector_composition.length>=1) {
			for( var i in selector_composition) {
				if (config.log.full) console.log("ExecuteStandardSlider > selector[",i,"] = ",selector_composition[i]);
				var sub_selector = selector_composition[i];
				var inputEl = document.getElementById( controlId(group,sub_selector) );				
				if (inputEl == undefined ) inputEl = document.getElementById( controlId(group) );
				if (inputEl) {
					var oldValue = inputEl.getAttribute("value");
					var nval = Number( oldValue );
					if ( isNaN(nval) ) {
						console.error(" oldValue is not a number, probably a function: ",oldValue," new:",sliderValue);
						//return;
						sliderValue = oldValue;
					}
					inputEl.setAttribute("value",sliderValue);
					inputEl.value = sliderValue;
					SetValue( moblabel, sub_selector, preconfig, sliderValue );
				} else {
					console.error("ExecuteStandardSlider > no input sel for:", controlId(group,sub_selector)," or:",controlId(group));
				}

			}
		}
	} catch(err) {
		alert( err );
		console.error("ExecuteStandardSlider > error:", err);
	}
}

function GetSliderInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	if (!target.parentNode.parentNode) return;
	return target.parentNode.parentNode;
}

function GetCanvasInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	if (!target.parentNode.parentNode) return;
	return target.parentNode.parentNode;
}

function GetInputInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	return target.parentNode;
}

function GetInspector( target ) {
	var t = target.parentNode;
	var classname = t.getAttribute("class");
	var founded = false;
	var it = 0;
	var maxit = 4;
	while( founded==false && t && it<maxit  ) {			
		classname = t.getAttribute("class");
		if (console.log.full) console.log("GetInspector > classname:", classname, "it:",it );
		if (classname) {
			founded = (classname.indexOf("parameter_inspector")>=0 );			
			return t;
		}
		t = t.parentNode;
		it++;
	}
	if (founded==false) return undefined;
	//console.log("GetInspector > t",t );	
	return t;
}

/**
	Executed on every change event on every Inspector's Sliders...
	
*/
function ExecuteSliderInspector(event) {

	var Inspector = GetSliderInspector(event.target);

	if (!Inspector) {
		// we are not in inspector div
		console.error("ExecuteSliderInspector > we are not in inspector div ??? ", event);
		return;
	}
	
	var group = Inspector.getAttribute("group");
	var moblabel = Inspector.getAttribute("moblabel");
	var preconfig = Inspector.getAttribute("preconfig");
	
	var selector = event.target.getAttribute("selector");
	var sliderValue = event.target.value;
	
	if (config.log.full) console.log("ExecuteSliderInspector > group:",group,
				" selector:", selector,
				" preconfig:",preconfig,
				" value:",sliderValue );
	
	if (group==undefined) {
		
		var paramName = Inspector.getAttribute("param");
		var paramType = Inspector.getAttribute("paramtype");
		
		group = paramType;
		selector = paramName;
	}
	
	ExecuteStandardSlider( group, moblabel, selector, preconfig, sliderValue );
	
}



function UpdateSound( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateSound");
	var ObjectSounds = Editor.Sounds[moblabel];
	if (ObjectSounds!=undefined) {
		if (ObjectSounds[paramname]!=undefined) {
			if (ObjectSounds[paramname]["preconf_"+preconfig]!=undefined) {
				//var filesrc = ObjectSounds[paramname]["preconf_"+preconfig]["src"];
				ObjectSounds[paramname]["preconf_"+preconfig]["src"] = filename;
				//do something, like loading an audio object...
				selectEditorSound( preconfig );
			}
		}
	}
}

function UpdateMovie( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateMovie");
	var ObjectMovies = Editor.Movies[moblabel];
	if (ObjectMovies!=undefined) {
		if (ObjectMovies[paramname]!=undefined) {
			if (ObjectMovies[paramname]["preconf_"+preconfig]!=undefined) {
				//var filesrc = ObjectSounds[paramname]["preconf_"+preconfig]["src"];
				ObjectMovies[paramname]["preconf_"+preconfig]["src"] = filename;
				//do something, like loading an audio object...
				selectEditorMovie( preconfig );
			}
		}
	}
}

function UpdateColor( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateColor");
	if (Editor.Parameters[moblabel]==undefined) return;
	if (Editor.Parameters[moblabel][paramname]==undefined) return;
	if (Editor.Parameters[moblabel][paramname]["paramvalues"]==undefined) return;	
	if (Editor.Parameters[moblabel][paramname]["paramvalues"][preconfig]==undefined) return;	
	var color_value = Editor.Parameters[moblabel][paramname]["paramvalues"][preconfig];
	var color = "#FFFFF";
	var red = 0;
	var green = 0;
	var blue = 0;
	if (color_value) {
		red = Math.floor(Number(color_value[0]["value"])*255);
		green = Math.floor(Number(color_value[1]["value"])*255);
		blue = Math.floor(Number(color_value[2]["value"])*255);
		color = rgbToHex( red, green, blue );
	}
	if (config.log.full) console.log("UpdateColor > ",color,"for:",red,green,blue);
	document.getElementById("object_color_sel").setAttribute("style","background-color:"+color+";");
	
}

function UpdateImage( moblabel, param_name, preconfig, filename ) {
	try {
		if (config.log.full) console.log("UpdateImage");		
		//ok
		//fecthImage and drawParamImage
		selectEditorImage( moblabel, param_name, preconfig );
	} catch(err) {
		console.error("UpdateImage > ",err);
	}
} 

function ImportFile( moblabel, param_name, preconfig, filename ) {

	if (config.log.full) console.log("ImportFile > moblabel: ",moblabel," param_name: ",param_name," preconfig:",preconfig," filename:",filename);
	
	SetValue( moblabel, param_name, preconfig, filename );
	/**
	if (paramname=="texture") ImportImage( moblabel, paramname, preconfig, filename );
	if (paramname=="sound") ImportSound( moblabel, paramname, preconfig, filename );
	if (paramname=="movies") ImportMovie( moblabel, paramname, preconfig, filename );
	*/
	
}

function SetValue( moblabel, selector, preconfig, value ) {
	
	if (config.log.full) console.log("SetValue("+moblabel+","+selector+","+preconfig+","+value+")");
	var subselec = undefined;
	var clselector=selector;
	if (selector=="color:0") { subselec = 0;}
	if (selector=="color_1") subselec = 1;
	if (selector=="color_2") subselec = 2;
	if (selector=="color_3") subselec = 3;
	if (selector=="particlecolor:0") subselec = 0;
	if (selector=="particlecolor_1") subselec = 1;
	if (selector=="particlecolor_2") subselec = 2;
	if (selector=="particlecolor_3") subselec = 3;


	if (selector=="color:0"
	|| selector=="color_1"
	|| selector=="color_2"
	|| selector=="color_3") {
		selector = "color";
	}
	
	
	if (selector=="particlecolor:0"
	|| selector=="particlecolor_1"
	|| selector=="particlecolor_2"
	|| selector=="particlecolor_3") {
		selector = "particlecolor";
	}


	var success = false;
	try {
		/**WE UPDATE THE VALUE IN CONTROL MEMORY (to optimize for now not to fetch all object parameters values: MUST TODO NEXT: wait until fetch new value)*/
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
							if (Param["paramdefinition"]["type"]=="COLOR") {
								//Data[];
								//explode( color
								if (config.log.full) console.log("SetValue of a color:",value,"subselec:",subselec,"ParamValue:",ParamValue );
								
								if (!isNaN(Number(value)) && !isNaN(Number(subselec)) && ParamValue.length>=3) {
									ParamValue[subselec]["value"] = value;
									value = rgbToHex( ParamValue[0]["value"]*255,
													ParamValue[1]["value"]*255,
													ParamValue[2]["value"]*255);
									if (config.log.full) console.log("SetValue COLOR (rgbToHex) is ",selector,value );
								} else if (value!=undefined && value.indexOf("#")>=0 && ParamValue.length>=3) {
									if (config.log.full) console.log("SetValue COLOR (hexToRgb) is ",selector,value );
									var resColor = hexToRgb(value);
									if (resColor) {
										if (resColor.r) ParamValue[0]["value"] = resColor.r / 255.0;
										if (resColor.g) ParamValue[1]["value"] = resColor.g / 255.0;
										if (resColor.b) ParamValue[2]["value"] = resColor.b / 255.0;
										if (ParamValue[3]) ParamValue[3]["value"] = 1.0;
									}
								} else if (isNaN(Number(value)) && subselec>=0 ) {
									selector = clselector;								
									if (config.log.full) console.log("SetValue COLOR (function) is ",selector,value );									
								} else console.error("SetValue > ERROR: param "+selector+" is a color has no values.",value);
							} else {							
								Data["value"] = value;
							}
							success = true;
						} else console.error("SetValue > no Data for " + selector +" preconf:"+preconfig+" subvalue: 0 ");
					} else {
						moCI.AddValue( moblabel, selector, preconfig, value );
						console.error("SetValue > no ParamValue for " + preconfig,value);
					}
				} else console.error("SetValue > no ParamValues for " + selector,value);
			} else console.error("SetValue > no Param for " + selector,value);
		} else console.error("SetValue > no Params for " + moblabel,value);
		
		
		if (success) {
			var APIObj = { 
						"msg": "/moldeo",
						"val0": "valueset", 
						"val1": moblabel, 
						"val2": selector,
						"val3": preconfig,
						"val4": value
						};
			if (config.log.full) console.log("APIObj:",APIObj);
			Editor.SaveNeeded = true;
			if (Editor.SaveNeeded) {
				activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
				activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
			}
			OscMoldeoSend( APIObj );
		}
	} catch(bigerr) {
		alert("Algo pasó asignando este valor:"+value+" intente de nuevo. Error: "+bigerr);
	}
	
}


function UpdateSceneObjectsInspector( inspectorElement, moblabel, preconfig ) {
	
	if (config.log.full) console.log("UpdateSceneObjectsInspector > " );
	
}

var moSceneState = {
	"Label": "",
	"In": "",
	"Out": "",
	"Action": "",
	"SceneKeys": []
};

var listitem = {}

function UpdateSceneStatesInspector( inspectorElement, moblabel, preconfig ) {
	if (config.log.full) console.log("UpdateSceneStatesInspector > ",inspectorElement,", ",moblabel,", ",preconfig );
	
	var SceneStatesValues = {};
	var ParamIndexValue = 0;
	
	//CLEAN
	inspectorElement.innerHTML = "";
	
	list = document.createElement("UL");
	list.setAttribute("class","scene_states");
	
	var Params = Editor.Parameters[moblabel];
	var moSceneState = {}
	if (Params) ParamSceneStates = Params["scene_states"];
	if (Params && ParamSceneStates) {
		SceneStatesValues = ParamSceneStates["paramvalues"];
		ParamIndexValue = ParamSceneStates["paramindexvalue"]
	}
		
		
	if (SceneStatesValues)
		for( var ei=0; ei<SceneStatesValues.length; ei++  ) {
		
			item = document.createElement("LI");
			
			/*
			if ( ParamIndexValue == ei )
				item.setAttribute("class","moSceneState moSceneStateActive");
			else
				item.setAttribute("class","moSceneState");
			*/
			
			PreconfigSelection = moCI.RememberPreconfigSelection( moblabel );
			
			if ( PreconfigSelection==ei )
				item.setAttribute("class","moSceneState moSceneStateActive");
			else
				item.setAttribute("class","moSceneState");
			
			
			StateValue = SceneStatesValues[ei];
			
			if (StateValue && StateValue.length>0) {
			
				StateLabel = StateValue[0].value;
				if (config.log.full) console.log("UpdateSceneStatesInspector > StateLabel: ",StateLabel);
				item.innerHTML = StateLabel;
				item.addEventListener( "click", function(event) {
					
					if (config.log.full) console.log("Activate this scene state: ", event.target.innerHTML );
					
				});
				
				if (StateValue.length>1) {
					moSceneState = StateValue[1].value;
				}
			}
			
			list.appendChild(item);
		}
	inspectorElement.appendChild(list);
	listitem = inspectorElement;
}

function UpdateStandardInspector( TabInspector, inspectorElement, moblabel, preconfig ) {
	try {
	if (config.log.full) console.log("UpdateStandardInspector > ");
	
	if (inspectorElement==undefined) return;
	if (moblabel==undefined) return;
	if (preconfig==undefined) return;

	var Params = Editor.Parameters[moblabel];
	if (Params==undefined) return false;

	var paramName = TabInspector.getAttribute("param");
	var paramType = TabInspector.getAttribute("paramtype");

	
	//SETTING INSPECTOR ATTRIBUTES
	inspectorElement.setAttribute("moblabel", moblabel);
	inspectorElement.setAttribute("param", paramName);
	inspectorElement.setAttribute("paramtype", paramType);
	inspectorElement.setAttribute("selector", paramName);
	inspectorElement.setAttribute("preconfig", preconfig );
	
	
	moCI.MemorizePreconfigSelection( moblabel, preconfig );
	
	var Param = Params[paramName];
	var paramValue = Param.paramvalues[preconfig];
	
	//only one slide
	var sliderInspectorName = paramType+"_slide";
	var slider = document.getElementById(sliderInspectorName);
	if (slider) {
		slider.addEventListener("change", ExecuteSliderInspector );
	}
	
	SetStandardMode( paramType, paramName );
	
	if (paramValue==undefined) {
		console.error("UpdateStandardInspector > NO PRECONFIG VALUE FOR : " + moblabel+"."+paramName+" AT POSITION ("+preconfig+")" );
		moCI.AddValue( moblabel, paramName, preconfig );
		return;
		//ValueAdd( moblabel, param, preconf, value );
		//PresetValueAdd(...)
	}
	
	if (paramValue) {
		var data_str = moCI.GetValuesToStr( moblabel, paramName, preconfig );
		if (paramValue.length) {								
			for(var sub=0; sub<paramValue.length; sub++) {
				var datav = paramValue[sub]["value"];
				
				//now that we have	it, assign it to inspector...
				
				var inputInspectorName = "selector_"+paramType+"_"+paramName+"_input";
				if (sub>0 && paramValue.length>1) 
					inputInspectorName = "selector_"+paramType+"_"+paramName+"_"+sub+"_input";
			
				if (slider) {
					slider.value = datav;
				}
				
				//now that we have it, assign it to inspector...
				var inputInspector = document.getElementById( inputInspectorName );
				
				if (!inputInspector) {
					inputInspectorName = "selector_"+paramType+"_input";
					inputInspector = document.getElementById( inputInspectorName );
				}
				if (inputInspector) {
					inputInspector.addEventListener("change", inputValueUpdate );
					inputInspector.setAttribute("value", datav);
					inputInspector.value = datav;
					activateClass(inputInspector,"param_input_selected");
				} else {
					console.error("UpdateStandardInspector > " + inputInspectorName+" not found!");
				}
			}
		} else {
			console.error("UpdateStandardInspector > NO PARAM VALUE (subvalue 0) FOR : " + moblabel+"."+paramName+" AT POSITION ("+preconfig+")" );
			moCI.AddValue( moblabel, paramName, preconfig );
		}

	}
	
	} catch(err) {
		console.error("UpdateStandardInspector > ",err);
		alert("UpdateStandardInspector > " + err);
	}	
}

function inputValueUpdate( event ) {
	if (config.log.full) console.log("Value updated!! ",event.target.value );
	var Inspector = GetInputInspector(event.target);
	if (Inspector) {
		moblabel = Inspector.getAttribute("moblabel");
		preconfig = Inspector.getAttribute("preconfig");

		selector = event.target.getAttribute("selector");
		sliderValue = event.target.value;
		SetValue( moblabel, selector, preconfig, sliderValue );
	}
}

/**
*	UpdateInspector > reconfigura el inspector recién activado por el botón de parámetro (ALPHA,TEXTURE,POSITION,MOTION,EMITTER...)
*/


/**
*	Devuelve el selector activado para este inspector
*/
function GetSelectedSelectorName( moblabel, group, preconfig ) {
	
	if (moblabel==undefined || group==undefined || preconfig==undefined) return false;
	
	var eiss = Editor.InspectorSelectorSelected;
	
	if ( eiss[ moblabel ]==undefined || eiss[ moblabel ][ group ]==undefined || eiss[ moblabel ][ group ][ preconfig ]==undefined) return false;
	
	return eiss[ moblabel ][ group ][ preconfig ];
}

function IsValidParamValues( paramValues ) {
	if (paramValues==undefined) return false;
	if (paramValues.length==undefined) return false;
	if (paramValues.length>0) {
		return true;
	}
	return false;
}

function UpdateGroupParam( group, moblabel, paramName, preconfig ) {

	try {
		/*
		if (Editor.Parameters[moblabel]==undefined) return;
		var Param = Editor.Parameters[moblabel][paramName];
		if (Param==undefined) return;
		var paramValue = Param[preconfig];
		*/
		var paramValues = moCI.GetParamValues( moblabel, paramName, preconfig );
		
		if ( IsValidParamValues(paramValues) ) {								
			
			var data_str = moCI.GetValuesToStr( moblabel, paramName, preconfig );
			
			for(var sub=0; sub<paramValues.length; sub++) {
				var datav = paramValues[sub]["value"];
				
				//now that we have	it, assign it to inspector...
				
				var inputInsName = "selector_"+group+"_"+paramName+"_input";
				if (sub>0 && paramValues.length>1) 
					inputInsName = "selector_"+group+"_"+paramName+"_"+sub+"_input";
					
				var inputI = document.getElementById( inputInsName );											
				if (inputI) {
					inputI.addEventListener("change", inputValueUpdate );
					inputI.setAttribute("value", datav);
					inputI.value = datav;
					if (config.log.full)
						console.log("UpdateInspector > updated value "+inputInsName+" val:"+datav+" data_str:"+data_str);
				} else {
					console.error("UpdateInspector > " + inputInsName+" not found!");
				}
			}
		} else {
			console.error("NO PRECONFIG PRINCIPAL VALUE values(0) FOR : " + moblabel+"."+paramName+" AT POSITION: "+preconfig+" " );
		}
	} catch(err) {
		console.error("UpdateGroupParam > ", err );
		alert("UpdateGroupParam > " + err );
	}	
}





function UpdateGroupedInspector( moblabel, group, preconfig ) {

	try{
		var ObjectInspectors = Editor.Inspectors[moblabel]; if (ObjectInspectors==undefined) return;
		var inspectorSelectors = ObjectInspectors[group];
		var selectorSelected = false;
		var Params = moCI.GetParams( moblabel );
		var firstSel;
		// Ahora debemos memorizar que selector estaba seleccionado, para simular el click (que selecciona un selector y por ende pone al dia los valores).
		//recorre TODOS LOS SELECTORES de este INSPECTOR
		for( var selectorName in inspectorSelectors ) {			
			var selParams = inspectorSelectors[ selectorName ];			
			if (selParams) {

				//SIMULA un CLICK SOBRE EL SELECTOR SELECCIONADO
				var idSelEleName = "selector_"+group+"_"+selectorName+"";
				var SelElement = document.getElementById( idSelEleName );
				if (SelElement) {
					if (firstSel==undefined) firstSel = SelElement;
					//si coincide con el memorizado
					if ( selectorName == GetSelectedSelectorName( moblabel, group, preconfig ) ) {					
						
						if (config.log.full) console.log("UpdateGroupedInspector > "+idSelEleName+" clicked, previously selected.");
							
						SelElement.click();//CLICK
						
						selectorSelected = true;					
					}
				} else {
					console.error("UpdateGroupedInspector > no htmlElement for " + idSelEleName);
				}

				//PONE AL DIA cualquier htmlElement con su PARAMETRO ( Editor.Parameters )
				for( var paramName in selParams) {
					//if this MOBLLE has this parameter as a member (==true), so we try to UPDATE IT( lo ponemos al dia con sus valores )
					if ( selParams[paramName] ) {
						
						var Param =  Params[paramName];
						if ( moCI.GetParamValues( moblabel, paramName, preconfig ) ) {
						
							UpdateGroupParam( group, moblabel, paramName, preconfig );
														
						} else if ( Param && Param.paramvalues ) {
							console.error("NO PARAM ENTRY FOR : " + moblabel+"."+paramName+" AT PRECONFIG POSITION: "+preconfig+" " );
							moCI.AddValue( moblabel, paramName, preconfig );
						}									
					}				
				}				
			}
		}	

		if (selectorSelected == false && firstSel) 
			firstSel.click();
	} catch(err) {
		console.error("UpdateGroupedInspector > ", err );
		alert("UpdateGroupedInspector > " + err );
	}
}

function UpdateInspector( TabInspector, inspEle, moblabel, preconfig ) {
	try {
		if (config.log.full) console.log("UpdateInspector()");

		if (inspEle==undefined || moblabel==undefined || preconfig==undefined) return;
		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return; 		
		
		moCI.SubscribeInspectorToMob( inspEle, moblabel, preconfig );
				
		//group is
		var group = inspEle.getAttribute("group"); 
		if (group=="" || group==undefined ) return UpdateStandardInspector( TabInspector, inspEle, moblabel, preconfig );
		if (config.log.full) console.log("UpdateInspector > assign parameters for inspector group: " + group);		
		if ( group=="SCENE_OBJECTS" ) return UpdateSceneObjectsInspector( moblabel, preconfig );
		if ( group=="SCENE_STATES"  ) return UpdateSceneStatesInspector( inspEle, moblabel, preconfig );

		UpdateGroupedInspector( moblabel, group, preconfig );
				
	} catch(err) {
		console.error("UpdateInspector > ", err );
		alert("UpdateInspector > " + err );
	}

}

function ActivatePreconfigsParameters( preconf_index ) {

	//Populate parameters with preconfigs
	var btn_escala = document.getElementById("parameter_group_ESCALA_label_"+preconf_index);
	
	btn_escala.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});
	
	var btn_position = document.getElementById("parameter_group_POSICION_label_"+preconf_index);
	
	btn_position.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});
	
	var btn_movimiento = document.getElementById("parameter_group_MOVIMIENTO_label_"+preconf_index);
	
	btn_movimiento.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});
	
	var btn_scene_objects = document.getElementById("parameter_group_SCENE_OBJECTS_label_"+preconf_index);
	
	btn_scene_objects.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});
	
	var btn_scene_states = document.getElementById("parameter_group_SCENE_STATES_label_"+preconf_index);
	
	btn_scene_states.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});
	
}

/**
	SET
	TODO: always select first parameter inspector!!
	TODO: in inspector always select first value...
*/
function selectEditorPreconfig( preconfig_index ) {
try {	
	if (config.log.full) console.log("selectEditorPreconfig > ", preconfig_index);
	
	if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
		alert("Atención! Seleccione un efecto antes de editar una preconfiguración.");
		return;
	}

	if (config.log.full) console.log("selectEditorPreconfig(",preconfig_index,")");

	Editor.PreconfigSelected = preconfig_index;
	Preconfs = Editor.Preconfigs[ Editor.ObjectSelected ];
	Editor.PreconfigsSelected[Editor.ObjectSelected] = preconfig_index;
	
	/* selectControlPreconfig */
	if (config.log.full) console.log("selectEditorPreconfig > Editor.ObjectSelected: ", Editor.ObjectSelected );
	Control.Functions.selectControlPreconfig( Editor.ObjectSelected, Editor.PreconfigSelected, true /*force select*/ );
	
	var parameters_side_winID = "parameters_side_"+Editor.ObjectSelected+"_";
	
	var CurrentPreconfig = Preconfs[preconfig_index];
	var win_Preconfigs = document.getElementById("object_preconfigs");
	var btn_Preconfig = document.getElementById("buttonED_"+(Editor.PreconfigSelected+1) );
	
	if (!win_Preconfigs) return console.error("Element object_preconfigs doesnt exists");
	
	var win_parameters_Preconfig = document.getElementById( parameters_side_winID+preconfig_index );	
	if (!win_parameters_Preconfig) return console.error("selectEditorPreconfig > no " + parameters_side_winID);

	//reset classes DEACTIVATE
	for( var p=1;p<=Options["MAX_N_PRECONFIGS"];p++) {

		//DEACTIVATE PRECONFIG SELECTOR
		if (win_Preconfigs) deactivateClass( win_Preconfigs, "object_preconfigs_" + p );
		
		//DEACTIVATE PRECONFIG SELECTOR BUTTONS
		btn_Preconfigx = document.getElementById("buttonED_"+p );
		if (btn_Preconfigx) deactivateClass( btn_Preconfigx, "circle_selected" );
		
		//DEACTIVATE PARAMETERS SIDE
		win_parameters_Preconfigx = document.getElementById( parameters_side_winID + (p-1) );
		if (win_parameters_Preconfigx) {
			deactivateClass( win_parameters_Preconfigx, "parameters_selected" );
		} else {
			if (config.log.full) console.log("selectEditorPreconfig > win_parameters_Preconfigx:",win_parameters_Preconfigx," null in ",Editor.ObjectSelected);
		}
	}
	
	//ACTIVATE ACTUAL PRECONFIG WINDOWS,BUTTONS AND PARAMETERS SIDE
	//activate class for window
	if (win_Preconfigs) activateClass( win_Preconfigs, "object_preconfigs_" + (Editor.PreconfigSelected+1) );
	//activate class for circle button
	if (btn_Preconfig) activateClass( btn_Preconfig, "circle_selected" );
	//activate class for parameters side
	if (win_parameters_Preconfig) activateClass( win_parameters_Preconfig, "parameters_selected" );
	
	
	
	selectEditorParameter(Editor.PreconfigSelected);	
	//LOAD IMAGE in canvas for this Preconfig
	//EN funcion de las imagenes que tenemos en ObjectImages generamos THUMBNAILS
	// aqui solo para 1	
	selectEditorImage( Editor.ObjectSelected, "texture", Editor.PreconfigSelected);
	selectEditorImage( Editor.ObjectSelected, "images", Editor.PreconfigSelected);
	
	selectEditorSound(Editor.PreconfigSelected);
	
	selectEditorMovie(Editor.PreconfigSelected);
	
	selectEditorColor(Editor.PreconfigSelected);
	
	if (CurrentPreconfig!=undefined) {
		if (config.log.full) console.log( "Preconfig selected: ",CurrentPreconfig );
	} else {
		console.error("selectEditorPreconfig > no preconfig for (MUST ADD PRECONFIG):", Editor.PreconfigSelected);
		moCI.AddPreconfig( Editor.ObjectSelected, Editor.PreconfigSelected );
	}
} catch(err) {
	console.error("selectEditorPreconfig > ", err);
	alert("selectEditorPreconfig > "+ err);
}
}



