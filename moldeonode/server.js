// server.js



    var os = require('os');
    var ifaces = os.networkInterfaces();

    // set up ========================
    var exec = require('child_process').exec;

    var parseArgs = require('minimist')
    var Fiber = require('fibers');
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var Mongo = require('mongodb');                     // mongoose for mongodb
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);
    // configuration =================

    //Tasks = new Mongo.Collection("tasks");
    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
    mongoose.connect('mongodb://localhost/tasks');

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    io.on('connection', function(socket) {

      socket.on('set nickname', function(nickname) {
        socket.nickname = nickname;
        console.log("Just connected:",nickname);
      });

      socket.on('msg', function(msg) {
        socket.msg = msg;
        io.emit('response',msg);
      });

    });

    var argv = parseArgs(process.argv.slice(2));
    console.dir(argv);

    var sudopass = '';
    var RM_SOUND = 1;
    var RM_HELLO = 7;
    var RM_I2CCHECK = 8;

    var RM_SPEAK = 11;

    var RM_MOTOR = 21;

    var RM_STOP_ALL = 39;
    var RM_STOP = 40;

    var RM_ADVANCE = 41;
    var RM_ADVANCE_SPEED = 42;

    var RM_REVERSE = 43;
    var RM_REVERSE_SPEED = 44;

    var RM_TURN_LEFT = 45;
    var RM_TURN_LEFT_SPEED = 46;
    var RM_TURN_RIGHT = 47;
    var RM_TURN_RIGHT_SPEED = 48;

    var RM_SUDOPASS = 100;
    var RM_STATUS = 101;
    var RM_PWD = 102;
    var RM_REBOOT = 103;
    var RM_SHUTDOWN = 104;
    var RM_FACEDETECTION = 105;
    var RM_STOPFACEDETECTION = 106;
    var RM_BODYDETECTION = 107;

    var RM_LINEFOLLOWER = 108;
    var RM_COLLISIONDETECTION = 109;
    //var moldeonetroot = "../../../../../../";
    var moldeonetroot = "/home/pi/moldeoinstaller/moldeonet/";
    var utilsroot = moldeonetroot+"utils/";
    var molduinoroot = utilsroot+"molduino/";

    var MolduinoSyntax = {
      "sound": RM_SOUND,
      "speak": RM_SPEAK,
      "hello": RM_HELLO,
      "reboot": RM_REBOOT,
      "shutdown": RM_SHUTDOWN,
      "status": RM_STATUS,
      "motor": RM_MOTOR,
      "pwd": RM_PWD,
      "sudopass": RM_SUDOPASS,
      "advance": RM_ADVANCE,
      "advance-speed": RM_ADVANCE_SPEED,
      "reverse": RM_REVERSE,
      "reverse-speed": RM_REVERSE_SPEED,
      "turn-left": RM_TURN_LEFT,
      "turn-left-speed": RM_TURN_LEFT_SPEED,
      "turn-right": RM_TURN_RIGHT,
      "turn-right-speed": RM_TURN_RIGHT_SPEED,
      "stop": RM_STOP,
      "stopall": RM_STOP_ALL,
      "i2ccheck": RM_I2CCHECK,
      "facedetection": RM_FACEDETECTION,
      "stopfacedetection": RM_STOPFACEDETECTION,
      "bodydetection": RM_BODYDETECTION,
      "linefollower": RM_LINEFOLLOWER,
      "collisiondetection": RM_COLLISIONDETECTION,
    };

    function execCode( command, callc ) {
        //this.unblock();
        //var future=new Future();
        //var command="pwd";
        exec( command, function(error,stdout,stderr){
            if(error){
              console.log(error);
              //throw new Meteor.Error(500,command+" failed");
            }
            //future.return(stdout.toString());
            callc( error, stdout.toString() );
        });
        //return future.wait();
    }

    var MOLDEOAPIMESSAGES = {
      "FACE_DETECTION": false,
      "BODY_DETECTION": false,
      "MOTION_DETECTION": false,
      "FACE_RECOGNITION": false,
    };


    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

    function delay( delay_interval ) {
      Molduino.options.delay = delay_interval;
      if (Molduino.options.idinterval) clearInterval( Molduino.options.idinterval );
      Molduino.options.idinterval = setInterval( codeInterval, Molduino.options.delay );
    }

    var mconsole = {
      "log": function(msg) {
        Molduino.log(msg);
      },
      "error": function(msg) {
        Molduino.error(msg);
      },
      "clearlog": function() {
        Molduino.clearlog();
      }
    };

    var Molduino = {
      "options": {
        "idinterval": false,
        "delay": 100,
        "lastcode": false,
      },
      "log": function( msg ) {
        console.log(msg);
        io.emit('log', msg );
      },
      "error": function( msg ) {
        console.error(msg);
        io.emit('error', msg );
      },
      "clearlog": function() {
        io.emit('clearlog', "" );
      },
      "hello": function(  apiresultcallback ) {
          console.log( "Molduino::hello" );
          shell_command = utilsroot+"hello.sh";
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "hello2": function(  apiresultcallback ) {
          console.log( "Molduino::hello2" );
          shell_command = utilsroot+"hello2.sh";
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "speak": function( text_to_speech, apiresultcallback ) {
          console.log("Molduino::speak",text_to_speech);
          shell_command = "pico2wave -l es-ES -w testpicospeak.wav \""+ text_to_speech +"\" && aplay testpicospeak.wav";
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "loop": false,
      "stop": function( apiresultcallback ) {
        shell_command = molduinoroot+"stop.sh";
        execCode( shell_command, function(err,res) {
          if (res=="") res = "ok";
          if (apiresultcallback) apiresultcallback( err, res );
        } );
      },
      "stopall": function( apiresultcallback ) {
        shell_command = molduinoroot+"stopall.sh";
        execCode( shell_command, function(err,res) {
          if (res=="") res = "ok";
          if (apiresultcallback) apiresultcallback( err, res );
        } );
      },
      "turnleftspeed": function( turn_speed, apiresultcallback ) {
          console.log("Molduino::turnleftspeed", turn_speed );
          shell_command = molduinoroot + "turn-left-speed.sh "+turn_speed;
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "turnrightspeed": function( turn_speed, apiresultcallback ) {
          console.log("Molduino::turnrightspeed", turn_speed );
          shell_command = molduinoroot + "turn-right-speed.sh "+turn_speed;
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "advancespeed": function( advance_speed, apiresultcallback ) {
          console.log("Molduino::advancespeed", advance_speed );
          shell_command = molduinoroot + "advance-speed.sh "+advance_speed;
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "reversespeed": function( reverse_speed, apiresultcallback ) {
          console.log("Molduino::reversespeed", reverse_speed );
          shell_command = molduinoroot + "reverse-speed.sh "+reverse_speed;
          execCode( shell_command, function(err,res) {
            if (res=="") res = "ok";
            if (apiresultcallback) apiresultcallback( err, res );
          } );
      },
      "FaceDetection": function(apiresultcallback) {
        ///if not started, start face detection
        return (MOLDEOAPIMESSAGES["FACE_DETECTION"]);
      },
      "BodyDetection": function(apiresultcallback) {
        return (MOLDEOAPIMESSAGES["BODY_DETECTION"]);
      },
      "MotionDetection": function(apiresultcallback) {
        return (MOLDEOAPIMESSAGES["MOTION_DETECTION"]);
      },
      "FaceRecognition": function(apiresultcallback) {
        return (MOLDEOAPIMESSAGES["FACE_RECOGNITION"]);
      },
      "LineFollower": function(apiresultcallback) {
        //return (MOLDEOAPIMESSAGES["FACE_RECOGNITION"]);
      },
      "CollisionDetection": function(apiresultcallback) {
        //return (MOLDEOAPIMESSAGES["FACE_RECOGNITION"]);
      },
    };



 // define model =================
    var Task = mongoose.model('Task', {
        text: String,
        tcommand: String,
        tcommandid: Number,
        createdAt: Date,
        status: Boolean,
    });

    var Program = mongoose.model('Program', {
        name: String,
        text: String,
        createdAt: Date,
        status: Boolean,
    });


    function processingTask(task, resultcallback ) {
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
                execCode( shell_command, resultcallback );
                break;

            case RM_SPEAK:
                /// speak some text  with espeak
                console.log( "command was processed as RM_SPEAK." );
                shell_command = task.text.replace("speak","pico2wave -l es-ES -w testpicospeak.wav ") + " && aplay testpicospeak.wav";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_SOUND:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_SOUND." );
                shell_command = task.text.replace("sound","pwd");
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_HELLO:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_HELLO." );
                shell_command = utilsroot+"hello.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_STOP:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_STOP." );
                shell_command = molduinoroot+"stop.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_STOP_ALL:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_STOP_ALL." );
                shell_command = molduinoroot+"stopall.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_ADVANCE:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_ADVANCE." );
                shell_command = molduinoroot+"advance.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_ADVANCE_SPEED:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_ADVANCE_SPEED." );
                shell_command = task.text.replace( "advance-speed", molduinoroot + "advance-speed.sh " );
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_REVERSE:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REVERSE." );
                shell_command = molduinoroot+"reverse.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_REVERSE_SPEED:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REVERSE_SPEED." );
                shell_command = task.text.replace( "reverse-speed", molduinoroot + "reverse-speed.sh " );
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_TURN_LEFT:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN_LEFT." );
                shell_command = molduinoroot+"turn-left.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;
            case RM_TURN_RIGHT:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN_RIGHT." );
                shell_command = molduinoroot+"turn-right.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_I2CCHECK:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_I2CCHECK." );
                shell_command = molduinoroot+"i2ccheck.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_TURN_LEFT_SPEED:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN_LEFT_SPEED." );
                shell_command = task.text.replace( "turn-left-speed", molduinoroot + "turn-left-speed.sh " );
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;
            case RM_TURN_RIGHT_SPEED:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN_RIGHT_SPEED." );
                shell_command = task.text.replace( "turn-right-speed", molduinoroot + "turn-right-speed.sh " );
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_LINEFOLLOWER:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REBOOT" );
                shell_command = task.text.replace( "linefollower", molduinoroot + "linefollower.sh " );
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_PWD:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_PWD." );
                shell_command = "pwd";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_MOTOR:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_MOTOR." );
                break;


            case RM_FACEDETECTION:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_FACEDETECTION." );
                shell_command = utilsroot + "start_facedetection.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_STOPFACEDETECTION:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_STOPFACEDETECTION." );
                shell_command = utilsroot + "stop_facedetection.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_BODYDETECTION:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_BODYDETECTION." );
                shell_command = utilsroot + "start_bodydetection.sh";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_SUDOPASS:
                console.log( "command was processed as RM_SUDOPASS" );
                sudopass = task.text.replace("sudopass","").trim().replace('\"','');
                err = "";
                if (sudopass!="") err = "";
                else err = "sudo password undefined!";
                resultcallback( err, "sudopass received as:["+sudopass+"]" );
                break;

            case RM_REBOOT:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REBOOT" );
                shell_command = 'echo "'+sudopass+'" | sudo -S shutdown -r';
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_SHUTDOWN:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_SHUTDOWN" );
                shell_command = 'echo "'+sudopass+'" | sudo -S shutdown -h';
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            default:
                break;
        }

      }


