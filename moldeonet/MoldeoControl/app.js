

window.onfocus = function() { 
  console.log("focus");
}

window.onblur = function() { 
  console.log("blur");
}

window.onresize = function() {
}

window.onload = function() {
  
  document.getElementById("close-window-button").onclick = function() {
    window.close();
  }
  
  gui.Window.get().show();
  RegisterAllButtonActions();
}