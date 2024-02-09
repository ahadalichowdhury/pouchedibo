const mongoose = require("mongoose");

const historyData = mongoose.Schema(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    date: {
      type: String,
    },
    type_of_car: {
      type: String,
    },
    
    
    createdDate: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  },
 
  
);

const historyModel = mongoose.model("History", historyData);
module.exports = historyModel;
