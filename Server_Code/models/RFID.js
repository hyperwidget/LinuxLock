var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    RFID = new Schema({
      rfidNo: {type:String, unique:true, index:true},
      status: {type:String},
    });

RFID.methods.isActive = function(done) {
  var s = this.status.toLowerCase();
  if(done) done(s==="active");
  else return s === "active";
}

RFID.methods.isInactive = function(done) {
  var s = this.status.toLowerCase();
  if(done) done(s==="inactive");
  else return s === "inactive";
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
  var zone = null, rfid = null, device = null, user = null;
  var userZones = [];

  function findRFID(done) {
    //console.log("Searching for RFID with rfidNo '" + options.rfidNo + "'")
    RFID.findOne({rfidNo: options.rfidNo}, function(err, item) {
      rfid = item
      done(err);
    });
  }
  function findUser(done) {
    if(rfid) {
      console.log("Searching for CardHolder with rfid '" + rfid._id + "'")
      CardHolder
      .findOne({cards: {$elemMatch: { rfid_id: rfid._id}}})
      .lean()
      .exec(function(err, item) {
        user = item;
        if(!user) return done(err)
        userZones = user.zones.map(function(item) {
          //console.log("USER ZONE: " + item.zone_id)
          return item.zone_id
        })
        done(err)
      })
    }
    else done(null)
  }
  function findDevice(done) {
    //console.log("Searching for device at " + options.hostname)
    Device
    .findOne({hostname: options.hostname})
    .lean()
    .exec(function(err, item) {
      device = item
      done(err)
    })
  }
  function findZones(done) {
    if(device && user) {
      //console.log("User Zones: " + JSON.stringify(userZones))
      Zone
      .find({ _id: { $in : userZones } })
      .lean()
      .exec(function(err, items) {
        // Low-performance hack :(
        //console.log("There are `" + items.length + "' to check (" + JSON.stringify(items) + "):")
        items.every(function(z) {
          //console.log("Item `" + JSON.stringify(z) + "'")
          return z.devices.some(function(d) {
            //console.log("Trying to match `" + d.device_id + "' ("+typeof d.device_id+") against `" + device._id + "' (" + typeof device._id + ")")
            if(d.device_id.equals(device._id)) {
              //console.log("Matched!")
              zone = z
              return true
            }
            return false
          })
        })
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
            zone: zone,
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
          if(!rfid) item.auth = false;
           else if(!rfid.isActive()) item.auth = false;
          // Do we have a device?
          else if(!device) item.auth = false;
          // Do we have a user associated with the card?
          else if(!user) item.auth = false;
          // Is that user authorized for any zones that contain the device?
          else if(!zone) item.auth = false;
          // TODO: Make an array of errors, and pass them all back
          // to the caller
          done(err, item);
        })
      })
    })
  })
}

module.exports = mongoose.model('RFID',RFID,'rfids');
