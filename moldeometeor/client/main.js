//import angular from 'angular';


//var angular = require('angular');

//import angularMeteor from 'angular-meteor';
//var angularMeteor = require('angular-meteor');
//import todosList from '../imports/components/todosList/todosList';
//var todosList = require('../imports/components/todosList/todosList');


var RM_SOUND = 1;
var RM_HELLO = 7;
var RM_I2CCHECK = 8;

var RM_SPEAK = 11;

var RM_MOTOR = 21;


var RM_STOP = 40;

var RM_ADVANCE = 41;
var RM_ADVANCE_SPEED = 42;

var RM_REVERSE = 43;
var RM_REVERSE_SPEED = 44;

var RM_TURN = 45;
var RM_TURN_SPEED = 46;

var RM_STATUS = 101;
var RM_PWD = 102;

//var moldeonetroot = "../../../../../../";
var moldeonetroot = "/home/pi/gst1/moldeoinstaller/moldeonet/";
var utilsroot = moldeonetroot+"utils/";
var molduinoroot = utilsroot+"molduino/"; 

var MolduinoSyntax = {
  "sound": RM_SOUND,
  "speak": RM_SPEAK,
  "hello": RM_HELLO,
  "status": RM_STATUS,
  "motor": RM_MOTOR,
  "pwd": RM_PWD,
  "advance": RM_ADVANCE,
  "advance-speed": RM_ADVANCE_SPEED,
  "reverse": RM_REVERSE,
  "reverse-speed": RM_REVERSE_SPEED,
  "turn": RM_TURN,
  "turn-speed": RM_TURN_SPEED,
  "stop": RM_STOP,
  "i2ccheck": RM_I2CCHECK,
};

angular.module('robot-molduino', ['angular-meteor']);

var cur = angular.module('robot-molduino').directive( 'controlsList',
	function () {

		return {
			//$scope.viewModel(this);
			restrict: 'E',
			templateUrl: 'imports/components/controlsList/controls-list.html',
			/*template: '',*/
			controllerAs: 'controlsList',
			controller: function ( $scope, $reactive ) {
			
				$reactive(this).attach($scope);
				
				this.helpers({
					controls: () => {
						return [
							{ 
								'name': 'buttonadvance', 
								'label': 'Advance',
								'task': 'advance-speed 50',
								'class': 'glyphicon-arrow-up',  
							},
							{ 
								'name': 'buttonreverse',
								'label': 'Reverse',
								'task': 'reverse-speed 50',
								'class': 'glyphicon-arrow-down',
							},
							{ 
								'name': 'buttonturnleft',
								'label': 'Turn Left', 
								'task': 'turn-speed 50',  
								'class': 'glyphicon-arrow-left',
							},
							{ 
								'name': 'buttonturnright',
								'label': 'Turn Right',
								'task': 'turn-speed -50',
								'class': 'glyphicon-arrow-right',
 
							},
							];
					},
				});

				this.clickControl = (control) => {
					console.log("clicked control: ",control.name,control.task);
				};
			}
		}
	}
);

