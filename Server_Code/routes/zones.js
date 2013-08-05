require('./mongo_connect.js');
Devices = require('./devices.js');
CardHolders = require('./cardHolders');

//The first stop in Zone query, if a search parameter is passed in,
//a mongo query is built for that search and passed to findAllWithParams
exports.findAll = function(req, res, done) {
    if(req.query.name !== undefined){
        findAllWithParams({name: req.query.name}, done);
    } else if(req.query.device !== undefined){
        o_id = new BSON.ObjectID.createFromHexString(req.query.device.toString());
        findAllWithParams({"devices.device_id": o_id}, done);
    } else {
        findAllWithParams('', done);
    }
};

//Find all using the passed in searchValue
function findAllWithParams(searchValue, done){   
    db.collection('zones', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                if(items.length > 0){
                    //Keep track of how many zones have finished processing
                    doneCount = 0;
                    //Go through each zone and add the devices names to their subdocuments
                    items.forEach(function(zone){
                        if(zone.devices.length > 0){
                            var deviceCount = 0;
                            //Loop through each device this zone has and add it's name
                            zone.devices.forEach(function(device){
                                Devices.findById(device.device_id, function(err, deviceInfo){
                                    device.name = deviceInfo[0].name;
                                    //If all devices are done and all zones' devices are done, return results
                                    if((++deviceCount == zone.devices.length) && (++doneCount == items.length)){
                                        done(null, items);
                                    }
                                });
                            });
                        } else {
                            //This Zone has no devices, but if the other zones' devices are done, return results
                            if(items.length == ++doneCount){
                                done(null, items);
                            }
                        }
                    });
                } else {
                    //no zones match the query
                    done(null, items);
                }
            }
        });
    });
};

//Find a Zone by ID
exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
    db.collection('zones', function(err, collection) {
        collection.find({'_id': o_id}).toArray(function(err, items) {
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};

//Add a zone using the passed in info
exports.add = function(req, done){
    var err;
    devices = [];

    //Add each device_id to the device array
    for(i in req.body.devices) {
        device_id = new BSON.ObjectID.createFromHexString(req.body.devices[i].device_id.toString());
        devices.push({device_id: device_id});
    }

    newZone = {name: req.body.name, devices: devices};

    db.collection('zones', function(err, collection){
        collection.insert(newZone, {safe:true}, function(err, doc){
            if(!err){
                done(null, doc);
            } else {
                done(err, doc);
            }
        });
    });
};


//Edit the zone to match the passed in info
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;

    devices = [];
    //Add each device_id to the device array
    for(i in req.body.devices) {
        device_id = new BSON.ObjectID.createFromHexString(req.body.devices[i].device_id.toString());
        devices.push({device_id: device_id});
    }

    db.collection('zones', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {name: req.body.name,
            devices: devices}
         }, function(){
            done(null);
         });
    });
};

//Remove a zone
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('zones', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            CardHolders.removeZoneFromCardHolders(id, done);
        });
    });
};

//Remove specified device from all zones(device was deleted)
exports.removeDeviceFromZones = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('zones', function(err, collection){
        collection.update({},
            { $pull : { devices : { device_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};