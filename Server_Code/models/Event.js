var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Event = new Schema({
      device_id : {type:ObjectId, ref: "Device"},
    	rfid_id: {type:ObjectId, ref: "RFID"},
      alias: {type:String}, // What is this??? WAT. SHOULD IT BE INDEXED???
      entry_time: {type:Date, required:true},
      status: {type:String, required:true, default:""}, // WAT
  	});

Event.statics.log = function(rfid, device, authorized, status, time)
{
  var RFID = require('./RFID'),
      Device = require('./Device'),
      Event = mongoose.model('Event')
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
  if(rfid instanceof RFID)
    rfid = rfid._id;
  else if(rfid instanceof ObjectId)
    rfid = rfid // avoid lint-warnings
  else if(rfid instanceof String)
    // TODO: if this throws, make it null
    rfid = new ObjectId(rfid)
  else
    rfid = null

  // Same deal for Device
  if(device instanceof Device)
    device = device._id
  else if(device instanceof ObjectId)
    device = device // avoid lint-warnings
  else if(device instanceof String)
    // TODO: if this throws, make it null
    device = new ObjectId(device)
  else
    device = null

  Event.create({
    device_id: device,
    rfid_id: rfid,
    // Leave out alias by default, let the web app add them if they want to
    entry_time: time,
    status: status
  }, function(err, item) {
    if(err) console.log('Error logging item: ' + err)
  })
}

module.exports = mongoose.model('Event', Event, 'events');