var dir = angular.module('robot-molduino').directive( 'todosList',
	function () {

		return {
			//$scope.viewModel(this);
			restrict: 'E',
			templateUrl: 'imports/components/todosList/todos-list.html',
			/*template: '',*/
			controllerAs: 'todosList',
			controller: function ( $scope, $reactive ) {
			
				$reactive(this).attach($scope);
				
				this.helpers({
					tasks: () => {
						//sorting = {};
						//sorting = { sort: { createdAt: -1 } };
						return Tasks.find();
					}
				});

				setChecked = (task) => {
					// Set the checked property to the opposite of its current value
					Tasks.update(task._id, {
						$set: {
							checked: !task.checked
						},
					});
  				};

				this.removeTask = (task) => {
				    Tasks.remove( { _id: task._id });
  				};


				this.addTask = (newTask) => {
				    // Insert a task into the collection
				
				    var codeLine = newTask;
				    var index = codeLine.indexOf(" ");
				    console.log( "new task shell_command index:", index );
				    var firstWord = codeLine;
				    if (index>=0) {
				      firstWord = codeLine.substr(0, index);
				      tshell_command = firstWord;
				    } else tshell_command = newTask;
				
				
				    console.log( "new task shell_command:", tshell_command );
				
				    ///PARSE TASK
				    cid = MolduinoSyntax[ tshell_command ];
				
				    var mobj = {
				      text: newTask,
				      tcommand: tshell_command,
				      tcommandid: cid,
				      createdAt: new Date,
				      status: false,
				      checked: false,
				    };
				    console.log( "new task command:", mobj );
				
				    Tasks.insert(mobj);
				    // Clear form
				    this.newTask = '';
  				};


				this.processingTask = (task) => {


				    console.log("Processing command task: ", task);
				    $("#result_"+task._id).html("RES: procesando...");

				    var shell_command = task.tcommand;
				
				    console.log("Processing command task.tcommandid: ", task.tcommandid);
				    switch(task.tcommandid) {
				
				      case RM_STATUS:
				        /// check in the server if the moldeoplayersdl2 process is running, return 1 (awake) or 0 (sleeping)
				        console.log( "command was processed as RM_STATUS." );
				        shell_command = "ps ax | grep -v grep | grep moldeoplayersdl2  | wc -l";
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response==1) response = "AWAKE"; else response = "ASLEEP";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;
				
				      case RM_SPEAK:
				        /// speak some text  with espeak
				        console.log( "command was processed as RM_SPEAK." );
				        shell_command = task.text.replace("speak","pico2wave -l es-ES -w testpicospeak.wav ") + " && aplay testpicospeak.wav";
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;
				
				      case RM_SOUND:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_SOUND." );
					shell_command = task.text.replace("sound","pwd");
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;
				
				      case RM_HELLO:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_HELLO." );
					shell_command = utilsroot+"hello.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_STOP:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_STOP." );
					shell_command = molduinoroot+"stop.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_ADVANCE:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_ADVANCE." );
					shell_command = molduinoroot+"advance.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_ADVANCE_SPEED:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_ADVANCE_SPEED." );
					shell_command = task.text.replace( "advance-speed", molduinoroot + "advance-speed.sh " );
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_REVERSE:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_REVERSE." );
					shell_command = molduinoroot+"reverse.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_REVERSE_SPEED:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_REVERSE_SPEED." );
					shell_command = task.text.replace( "reverse-speed", molduinoroot + "reverse-speed.sh " );
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_TURN:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_TURN." );
					shell_command = molduinoroot+"turn.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_I2CCHECK:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_I2CCHECK." );
					shell_command = molduinoroot+"i2ccheck.sh";
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_TURN_SPEED:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_TURN_SPEED." );
					shell_command = task.text.replace( "turn-speed", molduinoroot + "turn-speed.sh " );
					console.log( "shell_command:", shell_command );
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_PWD:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_PWD." );
					shell_command = "pwd";
				        Meteor.call("runCode", shell_command, function (err, response) {
				          console.log(response);
					  if (response=="") response = "ok";
					  $("#result_"+task._id).html("RES: "+response);
				        });
				        break;

				      case RM_MOTOR:
				        /// check in the server if the sound process is running
				        console.log( "command was processed as RM_MOTOR." );

				        break;
				
				      default:
				        break;
				/*
				      "facedetection"
				        break;
				
				      "facerecognition"
				        break;
				
				      ""
				        break;
				
				      "sound":
				        //execute shell command:
				
				        break;
				
				      "speak":
				        ///call espeak or tts
				        //
				        break;
				
				      "turn":
				        break;
				
				      "forward":
				        break;
				
				      "reverse":
				        break;
				*/
				    }
				
				  }




			}
		}
		
	  }
);


