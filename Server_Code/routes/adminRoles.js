///////////////////////////////////////////
//              MONGO                    //
///////////////////////////////////////////

//Mongo require
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db, mongo = require('mongodb'), BSON = mongo.BSONPure;

var mongoClient = new MongoClient(new Server('localhost', 27017));

// Connect to the db
mongoClient.open(function(err, mongoClient) {

  if(!err) {
    console.log("Connected to adminRoles table");

    db = mongoClient.db('linux_lock');
    db.collection('adminRoles', {strict:true}, function(err, collection){
        if(err){
            console.log("can't find adminRoles table");
        }
    });

  } else {
    return console.dir(err);
  }
});

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('adminRoles', function(err, collection) {
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

exports.findByUserName = function(userName, done) {
    var err;
    console.log('findByUserName: ' + userName);
    db.collection('adminRoles', function(err, collection) {
        collection.find({'username': userName}).toArray(function(err, items) {
            if(!err){
                return done(null, items[0]);
            } else{ 
                return done(err, items[0]);
            }
        });
    });
};

exports.findById = function(id, done) {
    var err;
    console.log('findById: ' + id);
    var o_id = new BSON.ObjectID(id);
    db.collection('adminRoles', function(err, collection) {
        collection.find({'_id': o_id}).toArray(function(err, items) {
            if(!err){
                return done(null, items[0]);
            } else{ 
                return done(err, items[0]);
            }
        });
    });
};

exports.validPassword = function(username, password, done){
    console.log('validPassword: ' + password);
    db.collection('adminRoles', function(err, collection) {
        collection.find({'username': username}).toArray(function(err, items) {
            if(items[0].password === password){
                return done(true);
            } else{ 
                return done(null);
            }
        });
    });
};