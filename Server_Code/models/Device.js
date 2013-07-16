var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Device = new Schema({
    	name: {type:String, unique:true, index:true, required:true},
    	type: {type:Number, index:true},
      hostname: {type:String, index:{unique:true,sparse:true},required:false}
    });

module.exports = mongoose.model('Device',Device,'devices');
