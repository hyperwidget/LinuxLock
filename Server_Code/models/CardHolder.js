var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    CardHolder = new Schema({
      userRole: String,
    	first: String,
      last: String,
      email: String,
      phone: String,
      cards: [{rfid_id: {type:ObjectId, ref: "RFID"}}],
      zones: [{zone_id: {type:ObjectId, ref: "ZONE"}}]
  	});

module.exports = mongoose.model('CardHolder', CardHolder, 'cardHolders');
