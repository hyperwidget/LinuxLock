mongo = require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('admins', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
            }
        });
    });
};

exports.findByUserName = function(userName, done) {
    var err;
    console.log('findByUserName: ' + userName);
    db.collection('admins', function(err, collection) {
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
    db.collection('admins', function(err, collection) {
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
    db.collection('admins', function(err, collection) {
        collection.find({'username': username}).toArray(function(err, items) {
            if(items[0].password === password){
                return done(true);
            } else{ 
                return done(null);
            }
        });
    });
};
