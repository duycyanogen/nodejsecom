'use strict'

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME ='Keys'
const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'shop',
    },
    publicKey:{
        type:String,
        require:true,
    },
    privateKey:{
        type:String,
        require:true,
    },
    refreshTokenUsed:{
        type:Array,
        default:[],
    },
   refreshToken: {type: String, require: true}
},{
    timestamps:true,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
