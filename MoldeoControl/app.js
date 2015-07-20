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




window.onload = function() {
 
	win = gui.Window.get();
	win.moveTo( 0, (600-164) );

	document.getElementById("close-window-button").onclick = function() {
		//window.close();
		gui.App.quit();
	}

    
    var drage = document.getElementById("titlebar");
    drage.addEventListener('dragstart', handleDragStart, true);
    drage.addEventListener('dragenter', handleDragEnter, true);
    drage.addEventListener('dragover', handleDragOver, true);
    drage.addEventListener('dragleave', handleDragLeave, true);
    drage.addEventListener('dragend', handleDragEnd, true);

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

	}

	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget'} );
	
}
