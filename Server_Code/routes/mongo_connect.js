// Mongo Conenction Object
// Every route that needs mongo suppose to require this file
// Created by: Anatoly (based on Hunter's code) on June 21st 2013

// Issues to improve:
//   * Put host, port and db name into a separate file ( for convience of configuration + security)

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    mongo = require('mongodb'),
    mongoose = require('mongoose')

var mongoClient = new MongoClient(new Server('localhost', 27017));

exports.mongoose = mongoose.connect("mongodb://localhost:27017/linux_lock")
//mongoose.set('debug',true)
exports.db;
exports.BSON;
BSON = mongo.BSONPure;

// Connect to the db
mongoClient.open(function(err, mongoClient) {

  if(!err) {
    console.log("Connected To Mongo");

    db = mongoClient.db('linux_lock');
    // Check if every collection exists if any of them does not exist will show critical error to console
    db.collection('admins', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find admins collection");
        }
    });

   db.collection('cardHolders', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find cardHolders collection");
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

   db.collection('rfids', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find rfids collection");
        }
    });

    db.collection('settings', {strict:true}, function(err, collection){
        if(err){
            console.log("Critical-Error: can't find settings collection");
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
