var express = require('express');
var app = express();
var cors = require('cors');
var fs = require("fs");
var filteredArray = [];
var bodyParser = require('body-parser');

//MongoDb Vars
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://satyamPoem:27051990@ds125183.mlab.com:25183/poemdb';
var mongodb = '';

// Create the db connection
MongoClient.connect(url, { poolSize: 10},function(err, db) {  
    assert.equal(null, err);
    mongodb=db;
    }
);
//Get All poems for DB
var findPoems = function (db, req, callback) {
    filteredArray = [];
    var cursor = db.collection('poemList').find();
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            //console.dir(doc);
            if (req.body.name.length > 0) {
                for (var j = 0; j < req.body.name.length; j++) {
                    if (doc.poemCategory === req.body.name[j]) {
                        filteredArray.push(doc);
                    }
                }
            } else {
                filteredArray.push(doc);
            }
        } else {
            callback(filteredArray);
        }
    });
};
//This functions adds new poem to the DB
var addNewPoem= function (db, req, callback) {
    filteredArray = [];
    db.collection('poemList').insertOne(
        req.body, function (err, results) {
            //console.log(results);
            var errorCode, errorMessage;
            if (err) {
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            } else {
                errorCode = 0;
                errorMessage = "Data updated succefully";
            }
            var response = {
                "result": {
                    "code": errorCode,
                    "errorMessage": errorMessage
                }
            };
            callback(response);
        });
};
//Fetch all the favorite poems
var getFavoritePoems = function (db, req, callback) {
    filteredArray = [];
    var cursor = db.collection('poemList').find();
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            //console.dir(doc);
            if (doc.isFavorite) {
                filteredArray.push(doc);
            }
        } else {
            callback(filteredArray);
        }
    });
};
//This function toggle the poem favorite condition
//Fetch all the favorite poems
var updateFavorite = function (db, req, callback) {
    filteredArray = [];
    db.collection('poemList').updateOne(
        { "poemIndex": req.body.index.toString() },
        {
            $set: { "isFavorite": req.body.isFavorite },
        }, function (err, results) {
            //console.log(results);
            var errorCode, errorMessage;
            if (err) {
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            } else {
                errorCode = 0;
                errorMessage = "Data updated succefully";
            }
            var response = {
                "result": {
                    "code": errorCode,
                    "errorMessage": errorMessage
                }
            };
            callback(response);
        });
};
//Get Details of specific poem from DB
var getPoemDeatils = function (db, req, callback) {
    var result = {
        "index": "",
        "poemDetail": "",
        "authorName": "",
        "poemImage": "",
        "poemName": ""
    }, errorCode="", errorMessage="", response={};
    var cursor = db.collection('poemList').find({ "poemIndex": req.body.index.toString() });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            //console.dir(doc);
            errorCode = 0;
            errorMessage = "Succesfully";
            result.index = doc.poemIndex;
            result.poemDetail = doc.poemDetail;
            result.authorName = doc.poemAuthor;
            result.poemImage = doc.poemImage;
            result.poemName = doc.poemName;
            response = {"result":{
                "code":errorCode,
                "errorMessage": errorMessage,
                "result": result
            }};
        } else {
            callback(response);
        }
    });
};
//Delete spcific data from the poem
var deletePoem = function (db, req, callback) {
    filteredArray = [];
    db.collection('poemList').deleteOne(
        { "poemIndex": req.body.index.toString() }
        , function (err, results) {
            //console.log(results);
            var errorCode, errorMessage;
            if (err) {
                errorCode = 100;
                errorMessage = "Something went wrong";
                return console.log(err);
            } else {
                errorCode = 0;
                errorMessage = "Poem Deleted succefully";
            }
            var response = {
                "result": {
                    "code": errorCode,
                    "errorMessage": errorMessage
                }
            };
            callback(response);
        });
};
// parse application/x-www-form-urlencoded 
// app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: false,
    parameterLimit: 500000
}));
app.use(bodyParser());
console.log(__dirname + '/poemAppAssest');
app.use(express.static(__dirname + '/poemAppAssest'));
app.post('/listPoems', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
    //MongoClient.connect(url, function (err, db) {
      //  assert.equal(null, err);
        findPoems(mongodb, req, function (filteredArray) {
            var response = { "response": filteredArray };
            res.end(JSON.stringify(response));
            //db.close();
        });
    //});
})
app.post('/getFavorites', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
   // MongoClient.connect(url, function (err, db) {
     //   assert.equal(null, err);
        getFavoritePoems(mongodb, req, function (filteredArray) {
            var response = { "response": filteredArray };
            res.end(JSON.stringify(response));
            //db.close();
        });
    //});
})
app.post('/updateFavorite', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
    //MongoClient.connect(url, function (err, db) {
      //  assert.equal(null, err);
        updateFavorite(mongodb, req, function (response) {
            setTimeout(function () {
                res.end(JSON.stringify(response));
            }, 1500);
            //db.close();
        });
    //});
})
app.post('/getPoemDetails', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
    //MongoClient.connect(url, function (err, db) {
        //assert.equal(null, err);
        getPoemDeatils(mongodb, req, function (response) {
            setTimeout(function () {
                res.end(JSON.stringify(response));
            }, 1500);
            //db.close();
        //});
    });
})
app.post('/addPoem', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
   // MongoClient.connect(url, function (err, db) {
        //assert.equal(null, err);
        addNewPoem(mongodb, req, function (response) {
            setTimeout(function () {
                res.end(JSON.stringify(response));
            }, 1500);
            //db.close();
        //});
    });
})
app.post('/deletePoem', function (req, res) {
    console.log(">>>>>>>> " + JSON.stringify(req.body));
    //MongoClient.connect(url, function (err, db) {
        //assert.equal(null, err);
        deletePoem(mongodb, req, function (response) {
            setTimeout(function () {
                res.end(JSON.stringify(response));
            }, 1500);
            //db.close();
        //});
    });
})
var server = app.listen(process.env.PORT || 8081, '0.0.0.0', function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})