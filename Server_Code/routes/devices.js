require('./mongo_connect.js');
Zones = require('./zones');

exports.findAll = function(req, res, done) {
    if(req.query.name !== undefined){
        findAllWithParams({name: req.query.name}, done);
    } else if(req.query.type !== undefined){
        findAllWithParams({type: parseInt(req.query.type)}, done);
    } else if(req.query.hostname !== undefined){
        findAllWithParams({hostname: req.query.hostname}, done);
    } else {
        findAllWithParams('', done);
    }
};

function findAllWithParams(searchValue, done){    
    db.collection('devices', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                done(null, items);
            }
        });
    });
};

exports.findById = function(id, done) {
    var err;
    console.log('findDeviceById: ' + id);
    db.collection('devices', function(err, collection) {
        collection.find({'_id': 'ObjectId("' + id + '")'}).toArray(function(err, items) {
            console.log(items);
            if(!err){
                return done(null, items);
            } else{ 
                return done(err, items);
            }
        });
    });
};

exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
    console.log('findDeviceById: ' + id);
    db.collection('devices', function(err, collection) {
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
    console.log('device add ' + req);

    newDevice = {'name': req.body.name, 'hostname': req.body.hostname};

    db.collection('devices', function(err, collection){
        collection.insert(newDevice, {safe:true},function(err, doc){
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
    console.log('device edit ' + req.toString());

    db.collection('devices', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'name': req.body.name,
            'hostname': req.body.hostname}
        }, function(err, doc){
            done(null)});
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('device delete ' + id);

    db.collection('devices', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            Zones.removeDeviceFromZones(id, done);
        });
    });
};