var express = require('express');
//var server = express.createServer();
// express.createServer()  is deprecated. 
var server = express(); // better instead
server.configure(function(){
  server.use(express.static(__dirname + '/poemAppAssest'));
});
server.listen(3000);