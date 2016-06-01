var win = false;

window.onfocus = function() { 
  //console.log("focus");
}

window.onblur = function() { 
  //console.log("blur");
}

window.onresize = function() {
	if (moCI.Connectors) {
		if (moCI.Connectors.FRib) {
			moCI.Connectors.FRib.Resize( window.innerWidth, window.innerHeight );
		}
	}
}

var dragO = {};
var dragIcon = document.createElement('img');
dragIcon.src = 'moldeocontrol64.png';
    dragIcon.width = 14;
    dragIcon.height = 14;
function dragWithCustomImage( event ) {
    
    event.dataTransfer.setDragImage(dragIcon, 0, 0);    
}

function handleDragStart(event) {
    console.log("start");
    dragWithCustomImage( event);
    dragO["startX"] = event.offsetX;
    dragO["startY"] = event.offsetY;
    
}
function handleDragEnter(event) {
    //console.log("enter");
}

function handleDragOver(event) {
    //console.log("over",event);
    dragO["overX"] = event.offsetX;
    dragO["overY"] = event.offsetY;
    dragO["moveX"] = dragO["overX"]-dragO["startX"];
    dragO["moveY"] = dragO["overY"]-dragO["startY"];
    if (win) win.moveBy( dragO["moveX"], dragO["moveY"] );
    dragWithCustomImage( event);
}
function handleDragLeave(event) {
    console.log("leave");
}
function handleDragEnd(event) {
    console.log("end");
}

function dragWithCustomImage(event) {
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = 50;

  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 4;
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 50);
  ctx.moveTo(0, 50);
  ctx.lineTo(50, 0);
  ctx.stroke();

  var dt = event.dataTransfer;
  dt.setData('text/plain', 'Data to Drag');
  dt.setDragImage(canvas, 25, 25);
}




$(function() {
 
	win = gui.Window.get();

/**
screen {
// unique id for a screen
  id: int,

// physical screen resolution, can be negative, not necessarily start from 0,depending on screen arrangement
  bounds: {
    x: int,
    y: int,
    width: int,
    height: int
  },

// useable area within the screen bound
  work_area: {
    x: int,
    y: int,
    width: int,
    height: int
  },

  scaleFactor: float,
  isBuiltIn: bool,
  rotation: int,
  touchSupport: int
}
*/
	/*
	var screen_client = Screen.screens[0];
	var screen_width = screen_client.work_area.width;
	var screen_height = screen_client.work_area.height;
	*/
	screen_height = 600;
	win.moveTo( 0, (screen_height-164) );

	$(".x_minimize").on("click", function(event) { win.minimize(); /*gui.App.quit();*/ });
	$(".x_maximize").on("click", function(event) { win.maximize(); /*gui.App.quit();*/ });
	$(".x_debug").on("click", function(event) { win.showDevTools(); /*gui.App.quit();*/ });
	$(".x_close").on("click", function(event) { win.close(); /*gui.App.quit();*/ });
		
	
    var drage = document.getElementById("titlebar");
	if (drage && config.platform=="linux") {
		drage.addEventListener('dragstart', handleDragStart, true);
		drage.addEventListener('dragenter', handleDragEnter, true);
		drage.addEventListener('dragover', handleDragOver, true);
		drage.addEventListener('dragleave', handleDragLeave, true);
		drage.addEventListener('dragend', handleDragEnd, true);
	}
	gui.Window.get().show();
	$(document.getElementsByTagName("body")[0]).toggleClass(config.platform);

	win.on("close", function() {
		try {
			if (moCI.Browser.winBrowser)
				moCI.Browser.winBrowser.close(true);
			this.close(true);
		} catch(err) {
			alert(err);
			this.close(true);
		}
			
	});

	if (moCI) {
		RegisterAllButtonActions();
        moCI.Browser.Open();
		setTimeout( moCI.Updater.Functions.checkMoldeoLastVersion, 1000 );
	}

	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget'} );
	
	//$('[data-toggle="tooltip"]').tooltip(); 
});
