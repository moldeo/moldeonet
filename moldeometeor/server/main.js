/*
import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
*/

//require('../imports/api/tasks.js');
//import Tasks from '../imports/api/tasks.js';

Meteor.startup(() => {
  // code to run on server at startup

  if (Tasks.find().count() === 0) { 
    var tasks = [
	{
	'text': "comando 1",
	'checked': "off",
	},
	{
	'text': "comando 2",
	'checked': "on",
	},
    ];

    for( var i=0; i<tasks.length; i++) {
      Tasks.insert( tasks[i] );
    }
    console.log("We have started with two tasks!");
  } else console.log("We have tasks!");

// Load future from fibers
  var Future = Npm.require("fibers/future");
  // Load exec
  var exec = Npm.require("child_process").exec;

  // Server methods
  Meteor.methods({
    runCode: function ( command ) {
      // This method call won't return immediately, it will wait for the
      // asynchronous code to finish, so we call unblock to allow this client
      // to queue other method calls (see Meteor docs)
      this.unblock();
      var future=new Future();
      //var command="pwd";
      exec(command,function(error,stdout,stderr){
        if(error){
          console.log(error);
          //throw new Meteor.Error(500,command+" failed");
	  return future.return(command+" failed");
        }
        future.return(stdout.toString());
      });
      return future.wait();
    }
  });

});


