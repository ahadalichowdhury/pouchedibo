const mongoose = require("mongoose");

const userData = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
    },
    photo: {
      type: String,
    },
     //this is for payment method stripe
     stripeCustomerId: {
      type: String, // Store the Stripe Customer ID associated with the user
    },
    stripeAccountId: {
      type: String, // Store the Stripe Account ID for Express accounts
    },
    Driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'History',
    },
    
    createdDate: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  },
 
  
);

const userModel = mongoose.model("user", userData);
module.exports = userModel;
