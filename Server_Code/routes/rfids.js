require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('rfids', function(err, collection) {
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
    console.log('findUserRfidById: ' + id);
    db.collection('rfids', function(err, collection) {
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
    console.log('rfid add ' + req);

    newRfid = {'rfidNo': req.body.rfidNo, 'status': req.body.status, 'cardHolder_id': req.body.cardHolder_id};

    db.collection('rfids', function(err, collection){
        collection.insert(newRfid, {safe:true}, function(err, doc){
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
    console.log('rfid edit ' + req);

    rfid = findById(req.body.id);

    db.collection('rfids', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'rfidNo': req.body.rfidNo,
            'status': req.body.status,
            'cardHolder_id': req.body.cardHolder_id}
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('rfid delete ' + id);

    db.collection('rfids', function(err, collection){
        collection.delete({'_id': o_id});
    });
};