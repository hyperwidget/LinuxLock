var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Event = new Schema({
      device: {type:String, index:true, required:false, default:"Unnamed Device"},
      hostname: {type:String, index:true, required:false, default:""},
    	rfid: {type:String, index:true, required:false},
      cardHolder: {type:String, index:true, required:false},
      entryTime: {type:Date, index:true, required:true, default: new Date()},
      status: {type:String, required:true, default:""} // WAT
  	});

Event.statics.log = function(rfid, user, deviceName, hostName, authorized, status, time)
{
  var RFID = require('./RFID'),
      Device = require('./Device'),
      Event = mongoose.model('Event'),
      CardHolder = require('./CardHolder')
      
      //console.log("RFID: " + rfid)
      //console.log("USER: " + user)
      //console.log("DEVICE: " + deviceName + " (" + hostName + ")")
      //console.log("AUTHORIZED: " + authorized)
      //console.log("STATUS: " + status)
      //console.log("TIME: " + time)
  // status/time are both optional and may be passed in a weird order
  if(status && status instanceof Date) {
    var tmp = status
    var tmp2 = null
    if(time && time instanceof String)
      tmp2 = time
    status = tmp2
    time = tmp
  }

  // If we don't have 'time', just use the current time.
  if(!time)
    time = new Date()

  // If we don't have a status for whatever reason (probably because the Status
  // thing is really poorly defined), then just set it to something based on
  // 'authorization'
  if(!status) {
    if(authorized) status = "authorized"
    else status = "unauthorized"
  }

  // If rfid is instanceof RFID, use its _id, otherwise if it's
  // an instanceof ObjectId, use rfid, otherwise if it's a string,
  // convert string to ObjectId, otherwise null
  if(rfid instanceof RFID) {
    rfid = rfid.rfidNo
  } else if(rfid instanceof ObjectId)
    mongoose.model('RFID').findOne({_id: rfid}, function(err, item) {
      if(item) {
        rfid = item.rfidNo
      }
      else rfid = ""
    })
  else if(typeof rfid === "string") {}
  else
    rfid = ""

  if(user instanceof CardHolder)
    user = user.fullName
  else if(typeof user === "string") {}
  else user = ""

  Event.create({
    device: deviceName,
    hostname: hostName,
    rfid: rfid,
    cardHolder: user,
    // Leave out alias by default, let the web app add them if they want to
    entryTime: time,
    status: status
  }, function(err, item) {
    if(err) console.log('Error logging item: ' + err)
  })
}

module.exports = mongoose.model('Event', Event, 'events');
