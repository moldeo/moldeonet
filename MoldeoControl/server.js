var express =   require("express");
var multer  =   require('multer');
var app         =   express();

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('file');

app.get('/',function(req,res){
  res.sendFile(__dirname + "/MoldeoSynchronizer.html");
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

app.listen(3000,function(){
  console.log("Working on port 3000");
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
