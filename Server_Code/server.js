//setup Dependencies
var connect = require('connect'),
  express = require('express'),
  io = require('socket.io'),
  port = (process.env.PORT || 3000),
  flash = require('connect-flash'),
  exec = require('child_process').exec,
  bcrypt = require('bcrypt-nodejs');
//Setup Express
var app = express();
var cardHolders = require('./routes/cardHolders');
var admins = require('./routes/admins');
var zones = require('./routes/zones');
var devices = require('./routes/devices');
var settings = require('./routes/settings');
var rfids = require('./routes/rfids');
var events = require('./routes/events')

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

app.configure(function(){
  app.set('views', './../Client_Code/views');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
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
    res.send("error!!!");
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

app.get('/', function(req,res){
  console.log('emptyPath');
  console.log(bcrypt.hashSync("P@ssw0rd"));
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

app.get('/console', ensureAuthenticated,
    function(req,res){
    console.log('console');
    res.render('console.jade', {
        title : 'Linux Lock',
        description: 'Starting page',
        author: 'Kaleidus Code',
        messages: req.flash()
    });
});

app.get('/templates/:name', ensureAuthenticated,
  function(req,res){
    console.log('template' + req.params.name);
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

// Admins
app.get('/admin', ensureAuthenticated,
  function(req, res){
    console.log('get admins');
    admins.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/admin', ensureAuthenticated,
  function(req, res){
    console.log('add admins');
    admins.add(req, function(err){

  });
});

app.post('/admin/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit admins');
    admins.edit(req, function(err){
  });
});

app.delete('/admin/:id', ensureAuthenticated,
  function(req, res){
    console.log('delete admin');
    cardHolders.delete(req.params.id, function(err){
      res.writeHead('200');
  });
});

// Card Holders
app.get('/cardHolder', ensureAuthenticated,
  function(req, res){
    console.log('get cardHolders');
    cardHolders.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/cardHolder', ensureAuthenticated,
  function(req, res){
    console.log('add cardHolder');
    cardHolders.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit cardHolder');
    cardHolders.edit(req, function(err){
      res.writeHead('200');
  });
});

app.delete('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    console.log('delete cardHolder');
    cardHolders.delete(req.params.id, function(err){
      res.writeHead('200');
  });
});

//Devices
app.get('/device', ensureAuthenticated,
  function(req, res){
    console.log('get devices');
    devices.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/device', ensureAuthenticated,
  function(req, res){
    console.log('add device');
    devices.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/device/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit device');
    devices.edit(req, function(err){
      res.writeHead('200');
  });
});

app.delete('/device/:id', ensureAuthenticated,
  function(req, res){
    console.log('delete device');
    devices.delete(req.params.id, function(err){
      res.writeHead('200');
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

//Events
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

app.post('/event', ensureAuthenticated,
  function(req, res){
    console.log('add event');
    events.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/event/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit event');
    events.edit(req, function(err){
      res.writeHead('200');
  });
});

//RFIDs
app.get('/rfid', ensureAuthenticated,
  function(req, res){
    console.log('get rfids');
    rfids.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/rfid', ensureAuthenticated,
  function(req, res){
    console.log('add rfid');
    rfids.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/rfid/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit rfid');
    rfids.edit(req, function(err){
      res.writeHead('200');
  });
});

app.delete('/rfid/:id', ensureAuthenticated,
  function(req, res){
    console.log('delete rfid');
    rfids.delete(req.params.id, function(err){
      res.writeHead('200');
  });
});


//Settings
app.get('/setting', ensureAuthenticated,
  function(req, res){
    console.log('get settings');
    settings.findAll(function(err, items){
      res.jsonp(items);
  });
});

app.get('/setting/backups', ensureAuthenticated,
  function(req, res){
    console.log('get backups');
    settings.backupsList(function(err, items){
      res.jsonp(items);
    });
});

app.post('/setting', ensureAuthenticated,
  function(req, res){
    console.log('add setting');
    settings.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/setting/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit setting');
    settings.edit(req, function(err){
      res.writeHead('200');
  });
});

app.post('/executeRestore', ensureAuthenticated,
  function(req, res){
    console.log('RUN RESTORE');

    child = exec('mongorestore ./../db_backup/', // command line argument directly in string
      function (error, stdout, stderr) {      // one easy function to capture data/errors
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        } else {
          res.writeHead('200');
        }
    }); 
});

//Zones
app.get('/zone', ensureAuthenticated,
  function(req, res){
    console.log('get zones');
    zones.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/zone', ensureAuthenticated,
  function(req, res){
    console.log('add zone');
    zones.add(req, function(err){
      res.writeHead('200');
  });
});

app.post('/zone/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit zone');
    zones.edit(req, function(err){
      res.writeHead('200');
  });
});

app.delete('/zone/:id', ensureAuthenticated,
  function(req, res){
    console.log('delete zone');
    zones.delete(req.params.id, function(err){
      res.writeHead('200');
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
