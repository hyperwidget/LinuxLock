require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('settings', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
            }
        });
    });
};

exports.findByEmail = function(id, done) {
    var err;
    console.log('findSettingById: ' + id);
    db.collection('settings', function(err, collection) {
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

exports.add = function(req, done){
    var err;
    console.log('setting add ' + req);

    newSetting = {'name': req.body.name, 'value': req.body.value};

    db.collection('settings', function(err, collection){
        collection.insert(newSetting, {safe:true}, function(err, doc){
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
    console.log('setting edit ' + req);

    setting = findById(req.body.id);

    db.collection('settings', function(err, collection){
        collection.update('_id': o_id,
        {
            $set: {'name': req.body.settingNo,
            'value': req.body.status}
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('setting delete ' + id);

    db.collection('settings', function(err, collection){
        collection.delete({'_id': o_id});
    });
};
