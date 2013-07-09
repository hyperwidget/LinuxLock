require('./mongo_connect.js');
devices = require('./devices.js');

exports.findAll = function(done) {
    db.collection('zones', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                items.forEach(function(zone){
                    if(zone.devices.length > 0){
                        var deviceCount = 0;
                        zone.devices.forEach(function(device){
                            devices.findById(device.device_id, function(err, deviceInfo){
                                device.name = deviceInfo[0].name;
                                if((++deviceCount == zone.devices.length) && (items[items.length - 1]._id == zone._id)){
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
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('zone edit ' + req);

    zone = findById(req.body.id);

    db.collection('zones', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'name': req.body.name,
            'devices': req.body.devices}
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('zone delete ' + id);

    db.collection('zones', function(err, collection){
        collection.delete({'_id': o_id});
    });
};