/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


var allRecentMessages = {};
allRecentMessages['results'] = [];

var requestHandler = function(request, response) {
 
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

//DEFAULT HEADERS
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  var statusCode = 200;

//UKNOWN ENDPOINT - STATUS CODE 404
  if (request.url !== '/classes/messages') {
    response.statusCode = 404;
    response.statusMessage = 'Not found';
    response.writeHead(404, headers);
    // response.write('error 404');
    response.end('error 404');

//POST REQUEST - STATUS CODE 201
  } else if (request.method === 'POST') {

    var allData = '';
    request.on('data', function(chunk) {
      allData += chunk;
    });
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('end', function() {
      allRecentMessages.results.push(JSON.parse(allData));
    });
    response.end('Successfully posted Data');

//GET REQUEST - STATUS CODE 200
  } else if (request.method === 'GET') {
    
    response.writeHead(200, headers);
    var chunk = JSON.stringify(allRecentMessages);
    response.end(chunk);

  } 

};



exports.requestHandler = requestHandler;
