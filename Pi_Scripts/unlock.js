var restify = require('restify')
var readline = require('readline')

var SerialPort = require('serialport').SerialPort

var serial = new SerialPort('/dev/ttyUSB0', {
  baudrate: 2400
})

serial.on('open',function() {
  console.log('SerialPort open')
})

// TODO:
// Probably want some configuration file that points to the
// webservice, since we can't expect it to be 192.168.0.18:8080
// all the time.
var client = restify.createJsonClient({
  url: 'http://192.168.0.18:8080',
  version: '~1.0'
})

var lastRead = 0
var id = ''

function tryUnlock(id) {
  client.get('/auth/rfid/'+id, function(err,req,res,obj) {
    if(err) console.log(err)
    else if("auth" in obj) {
      if(obj.auth) {
        console.log('Welcome to paradise!')
      } else {
        console.log('Sorry, you\'re not allowed inside :(')
      }
    } else {
      console.log('Unexpected response...')
    }
  })
}

serial.on('data', function(data){
  var text = data.toString('ascii').match(/\w*/)[0]
  if(id.length > 0 && text.length < 1) {
    var read = new Date().getTime()
    if(read - lastRead > 999) {
      tryUnlock(id)
      lastRead = read
    }
    id = ''
    return
  }
  id = id + text
})

