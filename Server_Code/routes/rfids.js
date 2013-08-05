require('./mongo_connect.js');
CardHolders = require('./cardHolders');

//The first stop in RFID query, if a search parameter is passed in,
//a mongo query is built for that search and passed to findAllWithParams
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

//Find an RFID document by the passed in RFIDNumber
exports.findByRfidNo = function(rfid, done){
    db.collection('rfids', function(err, collection) {
        searchValue = {rfidNo: rfid};
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                done(null, items);
            }
        });
    }); 
};

//Find all using the passed in searchValue
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

//Find an RFID by ID
exports.findById = function(id, done) {
    var err,  o_id = new BSON.ObjectID.createFromHexString(id.toString());
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

//Add an RFID usin the passed in information
exports.add = function(req, done){
    var err;

    newRfid = {
        rfidNo: req.body.rfidNo, 
        status: req.body.status, 
        cardHolder_id: req.body.cardHolder_id
    };

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

//Edit an RFID to match the passed in information
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;

    db.collection('rfids', function(err, collection){
        collection.update({_id: o_id},
        {
            $set: {rfidNo: req.body.rfidNo,
            status: req.body.status}
         }, function(){
            done(null);
         });
    });
};

//Delete an RFID
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('rfids', function(err, collection){
        collection.remove({'_id': o_id}, function(err, items){
            CardHolders.removeRFIDFromCardHolders(id, done);
        });
    });

};