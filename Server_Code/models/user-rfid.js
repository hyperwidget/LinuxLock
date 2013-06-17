var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
  name: "UserRFID",
  schema: new Schema({
    user: {type: Schema.ObjectId, ref: "User"},
    rfidNo: Number
  }),
  collection: "userRFIDs"
}
