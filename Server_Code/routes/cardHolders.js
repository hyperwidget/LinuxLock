require('./mongo_connect.js');
Rfids = require('./rfids');
Zones = require('./zones');

//The first stop in cardHolder query, if a search parameter is passed in,
//a mongo query is built for that search and passed to findAllWithParams
//If no search values are present, find all cardHolders
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

//Find all cardHolders using the searchValue passed in
function findAllWithParams(searchValue, done){    
    db.collection('cardHolders', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                if(items.length > 0){
                    //Track if all items have finished processing cards and zones
                    cardsDone = 0, zonesDone = 0;
                    //Loop through all items to append their zone names and rfid numbers
                    items.forEach(function(cardHolder){

                        //If this cardholder has cards, loop through each ID and query the
                        //RFIDs collection to get the corresponding rfid_number
                        //Append that RFID number to the current card subdocument
                        if(cardHolder.cards.length > 0) {
                            cardHolder.CardsDone = 0;
                            cardHolder.cards.forEach(function(card){
                                Rfids.findById(card.rfid_id, function(err, cardInfo){
                                    card.rfidNo = cardInfo[0].rfidNo;
                                    //If all of this cardHolder's cards are done being processed
                                    //And all cardholders cards and zones are done being processed, return results
                                    if(++cardHolder.CardsDone == cardHolder.cards.length){
                                        if(++cardsDone == items.length){
                                            if(zonesDone == items.length){
                                                done(null, items);
                                            }
                                        }
                                    }
                                });
                            });
                        } else {
                            //This cardholder has no cards
                            //And all cardholders cards and zones are done being processed, return results
                            if(++cardsDone == items.length){
                                if(zonesDone == items.length){
                                    done(null, items);
                                }
                            } 
                        }

                        //If this cardholder has zones, loop through each ID and query the
                        //Zones collection to get the corresponding zone.name
                        //Append that Zone name to the current zone subdocument
                        if(cardHolder.zones.length > 0) {
                            cardHolder.zones.forEach(function(zone){
                                cardHolder.ZonesDone = 0;
                                Zones.findById(zone.zone_id, function(err, zoneInfo){
                                    zone.name = zoneInfo[0].name;
                                    //If all of this cardHolder's zones are done being processed
                                    //And all cardholders zones and cards are done being processed, return results
                                    if(++cardHolder.ZonesDone == cardHolder.zones.length){
                                        if(++zonesDone == items.length){
                                            if(cardsDone == items.length){
                                                done(null, items);
                                            }
                                        }
                                    }  
                                });
                            });
                        } else {
                            //This cardholder has no zones
                            //And all cardholders cards and zones are done being processed, return results
                            if(++zonesDone == items.length){
                                if(cardsDone == items.length){
                                    done(null, items);
                                }
                            }
                        }
                    });
                } else {
                    //No cardholders found that match the query
                    done(null, items);
                }
            }
        });
    });
};


//Find a cardholder by the passed in ID
exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
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

//Adds a new cardholder using the data passed in
exports.add = function(req, done){
    var err, o_id = new BSON.ObjectID();
    zones = [];
    cards = [];
    //Loop through all zones and put them into an array
    for(i in req.body.zones) {
        zone_id = new BSON.ObjectID.createFromHexString(req.body.zones[i].zone_id.toString());
        zones.push({zone_id: zone_id});
    }

    //Loop through all cards and put them into an array
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
        collection.insert(newCardHolder, {safe:true}, function(err, doc){
            if(!err){
                done(null, doc);
            } else {
                done(err, doc);
            }
        });
    });
};

//Edit a card holder
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());
    zones = [];
    cards = [];

    //Loop through all zones and put them into an array
    for(i in req.body.zones) {
        zone_id = new BSON.ObjectID.createFromHexString(req.body.zones[i].zone_id.toString());
        zones.push({zone_id: zone_id});
    }

    //Loop through all cards and put them into an array
    for(i in req.body.cards) {
        rfid_id = new BSON.ObjectID.createFromHexString(req.body.cards[i].rfid_id.toString());
        cards.push({rfid_id: rfid_id});
    }

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

//Remove a cardholder
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());

    //Find the cardholder's RFIDs first and set them all to inactive
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
                            //neccessary callback
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

//Removes an RFID from a cardholder
exports.removeRFIDFromCardHolders = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('cardHolders', function(err, collection){
        collection.update({},
            { $pull : { cards : { rfid_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};

//Removes a Zone from a cardHolder
exports.removeZoneFromCardHolders = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('cardHolders', function(err, collection){
        collection.update({},
            { $pull : { zones : { zone_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};