// routes ======================================================================


    // api ---------------------------------------------------------------------

    function codeInterval() {

        if ( Molduino.Loop && ( typeof Molduino.Loop ) == "function" ) {
            try {
              Molduino.Loop();
            } catch( allerrors ) {
              io.emit("error", "Loop ERROR:" + allerrors );
              Molduino.Loop = false;
            }
        }

    }

    //coding
    app.post('/api/program/run', function(req, res) {
        if (req.body.text==undefined) {
            res.send("ERROR");
        }
        if (req.body.text.trim()!="")
        try {
          console.log("code received:", req.body.text );
          Molduino.options.lastcode = req.body.text;
          result = eval(req.body.text);
          console.log("code result:", result );
          res.json(result);

          clearInterval( Molduino.options.idinterval );
          Molduino.options.idinterval = setInterval( codeInterval, Molduino.options.delay );

        } catch(err) {
          console.log("ERROR:", err );

          io.emit("error", "ERROR:" + err );
          if (err)
                res.send(err)


        }


    });


//Molduino.options.lastcode


    // get all tasks
    app.get('/api/program', function(req, res) {

        //res.json( Molduino.options.lastcode );
        // use mongoose to get all todos in the database
        Program.find(function(err, programs ) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(programs); // return all todos in JSON format
        });
    });


    // get all tasks
    app.get('/api/tasks', function(req, res) {

        // use mongoose to get all todos in the database
        Task.find(function(err, tasks) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(tasks); // return all todos in JSON format
        });
    });

    // get all tasks
    app.get('/api/programs', function(req, res) {

        // use mongoose to get all todos in the database
        Program.find(function(err, programs) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(programs); // return all todos in JSON format
        });
    });

    // create todo and send back all tasks after creation
    app.post('/api/tasks', function(req, res) {

        console.log( "req:",req );
        var newTask = req.body.text;

        var codeLine = newTask;
        var index = codeLine.indexOf(" ");
        console.log( "new task shell_command index:", index );
        var firstWord = codeLine;
        if (index>=0) {
          firstWord = codeLine.substr(0, index);
          tshell_command = firstWord;
        } else tshell_command = newTask;


        console.log( "new task shell_command: ["+tshell_command+"]" );

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

        // create a todo, information comes from AJAX request from Angular
        Task.create( mobj, function(err, task) {
            if (err)
                res.send(err);

            processingTask( task, function( err, result ) {
                if (err) {
                  //res.send(err)
                } else {
                  //res.json(result);
                  //get and return all the todos after you create another
                }
            } );

            Task.find(function(err, tasks) {
                if (err)
                    res.send(err)
                res.json(tasks);

            });



        });

    });

