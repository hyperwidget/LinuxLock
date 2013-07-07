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

exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
    console.log('findZoneById: ' + id);
    db.collection('cardHolders', function(err, collection) {
        collection.find({'_id': o_id}).toArray(function(err, items) {
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};

exports.add = function(req, done){
    var err;
    console.log('cardholder add ' + req);
    cardsArray = [];
    zonesArray = [];

    newCardHolder = {'first': req.body.firstName, 'last': req.body.lastName, 'email': req.body.email, 'phone': req.body.phoneNumber, 'userRole': "u", 'cards': cardsArray, 'zones': zonesArray};

    db.collection('cardHolders', function(err, collection){
        collection.insert(newCardHolder, {safe:true},function(err, doc){
            if(!err){
                done(null, doc);
            } else {
                done(err, doc);
            }
        });
    });
};

exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('cardholder edit ' + req);

    cardHolder = findById(req.body.id);

    newCardHolder = {first: req.body.firstName, last: req.body.lastName, email: req.body.email, phone: req.body.phoneNumber, cards: req.body.cards, zones: req.body.zones};

    db.collection('cardHolders', function(err, collection){
        collection.update('_id': o_id,
        {
            $set: {'first': req.body.firstName},
            $set: {'last': req.body.lastName},
            $set: {'email': req.body.email},
            $set: {'phone': req.body.phoneNumber},
            $set: {'userRole': req.body.userRole},
            $set: {'cards': req.body.cards},
            $set: {'zones': req.body.zones},

        });
    });
};