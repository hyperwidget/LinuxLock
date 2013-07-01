// Mongo Conenction Object
// Every route that needs mongo suppose to require this file
// Created by: Anatoly (based on Hunter's code) on June 21st 2013

// Issues to improve:
//   * Put host, port and db name into a separate file ( for convience of configuration + security)

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    mongo = require('mongodb');

var mongoClient = new MongoClient(new Server('localhost', 27017));

exports.db;
exports.BSON;
BSON = mongo.BSONPure;

// Connect to the db
mongoClient.open(function(err, mongoClient) {

  if(!err) {
    console.log("Connected To Mongo");

    db = mongoClient.db('linux_lock');
    // Check if every collection exists if any of them does not exist will show critical error to console
    db.collection('adminRoles', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find adminRoles collection");
        }
    });

    db.collection('devices', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find devices collection");
        }
    });

     db.collection('events', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find Events collection");
        }
    });


    db.collection('systemSettings', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find systemSettings collection");
        }
    });

   db.collection('userDevices', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find userDevices collection");
        }
    });

   db.collection('userRFIDs', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find userRFIDs collection");
        }
    });

  db.collection('userZones', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find userZones collection");
        }
    });

   db.collection('users', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find Users collection");
        }
    });   

    db.collection('zoneDevices', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find zoneDevices collection");
        }
    });

   db.collection('zones', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find Zones collection");
        }
    });



	
  } else {
    return console.dir(err);
  }
});
