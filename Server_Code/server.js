//setup Dependencies
var connect = require('connect'),
  express = require('express'),
  io = require('socket.io'),
  port = (process.env.PORT || 3000),
  flash = require('connect-flash');
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
    res.render('partials/' + req.params.name + '.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code',
      messages: req.flash()
    });
});

// Admins
app.get('/admins', ensureAuthenticated,
  function(req, res){
    console.log('get admins');
    admins.findAll(req, res, function(err, items){
      res.jsonp(items);
  })
});

app.post('/admin', ensureAuthenticated,
  function(req, res){
    console.log('add admins');
    adminss.add(req, function(err){

  });
});

app.post('/admin/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit admins');
    admins.edit(req, function(err){
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

  });
});

app.post('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit cardHolder');
    cardHolders.edit(req, function(err){
  });
});

app.delete('/cardHolder/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit cardHolder');
    cardHolders.delete(req.params.id, function(err){
      console.log(err);
  });
});

//Devices
app.get('/devices', ensureAuthenticated,
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

  });
});

app.post('/device/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit device');
    devices.edit(req, function(err){
  });
});

//Events
app.get('/events', ensureAuthenticated,
  function(req, res){
    console.log('get events');
    events.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.post('/event', ensureAuthenticated,
  function(req, res){
    console.log('add event');
    events.add(req, function(err){

  });
});

app.post('/event/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit event');
    events.edit(req, function(err){
  });
});

//RFIDs
app.get('/rfids', ensureAuthenticated,
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

  });
});

app.post('/rfid/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit rfid');
    rfids.edit(req, function(err){
  });
});

//Settings
app.get('/settings', ensureAuthenticated,
  function(req, res){
    console.log('get settings');
    settings.findAll(function(err, items){
      res.jsonp(items);
  })
});

app.post('/setting', ensureAuthenticated,
  function(req, res){
    console.log('add setting');
    settings.add(req, function(err){

  });
});

app.post('/setting/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit setting');
    settings.edit(req, function(err){
  });
});

//Zones
app.get('/zones', ensureAuthenticated,
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

  });
});

app.post('/zone/:id', ensureAuthenticated,
  function(req, res){
    console.log('edit zone');
    zones.edit(req, function(err){
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
