/*var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(9999, function(){
    console.log('Server running on 9999...');
});
*/

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
