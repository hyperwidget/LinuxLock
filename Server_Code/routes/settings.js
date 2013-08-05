require('./mongo_connect.js');
var fs = require("fs"),
path = require("path"),
exec = require('child_process').exec;

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

exports.backupsList = function(callback){
    var p = "./db_backup"
    filesList = [];
    fs.readdir(p, function (err, files) {
        if (err) {
            return callback(err, filesList);            
        }
        files.map(function (file) {
            return file;
        }).forEach(function (file) {
            filesList.push(file);
        });
        callback(null, filesList);
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

exports.executeBackup = function(req, done){
    var d = new Date();
    var day = d.getDay();
    var month = d.getMonth();
    var year = d.getYear();

    exec('./bash/mongo_dump --out ./db_backup/linux_lock_db_backup_' + day + '_' + month + '_' + year + '_instant_' + d.getTime(), 
      function (error, stdout, stderr) { 
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        } else {
            done(null);
        }
    });
};

exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;
    console.log('setting edit ' + req);

    db.collection('settings', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {
                value: req.body.value}
            }, function(){
                switch(req.body.name){
                    case "Backup":
                    switch(req.body.value){
                        case "Weekly":
                        exec('./bash/mongo_backup -w', 
                          function (error, stdout, stderr) { 
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                              console.log('exec error: ' + error);
                            } else {
                                done(null);
                            }
                        });                       
                        break;
                        case "Monthly":
                        exec('./bash/mongo_backup -m', 
                          function (error, stdout, stderr) { 
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                              console.log('exec error: ' + error);
                            } else {
                                done(null);
                            }
                        }); 
                        break;
                        case "Daily":
                        exec('./bash/mongo_backup -d',
                          function (error, stdout, stderr) { 
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                              console.log('exec error: ' + error);
                            } else {
                                done(null);
                            }
                        }); 
                        break;
                        default:
                        done(null);
                        break;
                    }
                    break;
                    default:
                    break;
                };
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
