require('./mongo_connect.js');
userRFIDs = require('./userRFIDs');

exports.findAll = function(done) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                for(var i in items){                    
                    var item = items[i];

                    cardsArray = []

                    userRFIDs.findByUserId(item._id, item, function(err, cards){      
                        for(var n in cards){
                            cardsArray.push(cards[n].rfidNo);
                        }    
                    });

                    item.cards = cardsArray;
                }

                done(null, items);
            }
        });
    });
};

exports.findByEmail = function(email, done) {
    var err;
    console.log('findByEmail: ' + email);
    db.collection('users', function(err, collection) {
        collection.find({'email': email}).toArray(function(err, items) {
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
