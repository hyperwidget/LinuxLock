//setup Dependencies
var connect = require('connect'),
  express = require('express'),
  io = require('socket.io'),
  port = (process.env.PORT || 3000),
  flash = require('connect-flash'),
  exec = require('child_process').exec,
  bcrypt = require('bcrypt-nodejs'),
  models = require('./models'),
  RFID = models.RFID,
  Zone = models.Zone,
  Event = models.Event,
  lock_email = require('./lock_email.js')

require('./routes/mongo_connect')

//Setup Express
var app = express();

//Setup LinuxLock Objects
var cardHolders = require('./routes/cardHolders');
var admins = require('./routes/admins');
var zones = require('./routes/zones');
var devices = require('./routes/devices');
var settings = require('./routes/settings');
var rfids = require('./routes/rfids');
var events = require('./routes/events');

//Setup passport for authentication
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

//App configuration
app.configure(function(){
  app.set('views', './../Client_Code/views');
  app.set('view options', { layout: false });
  app.use(connect.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "shhhhhhhhh!"}));
  app.use(flash());
  app.use(connect.static(__dirname.replace('Server', 'Client')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  //Error Handler
  app.use(function(err, req, res, next) {
    if(!err) return next();
    console.log(err);
    res.render('404.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code',
      error: err
    });
  });
});

app.listen( port );

//Setup Socket.IO
var io = io.listen(app);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('app_message',data);
    socket.emit('app_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              PASSPORT                 //
///////////////////////////////////////////

//Store user in session
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  admins.findById(id, function(err, user) {
    done(err, user);
  });
});

//Authentication  
passport.use(new LocalStrategy(
  function(username, password, done) {
    admins.findByUserName(username, function(err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(err, res){
        if(res == false){
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      });
    });
  }
));

//Function to make sure that user is currently logged in and authorized
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/')

}

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

//
// API Routes
//
app.get('/api/auth/:type/:id.json',
  function(req,res,next) {
  var time = new Date()
  if(req.params.type === "rfid") {
    //console.log("REQUEST FROM: " + req.connection.remoteAddress)
    RFID.isAuthorizedForDevice({
      hostname: req.connection.remoteAddress,
      rfidNo: req.params.id
    }, function(err, item) {
      if(err) {
        // TODO: Send this to Log API?
        console.log(err)
        // Error occurred, use error status!
        // [ lol :( ]
        var rfid = {}, device = {}
        if(item) rfid = item.rfid, device = item.device
        Event.log(rfid.rfidNo || req.params.id, device.name || "unknown", device.hostname || req.connection.remoteAddress, false, "error", time)
        res.jsonp(401,{auth: false})
      } else {
        // TODO: Log this access.
        //console.log(item);
        res.jsonp(item.auth ? 200 : 401,{auth: item.auth})
        var status = null
        if(!item.device) status = "unknown-device"
        else if(!item.rfid) status = "unknown-rfid"
        
        var deviceName = "unknown", hostName = req.connection.remoteAddress
        if(item.device) {
          deviceName = item.device.name
          hostName = item.device.hostname
        }
        var user = "unknown"
        if(item.user) {
          user = item.user.first + " " + item.user.last
        }
        var rfid = req.params.id
        if(item.rfid)
          rfid = item.rfid.rfidNo
        
        //console.log(JSON.stringify(item))
        Event.log(rfid, user, deviceName, hostName, item.auth, status, time)
        // Notify via email that access was granted
        fullName = null
        deviceName = null
        if(item.user)
          fullName = item.user.fullName;
        if(item.device)
          deviceName = item.device.name;
        if(item.auth)
          lock_email.sendMail(null,fullName,deviceName,time)
      }
    });
  } else {
    Event.log(req.params.id, "unknown", "unknown", req.connection.remoteAddress, false, "bad-protocol", time)
    res.jsonp(401,{auth: false})
  }
})

//Empty Path
app.get('/', function(req,res){
  res.render('login.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code',
      messages: req.flash()
    });
});

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/console#/Users',
    failureRedirect: '/',
    failureFlash: true })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Base view for all other views
