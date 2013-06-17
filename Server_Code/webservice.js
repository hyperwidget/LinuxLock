var restify = require('restify'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    server = restify.createServer({
     	name: "linux-lock-services",
     	version: "1.0.0"
    })

mongoose.connect("mongodb://localhost:27017/linux_lock")

mongoose.connection.db.on('open',function(ref){
  console.log('Connected to MongoDB')
})
mongoose.connection.db.on('error',function(err){
  console.log('Failed to connect to MongoDB')
  console.log(err)
})

// Bootstrap models
var modelsPath = __dirname + '/models';

// Not-very-clever model-import strategy
fs.readdirSync(modelsPath).forEach(function(name){
  var obj = require(modelsPath + '/' + name),
      modelName = obj.name,
      schemaName = obj.name+"Schema"
  this[schemaName] = obj.schema;
  this[modelName] = mongoose.model(modelName,this[schemaName],obj.collection)
  console.log(this[modelName].modelName)
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/auth/:type/:id', function(req,res,next) {
  if(req.params.type === "rfid") {
    UserRFID.find({'rfidNo': req.params.id},
      function(err,items){
      if(err) console.log(err), res.send({"auth": false});
      else if(items.length > 0) {
        // TODO:
        // There should not be duplicate RFID numbers in the system.
        // However if there ARE duplicates, and any single duplicate
        // is unauthorized, then deny access.
        res.send({"auth": true});
      } else {
        res.send({"auth": false});
      }
    })
  } else {
    res.send({"auth": false})
  }
  return next()
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
})
