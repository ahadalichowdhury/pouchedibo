const mongoose = require("mongoose");

const vehicleData = mongoose.Schema(
  {
    vehicleName:{
        type: String
    },
    vehicleImage:{
        type: String
    }
  },
  {
    versionKey: false,
    timestramps: true,
  },
 
  
);

const vehicleModel = mongoose.model("Vehicle", vehicleData);
module.exports = vehicleModel;