app.get('/console', ensureAuthenticated,
    function(req,res){
    res.render('console.jade', {
        title : 'Linux Lock',
        description: 'Starting page',
        author: 'Kaleidus Code',
        messages: req.flash()
    });
});

//display the template for the requested page
app.get('/templates/:name', ensureAuthenticated,
  function(req,res){
    //check if currently logged in user has permissions to access the requested page
    var allowed = true;
    switch(req.params.name){
      case 'users':
        if(req.user.canManageUsers != true){
          allowed = false;
        }
        break;
      case 'devices':
        if(req.user.canManageDevices != true){
          allowed = false;
        }
        break;
      case 'zones':
        if(req.user.canManageZones != true){
          allowed = false;
        }
        break;
      case 'reports':
        if(req.user.canGenerateReports != true){
          allowed = false;
        }
        break;
      case 'settings':
        if(req.user.canManageSettings != true){
          allowed = false;
        }
        break;
      case 'admin':
        if(req.user.name !== "Default SuperAdmin"){
          allowed = false;
        }
        break;
      case 'rfids':
        if(req.user.canManageRFIDs != true){
          allowed = false;
        }
        break;
    }
    if (allowed === false) {
      res.render('401.jade');
    } else {
      res.render('partials/' + req.params.name + '.jade', {
        title : 'Linux Lock',
        description: 'Starting page',
        author: 'Kaleidus Code',
        messages: req.flash()
      });
    }
});

// User Permission
app.get('/permissions', ensureAuthenticated,
  function(req, res) {
      console.log('get permissions');
      var ret = [];
      if (req.user.canManageUsers)
        ret.push({ name: 'Users' });
      if (req.user.canManageRFIDs)
        ret.push({ name: 'Cards' });
      if (req.user.canManageDevices)
        ret.push({ name: 'Devices' });
      if (req.user.canManageZones)
          ret.push({ name: 'Zones' });
      if (req.user.canGenerateReports)
          ret.push({ name: 'Reports' });
      if (req.user.name === 'Default SuperAdmin')
        ret.push({ name: 'Admin' });
      if (req.user.canManageSettings)
          ret.push({ name: 'Settings' });
      res.jsonp(ret);
  });

/** Admin Routes **/

//Get all admins
app.get('/admin', ensureAuthenticated,
  function(req, res){
    admins.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

//Add admin
app.post('/admin', ensureAuthenticated,
  function(req, res){
    admins.add(req, function(err){

  });
});

//Edit admin by ID
app.post('/admin/:id', ensureAuthenticated,
  function(req, res){
    admins.edit(req, function(err){
  });
});

//Delete Admin by ID
app.delete('/admin/:id', ensureAuthenticated,
  function(req, res){
    cardHolders.delete(req.params.id, function(err){
      res.send(200);
  });
});

/** Card Holder Routes **/

//Get all Card Holders
app.get('/cardHolder', ensureAuthenticated,
  function(req, res){
    cardHolders.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

//Add Card Holder
app.post('/cardHolder', ensureAuthenticated,
  function(req, res){
    cardHolders.add(req, function(err){
      res.send(200);
  });
});

//Edit Card Holder By ID
app.post('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    cardHolders.edit(req, function(err){
      res.send(200);
  });
});

//Delete CardHolder By Id
app.delete('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    cardHolders.delete(req.params.id, function(err){
      res.send(200);
  });
});

/** Devices Routes **/

