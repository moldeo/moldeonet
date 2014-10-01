/*
var combinationStates = {
	"fxselected",
	"object_enabled"
};

function recombineClasses( element ) {
	
	if (	classActivated("fxselected") 
			&&
			classActivated("object_enabled")) {
		activateClass("object_enabled_selected");
	}
}
*/
if (error==undefined) {
	function error(msg) {
		console.log("--ERROR-- " + msg );
	}
}

function activateClass( element, class_name, trigger_time, trigger_callback  ) {

	if (!element) return error("activateClass() > Element not defined: " + element + " class_name:" + class_name );

	var actual_class = element.getAttribute("class");
	
	if (actual_class) {
			var is_on = (actual_class.indexOf(class_name)>=0);
			if (!is_on) {
				element.setAttribute( "class", actual_class+" "+class_name );
			}
	} else element.setAttribute( "class", class_name );

	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}

function classActivated( element, class_name ) {
	if (!element) return error("classActivated() > Element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	var is_on = (actual_class.indexOf(class_name)>=0);
	return is_on;
}

function deactivateClass( element, class_name, trigger_time, trigger_callback  ) {
	if (!element) console.error("element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	if (actual_class) {
			var position = actual_class.indexOf(class_name);
			var is_on = (position>=0);
			if (is_on) {
				
				if (position==0)/*is first*/
						actual_class = actual_class.replace( new RegExp(class_name,"g"), "" );
				else 
				if( (position+class_name.length)==actual_class.length) /*is last*/
						actual_class = actual_class.replace( new RegExp(" "+class_name,"g"), "" );

				actual_class = actual_class.replace( new RegExp(" "+class_name+" ","g"), " " );				
				element.setAttribute( "class", actual_class );
				console.log( "actual_class: " + actual_class );
			}
	} else element.setAttribute( "class", class_name );
	
	if (trigger_callback) setTimeout( trigger_callback, trigger_time );
	
}



function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function rgbToHex2(rgb){
	return '#' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
