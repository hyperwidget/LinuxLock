mongo = require('./mongo_connect.js');

exports.findAll = function(callback) {
    db.collection('admins', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err){
                callback(err, items);
            } else {
                callback(null, items);
            }
        });
    });
};

exports.findByUserName = function(userName, done) {
    var err;
    console.log('findByUserName: ' + userName);
    db.collection('admins', function(err, collection) {
        collection.find({'username': userName}).toArray(function(err, items) {
            if(!err){
                return done(null, items[0]);
            } else{ 
                return done(err, items[0]);
            }
        });
    });
};

exports.findById = function(id, done) {
    var err;
    console.log('findById: ' + id);
    var o_id = new BSON.ObjectID(id);
    db.collection('admins', function(err, collection) {
        collection.find({'_id': o_id}).toArray(function(err, items) {
            if(!err){
                return done(null, items[0]);
            } else{ 
                return done(err, items[0]);
            }
        });
    });
};

exports.validPassword = function(username, password, done){
    console.log('validPassword: ' + password);
    db.collection('admins', function(err, collection) {
        collection.find({'username': username}).toArray(function(err, items) {
            if(items[0].password === password){
                return done(true);
            } else{ 
                return done(null);
            }
        });
    });
};

exports.add = function(req, done){
    var err;
    console.log('admin add ' + req);

    newAdmin = {'name': req.body.name, 
        'username': req.body.username,
        'password': req.body.password,
        'canManageUsers': req.body.canManageUsers,
        'canManageDevices': req.body.canManageDevices,
        'canManageZones': req.body.canManageZones,
        'canGenerateReports': req.body.canGenerateReports,
        'canManageBackups': req.body.canManageBackups,
        'canManageSettings': req.body.canManageSettings};

    db.collection('admins', function(err, collection){
        collection.insert(newAdmin, {safe:true}, function(err, doc){
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
    console.log('admin edit ' + req);

    admin = findById(req.body.id);

    db.collection('admins', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {'name': req.body.name, 
            'username': req.body.username,
            'password': req.body.password,
            'canManageUsers': req.body.canManageUsers,
            'canManageDevices': req.body.canManageDevices,
            'canManageZones': req.body.canManageZones,
            'canGenerateReports': req.body.canGenerateReports,
            'canManageBackups': req.body.canManageBackups,
            'canManageSettings': req.body.canManageSettings }
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('admin delete ' + id);

    db.collection('admins', function(err, collection){
        collection.delete({'_id': o_id});
    });
};