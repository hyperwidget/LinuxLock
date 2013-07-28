require('./mongo_connect.js');
Rfids = require('./rfids');
Zones = require('./zones');

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
        o_id = new BSON.ObjectID.createFromHexString(req.query.zone.toString());
        findAllWithParams({"zones.zone_id": o_id}, done);
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
                    finishCount = 0;
                    items.forEach(function(cardHolder){
                        var cardCount = 0;
                        if(cardHolder.cards.length > 0){
                            cardHolder.cards.forEach(function(card){
                                Rfids.findById(card.rfid_id, function(err, cardInfo){
                                    card.rfidNo = cardInfo[0].rfidNo;
                                    if((++cardCount == cardHolder.cards.length) && (items[items.length - 1]._id == cardHolder._id)){
                                        items.forEach(function(cardHolder){
                                            if(cardHolder.zones.length > 0){
                                                var zoneCount = 0;
                                                cardHolder.zones.forEach(function(zone){
                                                    Zones.findById(zone.zone_id, function(err, zoneInfo){
                                                        zone.name = zoneInfo[0].name;
                                                        console.log(cardHolder.first + " " + zone.name + " " + finishCount);
                                                        if((++zoneCount == cardHolder.zones.length) && (items.length == ++finishCount)){
                                                            done(null, items);
                                                        }
                                                    });
                                                });
                                            } else {
                                                console.log(cardHolder.first + " " + cardHolder.zones.length);
                                                if(items.length == ++finishCount){
                                                    done(null, items);
                                                }
                                            }
                                        });
                                    }
                                });
                            });                        
                        } else {
                            if(cardHolder.zones.length > 0){
                                var zoneCount = 0;
                                cardHolder.zones.forEach(function(zone){
                                    Zones.findById(zone.zone_id, function(err, zoneInfo){
                                        zone.name = zoneInfo[0].name;
                                        console.log(cardHolder.first + " " + cardHolder.zones[0].name);
                                        if((++zoneCount == cardHolder.zones.length) && (items.length == ++finishCount)){
                                            done(null, items);
                                        }
                                    });
                                });
                            } else {
                                if(items.length == ++finishCount){
                                    done(null, items);
                                }
                            }
                        }
                    });
                } else {
                    done(null, items);
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
    o_id = new BSON.ObjectID();
    zones = [];
    cards = [];
    for(i in req.body.zones) {
        zone_id = new BSON.ObjectID.createFromHexString(req.body.zones[i].zone_id.toString());
        zones.push({zone_id: zone_id});
    }

    for(i in req.body.cards) {
        card_id = new BSON.ObjectID.createFromHexString(req.body.cards[i].card_id.toString());
        cards.push({card_id: card_id});
    }

    newCardHolder = {
        _id: o_id,
        first: req.body.first,
        last: req.body.last, 
        email: req.body.email, 
        phone: req.body.phone, 
        userRole: "u", 
        cards: cards, 
        zones: zones
    };

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
    console.log(req.body);
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());
    zones = [];
    cards = [];
    for(i in req.body.zones) {
        zone_id = new BSON.ObjectID.createFromHexString(req.body.zones[i].zone_id.toString());
        zones.push({zone_id: zone_id});
    }

    for(i in req.body.cards) {
        rfid_id = new BSON.ObjectID.createFromHexString(req.body.cards[i].rfid_id.toString());
        cards.push({rfid_id: rfid_id});
    }

    console.log(zones);

    db.collection('cardHolders', function(err, collection){
        collection.update({_id: o_id},
        {
            first: req.body.first,
            last: req.body.last, 
            email: req.body.email, 
            phone: req.body.phone, 
            userRole: "u", 
            cards: cards, 
            zones: zones        
        }, function(){
            done(null);
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

exports.removeRFIDFromCardHolders = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('remove RFID ' + id + ' from cardHolders');

    db.collection('cardHolders', function(err, collection){
        collection.update({},
            { $pull : { cards : { rfid_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};

exports.removeZoneFromCardHolders = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('remove Zone ' + id + ' from cardHolders');

    db.collection('cardHolders', function(err, collection){
        collection.update({},
            { $pull : { zones : { zone_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};