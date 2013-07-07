require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('events', function(err, collection) {
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
    console.log('findById: ' + id);
    db.collection('events', function(err, collection) {
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
    console.log('event add ' + req);

    newEvent = {'device_id': req.body.device_id, 
    'rfid_id': req.body.rfid_id, 
    'alias': req.body.alias, 
    'entry_time': req.body.entry_time, 
    'status': req.body.status};

    db.collection('events', function(err, collection){
        collection.insert(newEvent, {safe:true},function(err, doc){
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
    console.log('event edit ' + req);

    event = findById(req.body.id);

    db.collection('events', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'device_id': req.body.device_id, 
                'rfid_id': req.body.rfid_id, 
                'alias': req.body.alias, 
                'entry_time': req.body.entry_time, 
                'status': req.body.status}
        });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('event delete ' + id);

    db.collection('events', function(err, collection){
        collection.delete({'_id': o_id});
    });
};
