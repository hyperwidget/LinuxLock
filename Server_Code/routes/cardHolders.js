require('./mongo_connect.js');
rfids = require('./rfids');
zones = require('./zones');

exports.findAll = function(done) {
    db.collection('cardHolders', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                var cardHolderCount = 0;
                items.forEach(function(cardHolder){
                    var cardCount = 0;
                    if(cardHolder.cards.length > 0){
                        cardHolder.cards.forEach(function(card){
                            rfids.findById(card.rfid_id, function(err, cardInfo){
                                card.rfidNo = cardInfo[0].rfidNo;
                                if((++cardCount == cardHolder.cards.length) && (items[items.length - 1]._id == cardHolder._id)){
                                    items.forEach(function(cardHolder){
                                        if(cardHolder.zones.length > 0){
                                            var zoneCount = 0;
                                            cardHolder.zones.forEach(function(zone){
                                                zones.findById(zone.zone_id, function(err, zoneInfo){
                                                    zone.name = zoneInfo[0].name;
                                                    if((++zoneCount == cardHolder.zones.length) && (items[items.length - 1]._id == cardHolder._id)){
                                                        done(null, items);
                                                    }
                                                });
                                            });
                                        } else {
                                            done(null, items);
                                        }
                                    });
                                }
                            });
                        });                        
                    } else {
                        if(cardHolder.zones.length > 0){
                            var zoneCount = 0;
                            cardHolder.zones.forEach(function(zone){
                                zones.findById(zone.zone_id, function(err, zoneInfo){
                                    zone.name = zoneInfo[0].name;
                                    if((++zoneCount == cardHolder.zones.length) && (items[items.length - 1]._id == cardHolder._id)){
                                        done(null, items);
                                    }
                                });
                            });
                        } else {
                            done(null, items);
                        }
                    }
                });
            }
        });
    });
};

exports.findByEmail = function(email, done) {
    var err;
    console.log('findByEmail: ' + email);
    db.collection('cardHolders', function(err, collection) {
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
