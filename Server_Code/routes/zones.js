require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('zones', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
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
        collection.update('_id': o_id,
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