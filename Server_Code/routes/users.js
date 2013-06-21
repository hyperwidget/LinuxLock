require('./mongo_connect.js');

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
