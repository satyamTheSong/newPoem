var express = require('express');
var app = express();
var cors = require('cors');
var fs = require("fs");
var filteredArray;
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded 
app.use(bodyParser.json({ extended: false }));
app.use(cors());
console.log (__dirname + '/poemAppAssest');
app.use(express.static(__dirname + '/poemAppAssest'));
app.get('/', function(req, res){
    res.end("Heroku");
})
app.post('/listPoems', function (req, res) {
    console.log(">>>>>>>> "+JSON.stringify(req.body));
  filteredArray = [];
   fs.readFile( "poemList.json", 'utf8', function (err, data) {
       //console.log( data );
       data = JSON.parse(data);
       if(req.body.name.length>0){
          for(var i=0; i<data.poems.length; i++){
              for(var j =0; j<req.body.name.length; j++){
                if(data.poems[i].poemCategory === req.body.name[j]){
                    filteredArray.push(data.poems[i]);
                }
              }
          }
          var response= {"response" : filteredArray};
          res.end(JSON.stringify(response));
       }else{
        for(var i=0; i<data.poems.length; i++){
            filteredArray.push(data.poems[i]);
          }
          var response= {"response" : filteredArray};
          res.end(JSON.stringify(response));
       }
   });
})
app.post('/updateFavorite', function (req, res) {
    console.log(">>>>>>>> "+JSON.stringify(req.body));
    filteredArray = [];
    fs.readFile( "poemList.json", 'utf8', function (err, data) {
       //console.log( data );
       data = JSON.parse(data);
       for(var i=0 ; i<data.poems.length; i++){
            if(data.poems[i].poemIndex == req.body.index){
                data.poems[i].isFavorite = req.body.isFavorite;
            }
            filteredArray.push(data.poems[i]);
       }
       data.poems = filteredArray;
       fs.writeFile( "poemList.json", JSON.stringify(data, null, "\t"), 'utf8', function (err) {
           var errorCode, errorMessage;
            if (err){ 
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            }else{
                errorCode = 0;
                errorMessage = "Data updated succefully";
            }
            var response = {"result":{
                "code":errorCode,
                "errorMessage": errorMessage
            }};
            setTimeout(function() {
                res.end(JSON.stringify(response));
            }, 1500);
       });
   });
   
})
app.post('/getPoemDetails', function (req, res) {
    console.log(">>>>>>>> "+JSON.stringify(req.body));
   fs.readFile( "poemList.json", 'utf8', function (err, data) {
       //console.log( data );
       var result ={
           "index":"",
           "poemDetail":"",
           "authorName" :"",
           "poemImage":"",
           "poemName":""
       };
        if (err){ 
                errorCode = 100;
                errorMessage = "Something went wrong";
                result ={
                    "index":"Not Available",
                    "poemDetail":"Not Available",
                    "authorName" :"Not Available",
                    "poemImage": "Lifetitle.jpg",
                    "poemName": "Not Available"
                }
        }else{
            data = JSON.parse(data);
            errorCode = 0;
            errorMessage = "Succesfully";
            for(var i=0 ; i<data.poems.length; i++){
                if(data.poems[i].poemIndex == req.body.index){
                    result.index = data.poems[i].poemIndex;
                    result.poemDetail = data.poems[i].poemDetail;
                    result.authorName = data.poems[i].poemAuthor;
                    result.poemImage = data.poems[i].poemImage;
                    result.poemName = data.poems[i].poemName;
                }
            }
        }
       var response = {"result":{
                "code":errorCode,
                "errorMessage": errorMessage,
                "result": result
            }};
          setTimeout(function() {
                res.end(JSON.stringify(response));
            }, 1500);
   });
})
app.post('/addPoem',express.bodyParser({limit:'100mb'}), function (req, res) {
    console.log(">>>>>>>> "+JSON.stringify(req.body));
    filteredArray = [];
    fs.readFile( "poemList.json", 'utf8', function (err, data) {
       data = JSON.parse(data);
       data.poems.push(req.body);
       fs.writeFile( "poemList.json", JSON.stringify(data, null, "\t"), 'utf8', function (err) {
           var errorCode, errorMessage;
            if (err){ 
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            }else{
                errorCode = 0;
                errorMessage = "Data updated succefully";
            }
            var response = {"result":{
                "code":errorCode,
                "errorMessage": errorMessage
            }};
            setTimeout(function() {
                res.end(JSON.stringify(response));
            }, 1500);
       });
   });
   
})
app.post('/deletePoem', function (req, res) {
    console.log(">>>>>>>> "+JSON.stringify(req.body));
    filteredArray = [];
    fs.readFile( "poemList.json", 'utf8', function (err, data) {
       //console.log( data );
       data = JSON.parse(data);
       // filteredArray.push(data.poems[i]);
       filteredArray = data.poems.filter((item) => item.poemIndex !== req.body.index);
       data.poems = filteredArray;
       fs.writeFile( "poemList.json", JSON.stringify(data, null, "\t"), 'utf8', function (err) {
           var errorCode, errorMessage;
            if (err){ 
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            }else{
                errorCode = 0;
                errorMessage = "Poem Deleted succefully";
            }
            var response = {"result":{
                "code":errorCode,
                "errorMessage": errorMessage
            }};
            setTimeout(function() {
                res.end(JSON.stringify(response));
            }, 1500);
       });
   });
   
})
var server = app.listen(process.env.PORT || 8081, '0.0.0.0', function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})