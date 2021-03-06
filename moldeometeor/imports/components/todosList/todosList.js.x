//import angular from 'angular';
require('angular');
//import angularMeteor from 'angular-meteor';
require('angular-meteor');
//import { Tasks } from '../../api/tasks.js';
require('../../api/tasks.js');
//import template from './todosList.html';
require('./todosList.html');

var RM_STATUS = 101;
var RM_SOUND = 1;
var RM_SPEAK = 31;
var RM_MOTOR = 41;

var MolduinoSyntax = {
  "sound": RM_SOUND,
  "speak": RM_SPEAK,
  "status": RM_STATUS,
  "motor": RM_MOTOR,
};


class TodosListCtrl {

  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      tasks() {
        //sorting = {};
        sorting = { sort: { createdAt: -1 } };
        return Tasks.find({}, sorting);
      }
    })
  }

  addTask(newTask) {
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
    };
    console.log( "new task command:", mobj );

    Tasks.insert(mobj);
    // Clear form
    this.newTask = '';
  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      },
    });
  }



  removeTask(task) {
    Tasks.remove(task._id);
  }

  processingTask(task) {
    //Tasks.find( { sort: { name: task } } );

    //command = parse( task.name );
    console.log("Processing command task: ", task);
    var shell_command = task.tcommand;

    console.log("Processing command task.tcommandid: ", task.tcommandid);
    switch(task.tcommandid) {

      case RM_STATUS:
        /// check in the server if the moldeoplayersdl2 process is running, return 1 (awake) or 0 (sleeping)
        console.log( "command was processed as RM_STATUS." );
        shell_command = "ps ax | grep -v grep | grep moldeoplayersdl2  | wc -l";
        Meteor.call("runCode", shell_command, function (err, response) {
          console.log(response);
        });
        break;

      case RM_SPEAK:
        /// speak some text  with espeak
        console.log( "command was processed as RM_SPEAK." );
        shell_command = task.text.replace("speak","espeak");
        Meteor.call("runCode", shell_command, function (err, response) {
          console.log(response);
        });
        break;

      case RM_SOUND:
        /// check in the server if the sound process is running
        console.log( "command was processed as RM_SOUND." );
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


//export default angular.module('todosList', [angularMeteor])
exports = angular.module('todosList', [angularMeteor])
.component('todosList',
                        {
                            templateUrl: 'imports/components/todosList/todosList.html',
                            controller: TodosListCtrl
                        }
          );

