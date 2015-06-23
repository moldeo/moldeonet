var win = false;

window.onfocus = function() { 
  //console.log("focus");
}

window.onblur = function() { 
  //console.log("blur");
}

window.onresize = function() {
	if (Console.Connectors) {
		if (Console.Connectors.FRib) {
			Console.Connectors.FRib.Resize( window.innerWidth, window.innerHeight );
		}
	}
}

window.onload = function() {
  
	document.getElementById("close-window-button").onclick = function() {
		//window.close();
		gui.App.quit();
	}
	gui.Window.get().show();

	win = gui.Window.get();

	win.on("close", function() {
		try {
			if (ConsoleInterface.Browser.winBrowser)
				ConsoleInterface.Browser.winBrowser.close(true);
			this.close(true);
		} catch(err) {
			alert(err);
			this.close(true);
		}
			
	});

	if (Console) {
		RegisterAllButtonActions();
	}
	OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget'} );
	
}