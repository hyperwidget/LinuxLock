require('./mongo_connect.js');

exports.findAll = function(callback) {
    if(req.query.alias !== undefined){
        findAllWithParams({name: req.query.alias}, done);
    } else if(req.query.type !== undefined){
        findAllWithParams({type: req.query.type}, done);
    } else {
        findAllWithParams('', done);
    }
};

function findAllWithParams(searchValue, done){    
    db.collection('devices', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
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
    console.log('findZoneById: ' + id);
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

    newDevice = {'name': req.body.name, 'type': req.body.type, 'hostname': req.body.hostname};

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
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('device edit ' + req);

    device = findById(req.body.id);

    db.collection('devices', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'name': req.body.name,
            'type': req.body.type,
            'hostname': req.body.hostname}
        });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('device delete ' + id);

    db.collection('devices', function(err, collection){
        collection.delete({'_id': o_id});
    });
};
