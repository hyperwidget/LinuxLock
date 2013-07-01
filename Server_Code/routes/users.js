require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
            }
        });
    });
};

exports.findByEmail = function(email, done) {
    var err;
    console.log('findByEmail: ' + email);
    db.collection('users', function(err, collection) {
        collection.find({'email': email}).toArray(function(err, items) {
            console.log(items);
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};

var validPassword = function(password){
    var retval = false;

    return retval;
}

exports.validPassword = validPassword;
