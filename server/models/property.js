const mongoose = require('mongoose')
require('@mongoosejs/double');

const propertySchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    propertyName : {type : String, required : true},
    address : {type : String, required : true},
    locality : {type : String, required : true},
    description : {type : String},
    price : { type : Number},
    carpetArea : {type : Number},
    createdOn : { type : Date, default : Date.now() },
    images : [{ type : String}]
})

module.exports = mongoose.model("Property", propertySchema);

