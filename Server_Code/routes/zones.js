require('./mongo_connect.js');
Devices = require('./devices.js');
CardHolders = require('./cardHolders');

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

function findAllWithParams(searchValue, done){   
    db.collection('zones', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                if(items.length > 0){
                    doneCount = 0;
                    items.forEach(function(zone){
                        if(zone.devices.length > 0){
                            var deviceCount = 0;
                            zone.devices.forEach(function(device){
                                Devices.findById(device.device_id, function(err, deviceInfo){
                                    device.name = deviceInfo[0].name;
                                    if((++deviceCount == zone.devices.length) && (++doneCount == items.length)){
                                        done(null, items);
                                    }
                                });
                            });
                        } else {
                            if(items.length == ++doneCount){
                                done(null, items);
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

exports.add = function(req, done){
    var err;
    console.log('zone add ' + req);
    cardsArray = [];
    devicesArray = [];

    newZone = {'name': req.body.name, 'devices': devicesArray};

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

exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;
    console.log('zone edit ' + req);

    devices = [];
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

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('zone delete ' + id);

    db.collection('zones', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            CardHolders.removeZoneFromCardHolders(id, done);
        });
    });
};

exports.removeDeviceFromZones = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('remove device ' + id + ' from zones');

    db.collection('zones', function(err, collection){
        collection.update({},
            { $pull : { devices : { device_id : o_id } } }, {upsert:false, multi:true}, function(){
                done(null);
            } );
    });
};