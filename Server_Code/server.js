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

app.configure(function(){
  app.set('views', './../Client_Code/templates');
  app.set('view options', { layout: false });
  app.use(connect.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "shhhhhhhhh!"}));
  app.use(flash());
  app.use(connect.static(__dirname + '/static'));
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

//Authentication 
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    adminRoles.findByEmail(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!adminRoles.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

console.log("Dir Name : " + __dirname);

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

app.get('/', function(req,res){
  console.log('emptyPath');
  res.render('index.jade', {
      title : 'Linux Lock',
      description: 'Starting page',
      author: 'Kaleidus Code'
    });
});

app.post('/login',
  passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/',
   failureFlash: 'Invalid Credentials' })
);

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
