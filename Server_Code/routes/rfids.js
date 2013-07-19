require('./mongo_connect.js');

exports.findAll = function(req, res, done) {
    console.log('get all rfidsssss');
    if(req.query.rfidNo !== undefined){
        findAllWithParams({rfidNo: req.query.rfidNo}, done);
    } else if (req.query.status !== undefined){
        findAllWithParams({status: req.query.status}, done);
    } else {
        findAllWithParams('', done);
    }
};

exports.findByRfidNo = function(rfid, done){
    db.collection('rfids', function(err, collection) {
        searchValue = {rfidNo: rfid};
        console.log(searchValue);
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                done(null, items);
            }
        });
    }); 
};

function findAllWithParams(searchValue, done){   
    db.collection('rfids', function(err, collection) {
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
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;
    console.log('rfid edit ' + req);

    db.collection('rfids', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'rfidNo': req.body.rfidNo,
            'status': req.body.status,
            'cardHolder_id': req.body.cardHolder_id}
         }, function(){
            done(null);
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('rfid delete ' + id);

    db.collection('rfids', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            done(null);
        });
    });
};