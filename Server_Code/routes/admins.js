mongo = require('./mongo_connect.js'),
bcrypt = require('bcrypt-nodejs');


exports.findAll = function(req, res, done) {
    if(req.query.name !== undefined){
        if(req.query.name !== 'Default SuperAdmin'){
            findAllWithParams({name: req.query.name}, done);
        } else {
            findAllWithParams({name:{$ne: 'Default SuperAdmin'}}, done);
        }
    } else if(req.query.userName !== undefined){
        if(req.query.userName !== 'admin'){
            findAllWithParams({username: req.query.userName}, done);
        } else {
            findAllWithParams({name:{$ne: 'Default SuperAdmin'}}, done);
        }
    } else {
        findAllWithParams({name:{$ne: 'Default SuperAdmin'}}, done);
    }
};

function findAllWithParams(searchValue, done){    
    db.collection('admins', function(err, collection) {
        collection.find(searchValue).toArray(function(err, items) {
            if(err){
                done(err, items);
            } else {
                done(null, items);
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

    newAdmin = {name: req.body.name, 
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        canManageUsers: req.body.canManageUsers,
        canManageDevices: req.body.canManageDevices,
        canManageZones: req.body.canManageZones,
        canGenerateReports: req.body.canGenerateReports,
        canManageRFIDs: req.body.canManageRFIDs,
        canManageSettings: req.body.canManageSettings};

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
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;
    console.log('admin edit ' + req);

    db.collection('admins', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {name: req.body.name, 
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password),
            canManageUsers: req.body.canManageUsers,
            canManageDevices: req.body.canManageDevices,
            canManageZones: req.body.canManageZones,
            canGenerateReports: req.body.canGenerateReports,
            canManageRFIDs: req.body.canManageRFIDs,
            canManageSettings: req.body.canManageSettings }
         }, function(){
            done(null);
         });
    });
};

exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('admin delete ' + id);

    db.collection('admins', function(err, collection){
        collection.delete({'_id': o_id}, function(err, items){
            done(null);
        });
    });
};