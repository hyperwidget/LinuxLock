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

                if(items.length > 0){
                    cardsDone = 0, zonesDone = 0;
                    items.forEach(function(cardHolder){

                        if(cardHolder.cards.length > 0) {
                            cardHolder.CardsDone = 0;
                            cardHolder.cards.forEach(function(card){
                                Rfids.findById(card.rfid_id, function(err, cardInfo){
                                    card.rfidNo = cardInfo[0].rfidNo;
                                    if(++cardHolder.CardsDone == cardHolder.cards.length){
                                        console.log(cardHolder.first + " cards done");
                                        if(++cardsDone == items.length){
                                            if(zonesDone == items.length){
                                                done(null, items);
                                            }
                                        }
                                    }
                                });
                            });
                        } else {
                            console.log(cardHolder.first + " cards done");
                            if(++cardsDone == items.length){
                                if(zonesDone == items.length){
                                    done(null, items);
                                }
                            } 
                        }
                        if(cardHolder.zones.length > 0) {
                            cardHolder.zones.forEach(function(zone){
                                cardHolder.ZonesDone = 0;
                                Zones.findById(zone.zone_id, function(err, zoneInfo){
                                    zone.name = zoneInfo[0].name;
                                    if(++cardHolder.ZonesDone == cardHolder.zones.length){
                                        console.log(cardHolder.first + " zones done");
                                        if(++zonesDone == items.length){
                                            if(cardsDone == items.length){
                                                done(null, items);
                                            }
                                        }
                                    }  
                                });
                            });
                        } else {
                            console.log(cardHolder.first + " zones done");
                            if(++zonesDone == items.length){
                                if(cardsDone == items.length){
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
        card_id = new BSON.ObjectID.createFromHexString(req.body.cards[i].rfid_id.toString());
        cards.push({rfid_id: card_id});
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
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());
    console.log('cardholder delete ' + id);

    db.collection('cardHolders', function(err, collection){
        collection.find({_id: o_id}, {cards:1, _id:0}).toArray(function(err, items){
                items[0].cards.forEach(function(card){
                    rfid_id = new BSON.ObjectID.createFromHexString(card.rfid_id.toString());
                    db.collection('rfids', function(err, collection){
                        collection.update({'_id': rfid_id},
                        {
                            $set: {
                            status: 'inactive'}                            
                         }, function(){
                         });
                    });
                });             
        });
    });   

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