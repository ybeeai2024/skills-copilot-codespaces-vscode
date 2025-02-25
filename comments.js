   // Create web server
   var http = require('http');
   var fs = require('fs');
   var url = require('url');
   var path = require('path');
   var comments = require('./comments.json');
   var qs = require('querystring');
   var server = http.createServer(function(req, res) {
       var urlParts = url.parse(req.url);
       if(urlParts.pathname == '/' && req.method == 'GET') {
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.write('<!DOCTYPE html>\n<html>\n<body>\n');
           res.write('<form method="POST" action="/comment">\n');
           res.write('<input type="text" name="comment" />\n');
           res.write('<input type="submit" value="Submit" />\n');
           res.write('</form>\n');
           res.write('<ul>\n');
           comments.forEach(function(comment) {
               res.write('<li>' + comment + '</li>\n');
           });
           res.write('</ul>\n');
           res.write('</body>\n</html>\n');
           res.end();
       } else if(urlParts.pathname == '/comment' && req.method == 'POST') {
           var body = '';
           req.on('data', function(data) {
               body += data;
           });
           req.on('end', function() {
               var comment = qs.parse(body).comment;
               comments.push(comment);
               fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
                   if(err) {
                       console.error('Error writing to file');
                   }
               });
               res.writeHead(302, {'Location': '/'});
               res.end();
           });
       } else {
           res.writeHead(404, {'Content-Type': 'text/plain'});
           res.write('404 Not Found\n');
           res.end();
       }
   });
   server.listen(8000, function() {
       console.log('Server listening on port 8000');
   });
   // End of comments.js