//Get all Devices
app.get('/device', ensureAuthenticated,
  function(req, res){
    devices.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

//Add Device
app.post('/device', ensureAuthenticated,
  function(req, res){
    devices.add(req, function(err){
      res.send(200);
  });
});

//Edit Device by ID
app.post('/device/:id', ensureAuthenticated,
  function(req, res){
    devices.edit(req, function(err){
      res.send(200);
  });
});

//Delete Device by ID
app.delete('/device/:id', ensureAuthenticated,
  function(req, res){
    devices.delete(req.params.id, function(err){
      res.send(200);
  });
});

function dateify(str) {
  // For some reason goddamned browser keeps sending these with
  // surrounding quotes -- if they're present, remove them
  str = str.replace(/^"/,'').replace(/"$/,'')
  var time = Date.parse(str)
  if(isNaN(time)) {
      str = str.toLowerCase()
      time = new Date()
      if(str === "now") return time
      else {
        time.setHours(0,0,0,0)
        if(str === "today") return time
        else if(str === "yesterday") time.setDate(time.getDate() - 1)
        else if(str === "last week") time.setDate(time.getDate() - 7)
        else if(str === "last month") time.setDate(time.getDate() - 30)
        else if(str === "last year") time.setDate(time.getDate() - 364)
        else time = null // IDK
        return time
      }
  } else return new Date(time)
}

/** Events Routes **/

//Get all events
app.get('/event', ensureAuthenticated,
  function(req, res){
    // validate query if any
    var from = req.param('from',null),
        to = req.param('to',null),
        who = req.param('who',null),
        rfid = req.param('rfid',null),
        dev = req.param('dev',null),
        params = {}
    if(from) params.from = dateify(from)
    if(to) params.to = dateify(to)
    if(who) params.who = who
    if(rfid) params.rfid = rfid
    if(dev) params.dev = dev
    events.findWithParams(params, function(err, items) {
      if(err) console.log(err)
      if(!items) items=[]
      res.jsonp(items);
    })
});


//Add Event
app.post('/event', ensureAuthenticated,
  function(req, res){
    events.add(req, function(err){
      res.send(200);
  });
});

//Edit Event by ID
app.post('/event/:id', ensureAuthenticated,
  function(req, res){
    events.edit(req, function(err){
      res.send(200);
  });
});

/** RFID Routes **/

//Get all rfids
app.get('/rfid', ensureAuthenticated,
  function(req, res){
    rfids.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

//Add an RFID
app.post('/rfid', ensureAuthenticated,
  function(req, res){
    rfids.add(req, function(err){
      res.send(200);
  });
});

//Edit RFID by ID
app.post('/rfid/:id', ensureAuthenticated,
  function(req, res){
    rfids.edit(req, function(err){
      res.send(200);
  });
});

//Delete RFID by ID
app.delete('/rfid/:id', ensureAuthenticated,
  function(req, res){
    rfids.delete(req.params.id, function(err){
      res.send(200);
  });
});

/** Settings Routes **/

//Get all Settings
app.get('/setting', ensureAuthenticated,
  function(req, res){
    settings.findAll(function(err, items){
      res.jsonp(items);
  });
});

//Get list of backups stored on server
app.get('/setting/backups', ensureAuthenticated,
  function(req, res){
    settings.backupsList(function(err, items){
      res.jsonp(items);
    });
});

//Execute the passed in backup
app.post('/setting/executeBackup', ensureAuthenticated,
  function(req, res){
    settings.executeBackup(function(err){
      res.send(200);
    });
});

//Add a Setting
app.post('/setting', ensureAuthenticated,
  function(req, res){
    settings.add(req, function(err){
      res.send(200);
  });
});

//Execute a mongo restore based on the passed in filename
app.post('/setting/executeRestore', ensureAuthenticated,
  function(req, res){
    child = exec('mongorestore ./db_backup/' + req.body.file, 
      function (error, stdout, stderr) {      
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          res.send(500);
        } else {
          res.send(200);
        }
    }); 
});

//Edit a Setting by ID
app.post('/setting/:id', ensureAuthenticated,
    function(req, res){
        settings.edit(req, function(err){
            res.send(200);
        });
    });

/** Zones Routes **/

//Get all Zones
app.get('/zone', ensureAuthenticated,
  function(req, res){
    zones.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

//Add a Zone
app.post('/zone', ensureAuthenticated,
  function(req, res){
    zones.add(req, function(err){
      res.send(200);
  });
});

//Edit a Zone by ID
app.post('/zone/:id', ensureAuthenticated,
  function(req, res){
    zones.edit(req, function(err){
      res.send(200);
  });
});

//Delete a Zone by ID
app.delete('/zone/:id', ensureAuthenticated,
  function(req, res){
    zones.delete(req.params.id, function(err){
      res.send(200);
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port );
