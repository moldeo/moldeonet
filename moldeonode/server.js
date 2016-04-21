// server.js



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
    var RM_REBOOT = 103;
    var RM_SHUTDOWN = 104;
    var RM_FACEDETECTION = 105;

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
      "advance": RM_ADVANCE,
      "advance-speed": RM_ADVANCE_SPEED,
      "reverse": RM_REVERSE,
      "reverse-speed": RM_REVERSE_SPEED,
      "turn": RM_TURN,
      "turn-speed": RM_TURN_SPEED,
      "stop": RM_STOP,
      "i2ccheck": RM_I2CCHECK,
      "facedetection": RM_FACEDETECTION,
    };

 // define model =================
    var Task = mongoose.model('Task', {
        text: String,
        tcommand: String,
        tcommandid: Number,
        createdAt: Date,
        status: Boolean,
    });


    function processingTask(task, resultcallback ) {
        //Tasks.find( { sort: { name: task } } );

        //command = parse( task.name );
        console.log("Processing command task: ", task);
        var shell_command = task.tcommand;

        function execCode( command, callc ) {
            //this.unblock();
            //var future=new Future();
            //var command="pwd";
            exec( command,function(error,stdout,stderr){
                if(error){
                  console.log(error);
                  //throw new Meteor.Error(500,command+" failed");
                }
                //future.return(stdout.toString());
                callc( error, stdout.toString() );
            });
            //return future.wait();
        }

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

            case RM_TURN:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN." );
                shell_command = molduinoroot+"turn.sh";
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

            case RM_TURN_SPEED:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_TURN_SPEED." );
                shell_command = task.text.replace( "turn-speed", molduinoroot + "turn-speed.sh " );
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

            case RM_REBOOT:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REBOOT" );
                shell_command = "shutdown -r";
                execCode( shell_command, function(err,res) {
                  if (res=="") res = "ok";
                  resultcallback( err, res );
                } );
                break;

            case RM_SHUTDOWN:
                /// check in the server if the sound process is running
                console.log( "command was processed as RM_REBOOT" );
                shell_command = "shutdown";
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

        // create a todo, information comes from AJAX request from Angular
        Task.create( mobj, function(err, task) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Task.find(function(err, tasks) {
                if (err)
                    res.send(err)
                res.json(tasks);

            });

	    processingTask( task, function( err, result ) {
                //if (err)
                //    res.send(err)
                //else res.json(result);
            } );


        });

    });

// create todo and send back all tasks after creation
    app.post('/api/tasks/send', function(req, res) {

        console.log( "Sended req task:", req.body);
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

	console.log( "moldeosc:",msg );
	var  moldeoapimessage = msg[2];
	var moldeo_message = {};

	if (moldeoapimessage[1]=="opencv") {
	   io.emit('moldeosc',moldeoapimessage);
	}

} );


    console.log("App listening on port 8010");



