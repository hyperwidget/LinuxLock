var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
  name: "User",
  schema: new Schema({
    name: String,
    email: String,
    phone: String,
    userRole: String
  }),
  collection: "users"
}