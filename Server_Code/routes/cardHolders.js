require('./mongo_connect.js');
rfids = require('./rfids');
zones = require('./zones');

exports.findAll = function(req, res, done) {
    if(req.query.first !== undefined){
        findAllWithParams({first: req.query.first}, done);
    } else if(req.query.last !== undefined){
        findAllWithParams({last: req.query.last}, done);
    } else if(req.query.email !== undefined){
        findAllWithParams({email: req.query.email}, done);
    } else if(req.query.phone !== undefined){
        findAllWithParams({phone: req.query.phone.toString()}, done);
    } else if(req.query.card !== undefined){
        rfids.findByRfidNo(req.query.card, function(err, rfid){
            if(rfid.length > 0){
                findAllWithParams({"cards.rfid_id": rfid[0]._id}, done);
            } else {
                done(null, null);
            }
        });
    } else if(req.query.zone !== undefined){
        zones.findById(req.query.card, function(err, zone){
            findAllWithParams({"cards.zone_id": zone[0]._id}, done);
        });
    } else {
        findAllWithParams('', done);
    }
};

function findAllWithParams(searchValue, done){    
    db.collection('cardHolders', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                var cardHolderCount = 0;
                if(items.length > 0 ){
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
                } else {
                    done(null, null);
                }
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

    newCardHolder = {'first': req.body.first,
        'last': req.body.last, 
        'email': req.body.email, 
        'phone': req.body.phone, 
        'userRole': "u", 
        'cards': cardsArray, 
        'zones': zonesArray};

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

    db.collection('cardHolders', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'first': req.body.first,
            'last': req.body.last,
            'email': req.body.email,
            'phone': req.body.phone,
            'userRole': req.body.userRole,
            'cards': req.body.cards,
            'zones': req.body.zones}
        });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('cardholder delete ' + id);

    db.collection('cardHolders', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            done(null);
        });
    });

    
};