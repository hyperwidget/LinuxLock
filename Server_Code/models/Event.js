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

Event.statics.log = function(rfid, device, authorized, status, time)
{
  var RFID = require('./RFID'),
      Device = require('./Device'),
      Event = mongoose.model('Event'),
      user = "",
      hostname = ""
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

  function getUserName(rfid) {
    var result = null
    // If we have an RFID object, use it to get the username.
    mongoose.model('CardHolder').findOne({_id: rfid.cardHolder}, function(err, item) {
      if(item) result = item.fullName
      else result = ""
    })
    function sleep() {
      if(result === null) setTimeout(sleep,0)
    }
    sleep()
    return result
  }

  // If rfid is instanceof RFID, use its _id, otherwise if it's
  // an instanceof ObjectId, use rfid, otherwise if it's a string,
  // convert string to ObjectId, otherwise null
  if(rfid instanceof RFID) {
    rfid = rfid.rfidNo
    user = getUserName(rfid)
  } else if(rfid instanceof ObjectId)
    mongoose.model('RFID').findOne({_id: rfid}, function(err, item) {
      if(item) {
        rfid = item.rfidNo
        user = getUserName(item)
      }
      else rfid = ""
    })
  else if(rfid instanceof String) {}
  else
    rfid = ""

  // Same deal for Device
  if(device instanceof Device ||
  device instanceof Object &&
  "device" in device && "hostname" in device) {
    device = device.name
    hostname = device.hostname
  }
  else if(device instanceof ObjectId)
    mongoose.model('Device').findOne({_id: device}, function(err, item) {
      if(!item) {
          device = "";
          hostname = "";
      } else {
        device = item.name;
        hostname = item.hostname;
      }
    })
  else {
    device = "", hostname = ""
  }

  Event.create({
    device: device,
    hostname: hostname,
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
