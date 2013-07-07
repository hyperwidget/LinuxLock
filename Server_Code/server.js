//setup Dependencies
var connect = require('connect'),
  express = require('express'),
  io = require('socket.io'),
  port = (process.env.PORT || 3000),
  flash = require('connect-flash');
//Setup Express
var app = express();
var users = require('./routes/users');
var adminRoles = require('./routes/adminRoles');
var zones = require('./routes/zones');
var devices = require('./routes/devices');
var systemSettings = require('./routes/systemSettings');
var userRFIDs = require('./routes/userRFIDs');
var userZones = require('./routes/userZones')
var userDevices = require('./routes/userDevices')
var zoneDevices = require('./routes/zoneDevices')
var events = require('./routes/events')

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

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
  adminRoles.findById(id, function(err, user) {
    done(err, user);
  });
});

//Authentication 

passport.use(new LocalStrategy(
  function(username, password, done) {
    adminRoles.findByUserName(username, function(err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

app.get('/', function(req,res){
  console.log('emptyPath');
  res.render('login.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code',
      messages: req.flash()
    });
});

app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/console',
    failureRedirect: '/',
    failureFlash: true })
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/console', //ensureAuthenticated,
    function(req,res){
    console.log('console');
    res.render('console.jade', {
        title : 'Linux Lock',
        description: 'Starting page',
        author: 'Kaleidus Code',
        messages: req.flash()
    });
});

app.get('/templates/:name', //ensureAuthenticated,
  function(req,res){
    console.log('template' + req.params.name);
    res.render('partials/' + req.params.name + '.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code',
      messages: req.flash()
    });
});

app.get('/users', ensureAuthenticated,
  function(req, res){
    console.log('get users');
    users.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/events', ensureAuthenticated,
  function(req, res){
    console.log('get events');
    events.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/zones', ensureAuthenticated,
  function(req, res){
    console.log('get zones');
    zones.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/devices', ensureAuthenticated,
  function(req, res){
    console.log('get devices');
    devices.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/events', ensureAuthenticated,
  function(req, res){
    console.log('get events');
    events.findAll(function(err, items){
     res.jsonp(items);
  })
});

app.get('/systemSettings', ensureAuthenticated,
  function(req, res){
    console.log('get systemSettings');
    systemSettings.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/userRFIDs', ensureAuthenticated,
  function(req, res){
    console.log('get userRFIDs');
    userRFIDs.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/userZones', ensureAuthenticated,
  function(req, res){
    console.log('get userZones');
    userZones.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/userDevices', ensureAuthenticated,
  function(req, res){
    console.log('get userDevices');
    userDevices.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/zoneDevices', ensureAuthenticated,
  function(req, res){
    console.log('get zoneDevices');
    zoneDevices.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.get('/adminRoles', ensureAuthenticated,
  function(req, res){
    console.log('get adminRoles');
    adminRoles.findAll(function(err, items){
      res.jsonp(items);
  })
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
