'use strict'

// Import the necessary modules
const { model, Schema, Types } = require("mongoose");

// Create the schema for the Apikey model
const apiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  permissions: {
    type: [String],
    required: true,
    enum: [
      "0000",
      "1111",
      "2222",
    ],
  },
}, {
    timestamps: true
});


// Export the model
module.exports = model("Apikey", apiKeySchema);
