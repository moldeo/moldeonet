var windowMap = {};
// exporting this function to access it from process.mainmodule.exports
exports.saveWindow = function(name, winObj){
    windowMap[name] = winObj;
};


var express =   require("express");
var url =   require("url");
var multer  =   require('multer');
var os = require('os');
var app         =   express();

var path = require('path');
var moment = require('moment');
//var gui = require('nw.gui');


var port_sync = 8001;


var moCI = {}
var projectdir = '/media/DATAY/LatirMoldeo/';
var projectlauncher = projectdir+'launch.sh';
var projectlauncherrecord = projectdir+'launchrecord.sh';
var uploadfolder = projectdir+'latidos';

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadfolder);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('file');

app.get('/',function(req,res){
  console.log( "__dirname: " + __dirname);
  //res.sendFile( __dirname + "/MoldeoSynchronizer.html");
  console.log(
    JSON.stringify(os.networkInterfaces() )
 ) ;
 var nifs = os.networkInterfaces();
 var candidates = {};
 for( var kinterface in nifs ) {
   var nif = nifs[kinterface];
   console.log("kinterface:" + kinterface)
   if (kinterface!="lo") {
     for( var objid in nif) {
       ni = nif[objid];
       if (ni["family"]=="IPv4") {
         console.log("Address:", ni["address"]);
         candidates[kinterface] = ni["address"];
       }
     }
   }
 }
BODY = "";
BODY+="Datos de sincronización: ";
for(var kin in candidates) {
   BODY+="Interfaz: "+ kin +" / ";
   BODY+="<strong>IP: "+candidates[kin]+" / ";
   BODY+=" PORT: "+port_sync+"</strong><br>";
 }
BODY+="<hr><br>";

  //console.log("win:", JSON.stringify(windowMap["win"]));
  //console.log("moCI:", JSON.stringify(windowMap["moCI"].config));
  moCI = windowMap["moCI"];

  moCI.fs.walk( uploadfolder, 0x0777, function( filepath, stat ) {
    console.log("walk call:", filepath);
    if (stat.isFile()) {
      //check if it's a .mol project
      //var extension = path.extname(filepath);
      filename = path.basename(filepath);
      BODY+= 'SESION: <a href="/api/launch?filepath='+filepath+'&filename='+filename+'" target="_blank">'+filepath+'</a><br>';
    }
  });

  res.send( '<html>'+
  '<head>'+
  '<title>Listado</title>'+
'<script src="config.js"></script>'+
'<script src="config.init.js"></script>'+
  '</head>'+
  '<body style="background-color:white;">' +
  BODY +
  '</body>'+
  '</html>' );
});

app.get('/api/launch',function(req,res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var launcher = projectlauncher;
  var launcherrecord = projectlauncherrecord;
  var filepath = query.filepath;
  var filename = query.filename;
  res.send( '<html><body style="background-color:white;">' +launcher +' ' + filepath+'</body></html>' );

  moCI.callProgram( '"'+launcher+'"', filepath, function(error,stdout,stderr) {
    console.log("::launch.sh > Calling callback for: filepath: ",filepath);
    if (error) {
      moCI.console.error(launcher, JSON.stringify(error));
    }
  } );

  moCI.callProgram( '"'+launcherrecord+'"', filename, function(error,stdout,stderr) {
    console.log("::launchrecord.sh > Calling callback for: filename: ",filename);
    if (error) {
      moCI.console.error(launcherrecord, JSON.stringify(error));
    }
  } );

});

app.post('/api/file',function(req,res){
  upload(req,res,function(err) {
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }

    res.end("File is uploaded");
  });
});

app.listen(port_sync,function(){
  console.log("Working on port "+port_sync);
});

/*var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(9999, function(){
    console.log('Server running on 9999...');
});
*/
/**
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const port = 9333

const requestHandler = function(request, response) {

  console.log('OPTIONS',request )
  console.log('URL',request.url)
  if (request.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = '/home/fabricio/Escritorio/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        response.write('File uploaded and moved!');
        response.end();
      });
    });

  } else if (request.url=="/") {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    response.write('<input type="file" name="filetoupload"><br>');
    response.write('<input type="submit">');
    response.write('</form>');
    return response.end();
  } else {
    response.end('Hello Node.js Server! ['+request.url+']')
  }

}

const server = http.createServer(requestHandler);

server.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
*/
