const mongoose = require("mongoose");

const driverData = mongoose.Schema(
  {
    holderName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    NID: {
      type: String,
    },
    licenceNumber: {
      type: String,
    },
    vehicleType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle"
    },
    vehicleImage: [
      {
        type: String
      }
    ],
    history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'History',
    }, 
    user:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    driver_mode:{
      type: Boolean,
      default: false,
    },
    createdDate: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  },
 
  
);

const driverModel = mongoose.model("Driver", driverData);
module.exports = driverModel;
