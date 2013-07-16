var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    RFID = new Schema({
      rfidNo: {type:String, unique:true, index:true},
      status: {type:String},
      cardHolder_id: {type:ObjectId, ref:"CardHolder"}
    });

RFID.methods.isActive = function(done) {
  var s = this.status.toLowerCase();
  if(done) done(s==="a");
  else return s === "a";
}

RFID.methods.isInactive = function(done) {
  var s = this.status.toLowerCase();
  if(done) done(s==="n");
  else return s === "n";
}

// Given a device hostname and a swiped RFID number,
// determine:
// A) The User associated with the card,
// B) The Device itself,
// C) The RFID itself,
// D) The Zones which contain the Device, and for which
//    the User is authorized.
//
// Return all of this information to the caller, as well
// as the authorization status, so that logging can be
// implemented in a complete manner.
RFID.statics.isAuthorizedForDevice = function(options,done) {
  var Device = mongoose.model('Device'),
      Zone = mongoose.model('Zone'),
      CardHolder = mongoose.model('CardHolder'),
      RFID = mongoose.model('RFID');
  var zones = null, rfid = null, device = null, user = null;
  var userZones = [];

  function findRFID(done) {
    RFID.findOne({rfidNo: options.rfidNo}, function(err, item) {
      rfid = item
      done(err);
    });
  }
  function findUser(done) {
    if(rfid) {
      //console.log("Searching for CardHolder with id '" + rfid.cardHolder_id + "'")
      CardHolder.findOne({_id: rfid.cardHolder_id},
      function(err, item) {
        user = item;
        // i blame your database design for having to do this -_--
        for(i = 0; i < user.zones.length; ++i) {
          //console.log("Zone #" + i + ": " + user.zones[i].zone_id)
          userZones.push(user.zones[i].zone_id)
        }
        done(err)
      })
    }
    else done(null)
  }
  function findDevice(done) {
    //console.log("Searching for device at " + options.hostname)
    Device.findOne({hostname: options.hostname}, function(err, item) {
      device = item
      done(err)
    })
  }
  function findZones(done) {
    if(device && user) {
      Zone.find(
        { $and : [ { _id: { $in : userZones } }, 
        { devices : { $elemMatch : device._id } } ] },
        //{ $and : [ {_id: { $in : user.zones }}, 
        //{devices: {$elemMatch : device._id} } ] },
      function(err, items) {
        zones = items
        done(err)
      })
    }
    else done(null)
  }

 findRFID(function(err) {
    if(err) console.log(err);
    findUser(function(err) {
      if(err) console.log(err);
      findDevice(function(err) {
        if(err) console.log(err);
        findZones(function(err) {
          if(err) console.log(err);
          var item = {
            zones: zones,
            device: device,
            user: user,
            rfid: rfid,
            // Authorize by default, only de-authorize if a problem
            // is found.
            // TODO: This is not a particularly good strategy, fix this
            // some day.
            auth: true
          };
          // Do we have an active card?
          if(!rfid.isActive()) item.auth = false;
          // Do we have a device?
          else if(!device) item.auth = false;
          // Do we have a user associated with the card?
          else if(!user) item.auth = false;
          // Is that user authorized for any zones that contain the device?
          else if(!zones || !zones.length) item.auth = false;
          // TODO: Make an array of errors, and pass them all back
          // to the caller
          done(err, item);
        })
      })
    })
  })
}

module.exports = mongoose.model('RFID',RFID,'rfids');
