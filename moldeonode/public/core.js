// public/core.js
var molduinoTasks = angular.module('molduinoTasks', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.formProgram = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/tasks')
        .success(function(data) {
            $scope.tasks = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/programs')
        .success(function(data) {
            $scope.programs = data;
            //JSON.parse(data);
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.executeAction = function(command,parameter) {

      if (command=='cleanchat') {
        console.log("cleanchat");
        $http.delete('/api/cleantasks' )
                .success(function(data) {
                    //$scope.runresult = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
      } else
      if (command=='program-play') {
        /** send code, compile and run it*/
/**
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        window.alert(code);
        if (code!="") {
          editor.getSession().setValue(code);
        }
*/
        //$scope.formCode.text =
        //alert("Playing: " + editor.getSession().getValue() );
        //$scope.formCode.text
        $scope.code = editor.getSession().getValue();
        console.log( "code to be compiled and run in server:",  $scope.code );

        $http.post('/api/program/run', { text:  $scope.code } )
                .success(function(data) {
                    //$scope.runresult = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

      } else if (command=='program-load') {
                //$("#selprogram").attr("idp", data._id );
                //$("#selprogram").html( data.name );
                console.log( "exec program-load", parameter );
                editor.getSession().setValue( parameter );

      } else
      if (command=='program-save') {

        var mobj = {
                    id: $("#selprogram").attr("idp"),
                    text: editor.getSession().getValue()
                  };

        console.log("program-save", mobj );


        $http.post('/api/programs/save', mobj )
                .success(function(data) {
                    //$scope.runresult = data;
                    console.log("success save:", data);
                })
                .error(function(data) {
                    console.log('Error saving: ' + data);
                });

      } else
      if (command=='program-debug') {

      } else
      if (command=='program-abort') {
        /** send code, compile and run it*/
        console.log("stop and abort any code running right now in server");

        $http.post('/api/program/run', { text: "Molduino.Loop = false;" } )
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
        createImageLayer();
    };

    $scope.refreshprogram = function() {
        editor.getSession().setValue( document.getElementById("lastcode").value );
    };

    // when submitting the add form, send the text to the node API
    $scope.createProgram = function() {
        console.log("scope.formProgram:",$scope.formProgram);
        $http.post('/api/programs', $scope.formProgram )
            .success(function(data) {
                //$scope.formProgram = {}; // clear the form so our user is ready to enter another
                $scope.programs = data;
                console.log("success! data:", data, $scope.formProgram);
                $("#selprogram").html($scope.formProgram.name);
                $("#selprogram").attr('idp', data[data.length-1]._id );
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.loadProgram = function(program) {
        $http.post('/api/programs/load', program )
            .success(function(data) {
                //$scope.formProgram = {}; // clear the form so our user is ready to enter another
                //$scope.programs = data;
                console.log("load program: data:", data);
                $("#selprogram").attr("idp", data._id );
                $("#selprogram").html( data.name );
                $scope.executeAction('program-load',data.text)
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteProgram = function(id) {
        $http.delete('/api/programs/' + id)
            .success(function(data) {
                $scope.programs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
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

    // delete a todo after checking it
    $scope.deleteAllTasks = function(id) {
        $http.delete('/api/cleantasks')
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
