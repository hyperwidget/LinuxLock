var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Zone = new Schema({
    	name: {type:String, unique:true, index:true},
    	devices: [{type:ObjectId, ref:"Device"}]
    });

module.exports = mongoose.model('Zone',Zone,'zones');
