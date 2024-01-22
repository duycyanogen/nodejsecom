'use strict'

const mongoose = require('mongoose'); // Erase if already required
//!mdbgum
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME ='Products'

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        trim:true,
    },
    product_thumb:{
        type:String,
        trim:true,
        unique:true,
    },
    product_description:{
        type:String,
    },
    product_price:{
        type:Number,
        require: true,
    },  
    product_quantity:{
        type:Number,
        require: true,
    },  
    product_type:{
        type:String,
        require: true,
        enum: ['Electronics', 'Clothing', 'Funiture']
    }, 
    product_shop: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Shop',
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
},{
    timestamps:true,
    //collation: COLLECTION_NAME
});

const clothingSchema = new mongoose.Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicsSchema = new mongoose.Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'clothes',
    timestamps: true
})

//Export the model
module.exports = {
    
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    electronic: mongoose.model('Electronics', electronicsSchema),
    clothing: mongoose.model('Clothings', clothingSchema),

}