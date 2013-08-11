var mongo = require('./mongo_connect.js'), 
    bcrypt = require('bcrypt-nodejs');

//The first stop in admin query, if a search parameter is passed in,
//a mongo query is built for that search and passed to findAllWithParams
//The super admin user can not be searched for.
//If no search values are present, find all admins who aren't the default superAdmin 
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

//Find all using the passed in searchValue
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

//Find a single admin by their username
exports.findByUserName = function(userName, done) {
    var err;
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

//Find a single admin by their ID
exports.findById = function(id, done) {
    var err, o_id = new BSON.ObjectID(id);
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

//Compares passed in value for a user's password against stored value
exports.validPassword = function(username, password, done){
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

//Create a new admin using request data
exports.add = function(req, done){
    var err;
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

//Edit an admin by id using request data
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;

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

//Remove an admin by ID
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;

    db.collection('admins', function(err, collection){
        collection.delete({'_id': o_id}, function(err, items){
            done(null);
        });
    });
};

//Update superAdmin password
exports.changeSuperAdminPassword = function(req, done){
    var err;
    db.collection('admins', function(err, collection){
        collection.update({name:'Default SuperAdmin'},
        {
            $set:{password: bcrypt.hashSync(req.body.password)}
        }, function(){
            done(null);
        });
    });
};