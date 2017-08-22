var win = false;

window.onfocus = function() {
  //console.log("focus");
}

window.onblur = function() {
  //console.log("blur");
}

window.onresize = function() {
  console.log("resize! WxH:",window.innerWidth, "x", window.innerHeight);
	if (moCI.Connectors) {
		if (moCI.Connectors.FRib) {
			moCI.Connectors.FRib.Resize( window.innerWidth, window.innerHeight );
		}
	}

  var window_panels = document.getElementsByClassName("window_panel");
  for( var e=0; e<window_panels.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = window_panels[e];
    if (mel) {
      //mel.style.width = Number(Number(window.innerWidth) - 80) + "px";
      mel.style.height = Number(Number(window.innerHeight) - 22) + "px";
      mel.style.bottom = "-" + Number(Number(window.innerHeight) - 22) + "px";
    }
  }

  var middles_middle = document.getElementsByClassName("skin_middle_middle");
  for( var e=0; e<middles_middle.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = middles_middle[e];
    if (mel) {
      mel.style.width = Number(Number(window.innerWidth) - 80) + "px";
      mel.style.height = Number(Number(window.innerHeight) - 80) + "px";
    }
  }

  var middles_top = document.getElementsByClassName("skin_middle_top");

  for( var e=0; e<middles_top.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = middles_top[e];
    if (mel) {
      mel.style.width = Number(Number(window.innerWidth) - 80) + "px";
    }
  }

  var middles_bottom = document.getElementsByClassName("skin_middle_bottom");
  for( var e=0; e<middles_bottom.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = middles_bottom[e];
    if (mel) {
      mel.style.width = Number(Number(window.innerWidth) - 80) + "px";
    }
  }

  var middles_left = document.getElementsByClassName("skin_left_middle");
  for( var e=0; e<middles_left.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = middles_left[e];
    if (mel) {
      mel.style.height = Number(Number(window.innerHeight) - 80) + "px";
    }
  }

  var middles_right = document.getElementsByClassName("skin_right_middle");
  for( var e=0; e<middles_right.length; e++) {
    ///set width = window.innerWidth - 80) px
    var mel = middles_right[e];
    if (mel) {
      mel.style.height = Number(Number(window.innerHeight) - 80) + "px";
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
win.setTransparent(!win.isTransparent);


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
	$(".x_close").on("click", function(event) {
    win.close();
  /*gui.App.quit();*/


});


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

	window.onresize();

  /** CREATE MENU SO WE HAVE COPY/PASTE in MAC!!! */
  if (config.IsOsx()) {
    // Create sub-menu
    var menu = new gui.Menu({'type': 'menubar'});
    var menuItems = new gui.Menu();

    menuItems.append(new gui.MenuItem({ label: 'Custom Menu Item 1' }));
    menuItems.append(new gui.MenuItem({ label: 'Custom Menu Item 2' }));

    // create MacBuiltin
    menu.createMacBuiltin('Sample App',{
        hideEdit: false,
        hideWindow: true
    });

    // Append MenuItem as a Submenu
    menu.append(
        new gui.MenuItem({
            label: 'Custom Menu Label',
            submenu: menuItems // menu elements from menuItems object
        })
    );

    // Append Menu to Window
    gui.Window.get().menu = menu;
  }


	win.on("close", function() {
		try {
			if (moCI.Browser.winBrowser)
				moCI.Browser.winBrowser.close(true);
			//this.close(true);
      this.close(true);
		} catch(err) {
			alert(err);
			this.close(true);
		}

	});

  if (moCI) {
    RegisterAllButtonActions();
    if (gui.App.argv.length>=1) {
      filePath = gui.App.argv[0];
      var stat;
      try {
        stat = moCI.fs.statSync(filePath);
        console.log(stat);
        if (stat.isFile()) {
          console.log("Try to open project: ", filePath);
          moCI.OpenProject( filePath );
        } else {
          if (stat.isDirectory()) {
            config.custom_path = filePath;
            moCI.Browser.Open();
          } else {
            moCI.Browser.Open();
          }

        }
      } catch(err) {
        if (err) {
          console.log("Err:",err.message);
          if (err.code=="ENOENT") {
            moCI.Browser.Open();
          }
        }
      } finally {

      }
    } else {
      moCI.Browser.Open();
    }
    setTimeout( moCI.Updater.Functions.checkMoldeoLastVersion, 1000 );
  }

	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget'} );

	//$('[data-toggle="tooltip"]').tooltip();
});
