// public/core.js
var molduinoTasks = angular.module('molduinoTasks', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.formCode = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/tasks')
        .success(function(data) {
            $scope.tasks = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.executeAction = function(command) {


      if (command=='code-play') {
        /** send code, compile and run it*/
/**
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        window.alert(code);
        if (code!="") {
          editor.getSession().setValue(code);
        }
*/
        $scope.formCode.text = editor.getSession().getValue();
        console.log("code to be compiled and run in server:", $scope.formCode.text);

        $http.post('/api/code', { text: $scope.formCode.text } )
                .success(function(data) {
                    $scope.runresult = data;
                    console.log(data);


                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
      } else
      if (command=='code-debug') {

      } else
      if (command=='code-abort') {
        /** send code, compile and run it*/
        console.log("stop and abort any code running right now in server");

        $http.post('/api/code', { text: "Molduino.Loop = false;" } )
                .success(function(data) {
                    $scope.runresult = data;
                    console.log(data);


                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
      }
      else {
           $http.post('/api/tasks', { text: command } )
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.tasks = data;
                    console.log(data);


                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
      }
    };

    $scope.refreshpreviewcam = function() {
        var rid = Math.random();
        $("#previewcam").html('<img width="300" height="200" src="http://192.168.1.156:8080/?action=snapshot&id='+rid+'"/>');
    };

    // when submitting the add form, send the text to the node API
    $scope.createTask = function() {
        $http.post('/api/tasks', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.tasks = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTask = function(id) {
        $http.delete('/api/tasks/' + id)
            .success(function(data) {
                $scope.tasks = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // processing a task after checking it
    $scope.processingTask = function(task) {
        console.log("sending task",task);
        $http.post('/api/tasks/send', task )
            .success(function(data) {
                //$scope.tasks = data;
                $("#task_"+task._id+"_result").html(data);
                console.log(data);
            })
            .error(function(data) {
                $("#task_"+task._id+"_result").html(data);
                console.log('Error: ' + data);
            });
    };

}
