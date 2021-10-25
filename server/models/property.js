const mongoose = require('mongoose')
require('@mongoosejs/double');

// const ImageSchema = new Schema({
//     url : String
// })

// ImageSchema.virtual('thumbnail').get(function(){
//     return this.url.replace('/upload', '/upload/w_200')
// })

const propertySchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    propertyName : {type : String, required : true},
    address : {type : String, required : true},
    locality : {type : String, required : true},
    description : {type : String},
    price : { type : Number, required : true},
    carpetArea : {type : Number, required : true},
    createdOn : { type : Date, default : Date.now() },
    images : [{ type : String}]
})

module.exports = mongoose.model("Property", propertySchema);

