require('./mongo_connect.js');
Zones = require('./zones');

//The first stop in Device query, if a search parameter is passed in,
//a mongo query is built for that search and passed to findAllWithParams
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

//Find all using the passed in searchValue
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

//Find a single device by id
exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
    //console.log('findDeviceById: ' + id);
    db.collection('devices', function(err, collection) {
      collection.find({_id: o_id}).toArray(function(err, items) {
        if(!err){
          return done(null, items);
        } else {
          return done(err, items);
        } 
    });
  })
};

//Add a device using passed in information
exports.add = function(req, done){
    var err;

    o_id = new BSON.ObjectID();
    newDevice = {
        _id: o_id,
        name: req.body.name, 
        hostname: req.body.hostname
    };


    db.collection('devices', function(err, collection){
        collection.insert(newDevice, {safe:true},function(err, doc){
            if(!err){
                done(null, doc);
            } else {
                console.log(err);
                done(err, doc);
            }
        });
    });
};


//Edit device to match passed in information
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;

    db.collection('devices', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {
                name: req.body.name,
                hostname: req.body.hostname
            }
        }, function(err, doc){
            done(null)});
    });
};

//Remove specified Device
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('devices', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            Zones.removeDeviceFromZones(id, done);
        });
    });
};