// create todo and send back all tasks after creation
    app.post('/api/programs', function(req, res) {

        console.log( "req:",req );
        var programName = req.body.name || "noname";
        var programCode = req.body.text || "";

        var mobj = {
          name: programName,
          text: programCode,
          createdAt: new Date,
          status: false,
        };
        console.log( "new program command:", mobj );

        // create a todo, information comes from AJAX request from Angular
        Program.create( mobj, function( err, program ) {
            if (err)
                res.send(err);

            Program.find(function(err, programs) {
                if (err)
                    res.send(err)
                res.json(programs);

            });

        });

    });


//load program
    app.post('/api/programs/load', function(req, res) {

        console.log( "Load req program:", req);
        if (req.body) {
            //program = req.body;
            console.log("loading program:", req.body._id );
            /*
            processingTask( task, function( err, result ) {
                if (err)
                    res.send(err)
                else res.json(result);
            } );
            */
            Program.findById( req.body._id, function(err, program ) {
                if (err)
                    res.send(err)

                res.json(program);
            });

            /*
            Program.find({ _id : req.params.program_id }, function(err, programs) {
                if (err)
                    res.send(err)
                res.json(programs);
            });
            */
        }
    });

        app.post('/api/programs/save', function(req, res) {

        console.log( "Save program:", req);
        if (req.body) {
            //program = req.body;
            console.log("Saving program:", req.body.id );
            /*
            processingTask( task, function( err, result ) {
                if (err)
                    res.send(err)
                else res.json(result);
            } );
            */
            //res.json(req.body);

            Program.findById( req.body.id, function(err, program ) {
                if (err)
                    res.send(err)
                else
                if (req.body==undefined || program==undefined) res.send("error");
                else {
                    program.text = req.body.text;
                    program.save( function(err2 ) {
                      if (err2)
                              res.send(err2)
                      else console.log("SAVED!", res);
                        Program.find( function(err3, programs) {
                            if (err3)
                                res.send(err3)
                            console.log("programs:",programs);
                            res.json(programs);
                        });
                    } );
                }
            });

        }
    });



