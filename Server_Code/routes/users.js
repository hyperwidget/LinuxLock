///////////////////////////////////////////
//              MONGO                    //
///////////////////////////////////////////

//Mongo require
var db = require('mongodb').MongoClient;

// Connect to the db
db.connect("mongodb://localhost:27017/linux_lock", function(err, db) {
  if(!err) {
    console.log("We are connected");

    db.collection('users');

  } else {
    return console.dir(err);
  }
});

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('users', function(err, collection) {
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

exports.findByEmail = function(email) {
    console.log('findByEmail: ' + email);
    db.collection('users', function(err, collection) {
        collection.find({'email': email}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};