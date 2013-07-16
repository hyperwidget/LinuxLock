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

CardHolder.virtual('fullName').get(function() {
  if(this.first && this.last)
    return this.first + " " + this.last;
  else if(this.first)
    return this.first
  else if(this.last)
    return this.last
  else return null
})

module.exports = mongoose.model('CardHolder', CardHolder, 'cardHolders');