// create todo and send back all tasks after creation
    app.post('/api/tasks/send', function(req, res) {

        console.log( "Sended req program:", req.body);
        if (req.body.text) {
            task = req.body;

            processingTask( task, function( err, result ) {
                if (err)
                    res.send(err)
                else res.json(result);
            } );

        }
    });

    // delete a task
    app.delete('/api/tasks/:task_id', function(req, res) {
        Task.remove({
            _id : req.params.task_id
        }, function(err, task) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Task.find(function(err, tasks) {
                if (err)
                    res.send(err)
                res.json(tasks);
            });
        });
    });

    // delete all tasks
    app.delete('/api/cleantasks', function(req, res) {
        Task.remove({}, function(err, task) {
            if (err)
                res.send(err);

            // get and return all the todos after you delete another
            Task.find(function(err, tasks) {
                if (err)
                    res.send(err)
                res.json(tasks);
            });
        });
    });

    // delete a program
    app.delete('/api/programs/:program_id', function(req, res) {
        Program.remove({
            _id : req.params.program_id
        }, function(err, program) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Program.find(function(err, programs) {
                if (err)
                    res.send(err)
                res.json(programs);
            });
        });
    });

    app.get('/', function(req, res) {
        res.sendFile('/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    // listen (start app with node server.js) ======================================
    //app.listen(8010);
    server.listen(8010);


var osc = require('node-osc');
//var ioserver = require('socket.io').listen(8081);
var oscServer, oscClient;
var configOsc = {
	/*listen to*/
	server: {
		port: 53335,
		host: '127.0.0.1'
	},

	/**speak to */
	client: {
		port: 53334,
		host: '127.0.0.1'
	}
};



oscServer = new osc.Server( configOsc.server.port, configOsc.server.host);
oscClient = new osc.Client( configOsc.client.host, configOsc.client.port);
oscServer.on('message', function(msg, rinfo) {

	//console.log( "moldeosc:",msg );
	var  moldeoapimessage = msg[2];
	var moldeo_message = {};

	if ( moldeoapimessage[1] == "opencv" ) {

     if (moldeoapimessage[2]=="FACE_DETECTION" && moldeoapimessage[3]>=1 ) {
          MOLDEOAPIMESSAGES["FACE_DETECTION"] = {
                                                    x: moldeoapimessage[5].toFixed(4),
                                                    y: moldeoapimessage[7].toFixed(4),
                                                    w: moldeoapimessage[9].toFixed(4),
                                                    h: moldeoapimessage[11].toFixed(4)
                                                };
          io.emit('FACE_DETECTION', JSON.stringify( MOLDEOAPIMESSAGES["FACE_DETECTION"] ) );
     } else {
          MOLDEOAPIMESSAGES["FACE_DETECTION"] = false;
     }

     if (moldeoapimessage[2]=="BODY_DETECTIONS" ) {

          MOLDEOAPIMESSAGES["BODY_DETECTION"] = moldeoapimessage[3];/**array of bodies*/

          io.emit('BODY_DETECTION', JSON.stringify( MOLDEOAPIMESSAGES["BODY_DETECTION"] ) );
     } else {
          MOLDEOAPIMESSAGES["BODY_DETECTION"] = false;
     }



	}

} );


    console.log("App listening on port 8010");



