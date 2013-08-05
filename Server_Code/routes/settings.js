require('./mongo_connect.js');
//Used for executing scripts and reading file lists
var fs = require("fs"),
path = require("path"),
exec = require('child_process').exec;

//Find all settings
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

//Get a list of all the files in the db_backup folder and map them to the files array(easier to display in angular)
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

//Add a setting (not used, but left available for any future needs)
exports.add = function(req, done){
    var err;

    newSetting = {name: req.body.name, value: req.body.value};

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

//Execute a mongo dump right now
exports.executeBackup = function(done){
    //Date params for naming
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();

    //Execute the command
    exec('./bash/mongo_dump linux_lock_db_backup_' + day + '_' + month + '_' + year + '_instant_' + d.getTime(), 
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

//Edit a Setting to match passed in values
exports.edit = function(req, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(req.body._id.toString());;

    db.collection('settings', function(err, collection){
        collection.update({'_id': o_id},
        {
            $set: {
                value: req.body.value}
            }, function(){
                //If we changed the backup frequency, run the script to change the cronjob 
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

//Remove a Setting
exports.delete = function(id, done){
    var err, o_id = new BSON.ObjectID.createFromHexString(id.toString());;
    console.log('setting delete ' + id);

    db.collection('settings', function(err, collection){
        collection.delete({'_id': o_id});
    });
};
