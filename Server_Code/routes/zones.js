///////////////////////////////////////////
//              MONGO                    //
///////////////////////////////////////////

//Mongo require
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));

// Connect to the db
mongoClient.open(function(err, mongoClient) {

  if(!err) {
    console.log("Connected to zones table");

    db = mongoClient.db('linux_lock');
    db.collection('zones', {strict:true}, function(err, collection){
        if(err){
            console.log("can't find zones table");
        }
    });

  } else {
    return console.dir(err);
  }
});

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('zones', function(err, collection) {
        if (name) {
            collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};

exports.findById = function(id, done) {
    var err;
    console.log('findZoneById: ' + email);
    db.collection('zones', function(err, collection) {
        collection.find({'_id': 'ObjectId("' + id + '")'}).toArray(function(err, items) {
            console.log(items);
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};