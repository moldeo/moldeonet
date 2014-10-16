var Console = {

	"Info": {},
	
	"Player": {
		"ObjectSelected": "",
		"PreconfigSelected": {},
		"Objects": {}
	},
	
	"UpdateConsole": function( info ) {

		Console.Info = info;
	
	},
	
};

function SaveProjectAs( filename ) {
	//must clone!!! Use moDataManager::Export function...
	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesaveas', 'val1': filename } );
}

function SaveScreenshotAs( screenshot, filename ) {

	fs.copyFile( screenshot, filename );
	
}

var Player = {
	"ObjectSelected": "",
	"PreconfigSelected": {},
	"Objects": {}
};



var Editor = {
	"ObjectSelected": "",
	"PreconfigSelected": 0,
	"SaveNeeded": false,
	
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

var sliderMessages = {
	'channel_alpha': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "alpha", "val3": msgvalue }',
	'channel_tempo': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "tempo", "val3": msgvalue }'
};






