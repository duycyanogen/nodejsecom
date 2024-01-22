'use strict'

const mongoose = require('mongoose'); // Erase if already required
//!mdbgum
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME ='shops'

// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        maxLength:150,
    },
    email:{
        type:String,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },  
    verify:{
        type:Boolean,
        default:false,
    },
    roles:{
        type:Array,
        default:[],
    },  
},{
    timestamps:true,
    //collation: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
