var restify = require('restify'),
    mongodb = require('mongodb/lib/mongodb'),
   dbserver = new mongodb.Server('localhost', 27017, {auto_reconnect: true}),
         db = new mongodb.Db('linux_lock', dbserver),
     server = restify.createServer({
     	name: "linux-lock-services",
     	version: "1.0.0"
     });

var client = new mongodb.MongoClient(new mongodb.Server('localhost', 27017));

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/auth/:type/:id', function(req,res,next) {
  var result = false;
  if(req.params.type === "rfid") {
    // If we're dealing with RFID authentication...
    db.collection('userRFIDs', function(err, collection) {
      // TODO:
      // There should not be duplicate RFID numbers in the system.
      // However if there ARE duplicates, and any single duplicate
      // is unauthorized, then deny access.
      var cursor = collection.find({'rfidNo': req.params.id});
      if(cursor.size() > 0) {
        // For now, just return true if the RFID is found in the system.
        result = true;
      }
    });
  }
  res.send({"auth": result});
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
