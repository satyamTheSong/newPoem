var http = require('http');
var MongoClient = require('mongodb');
var url = "mongodb://localhost:27017/AngBoot";
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/',function(err,db){


// });
MongoClient.connect(url, function(err, db) {
 if (err) console.log(err);
 console.log(' connection est '+(db))
  db.collection('poemList').find().toArray(function(err, items) {});
   var stream = collection.find({mykey:{$ne:2}}).stream();
    stream.on("data", function(item) {});
    stream.on("end", function() {});
   console.log(item);
});