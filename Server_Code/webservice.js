var restify = require('restify'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    // Models:
    CardHolder = require('./models/CardHolder'),
    Device = require('./models/Device'),
    RFID = require('./models/RFID'),
    Zone = require('./models/Zone'),
    // WebServer:
    server = restify.createServer({
     	name: "linux-lock-services",
     	version: "1.0.0"
    })
var lock_email = require('./lock_email.js');
mongoose.connect("mongodb://localhost:27017/linux_lock")

mongoose.connection.db.on('open',function(ref){
  console.log('Connected to MongoDB')
})
mongoose.connection.db.on('error',function(err){
  console.log('Failed to connect to MongoDB')
  console.log(err)
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/auth/:type/:id',
  function(req,res,next) {
  if(req.params.type === "rfid") {
    RFID.isAuthorizedForDevice({
      hostname: req.connection.remoteAddress,
      rfidNo: req.params.id
    }, function(err, item) {
      if(err) {
        // TODO: Send this to Log API?
        console.log(err)
        res.send({auth: false})
      } else {
        // TODO: Log this access.
        console.log(item);
        res.send({auth: item.auth})
        // Notify via email that access was granted
        if(item.auth)
          lock_email.sendMail()
      }
    });
  } else {
    res.send({auth: false})
  }
  return next()
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
})
