const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../model/OTPModel");
const SendEmailUtils = require("../utilis/SendEmailUtils");
const queryString = require("queryString");
const stripe =  require('stripe')('sk_test_51OEnDEE7CJNVLFNHoP5cSxNylu7FnRkAKN1pXTip35CrjKIBmc2CQQz8abdv57gtfRQmNZJlaH5z0KQwg5lQ7nwV006n7WEbsr');



//registration
exports.registration = (req, res) => {
  let reqBody = req.body;
  let email = req.body.email;
  console.log(reqBody);
  
  const user = userModel.findOne({email: email})
  if(user){
    return res.status(200).json({
      status: "fail",
      message: "user already exist",
    });
  }
  userModel.create(reqBody, (err, data) => {
    if (err) {
      res.status(200).json({
        status: "fail",
        data: err,
      });
    } else {
      res.status(200).json({
        status: "success",
        data: data,
      });
    }
  });
};

//user login

exports.login = (req, res) => {
  let reqBody = req.body;
  userModel.aggregate(
    [
      { $match: reqBody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          stripe_account_id: 1,
          stripeAccountId: 1,
          stripeCustomerId: 1,

        },
      },
    ],
    (err, data) => {
      if (err) {
        res.status(400).json({ status: "fail", data: err });
      } else {
        if (data.length > 0) {
          let Payload = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: data[0]["email"],
          };
          let token = jwt.sign(Payload, "ahadalichowdhury");
          console.log("login user data", data[0])
          res
            .status(200)
            .json({ status: "success", token: token, data: data[0] });
        } else {
          res.status(401).json({ status: "unauthorized" });
        }
      }
    }
  );
};

//profileUpdate

exports.profileUpdate = (req, res) => {
  let email = req.headers["email"];
  let reqBody = req.body;
  userModel.updateOne({ email: email }, reqBody, (err, data) => {
    if (err) {
      res.status(400).json({
        status: "fails",
        data: err,
      });
    } else {
      res.status(200).json({
        status: "success",
        data: data,
      });
    }
  });
};

exports.profileDetails = (req, res)=>{
  let email = req.headers["email"];
    userModel.aggregate(
        [
            { $match: {email: email} },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    password: 1,
                    firstName: 1,
                    lastName: 1,
                    mobile: 1,
                    photo: 1,
                },
            },
        ],
        (err, data) => {
          if (err) {
            res.status(400).json({status: "fail", data: err});
          } else {
              res.status(200).json({status: "success", data: data});
            }
        });
}


//verify email
exports.RecoverVerifyEmail = async (req, res) => {

    let email = req.params.email;
    //otp code genarate
    let OTPCode = Math.floor(100000 + Math.random() * 900000);


    try {
        //email account find query
        //if counting result is true , then we can decide that user is exist
        let userCount = await userModel.aggregate([{$match: {email: email}},{$count: "total"}])
        if(userCount.length > 0){

            //otp insert

            let createOTP = await OTPModel.create({email: email, otp: OTPCode})

            //email send

            let emailSend = await SendEmailUtils(email, "Your Pin Code is: "+OTPCode, "Pouche Debo Verification System");

            res.status(200).json({status: "success", data: emailSend})
        }else{
            res.status(200).json({status: "fail", data: "User Not Found"})
        }


    }catch (err) {
        res.status(200).json({status: "fail", data: err})
    }

}

exports.recoverOTPVerify = async (req, res) => {
    //find email and otp from the parameter
    let email = req.params.email;
    let OTPCode =req.params.otp;
    let status = 0;



    try{
        //first otp count
        let OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status:status}},{$count: "total"}])
        //check otp for the specific email address if status ==>0 then we use it otherwise not
        //if status = 0 we update the status to 1
        if(OTPCount.length > 0){
            let otpUpdate =await OTPModel.updateOne({email:email, otp: OTPCode, status:status}, {
                email:email,
                otp: OTPCode,
                status: 1
            })
            res.status(200).json({status: "success", data: otpUpdate})
        }else{
            res.status(200).json({status: "fail", data: "Invalid OTP Code"})
        }
    }catch (err) {
        res.status(200).json({status: "fail", data: err})
    }
}

exports.RecoverResetPassword = async (req, res) => {
    let email = req.body['email'];
    let OTPCode = req.body['OTP']
    let newPassword = req.body['password'];

    //we check our otp is already use or not
    let status = 1;
    try{
        let OTPUsedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status:status}},{$count: "total"}])
        if(OTPUsedCount.length > 0){
            let passwordUpdate = await userModel.updateOne({email: email},{
                password: newPassword
            })
            res.status(200).json({status: "success", data: passwordUpdate})
        }else{
            res.status(200).json({status: "fail", data: "OTP Code is not valid"})
        }
    }catch (err) {
        res.status(200).json({status: "fail", data: err})
    }
}


// exports.makeInstructor = async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     // Use findOne instead of find
//     const user = await userModel.findOne({ email: userEmail }).exec();

//     // Check if the user exists
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     //create customer 
//     const customer = await stripe.customers.create({
//       email: user.email,
//     });
//     // Create a Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price: 'price_1OFGWcE7CJNVLFNHGe2cePE8', // Replace with your actual Price ID
//         quantity: 1,
//       }],
      
//       mode: 'payment',
//       success_url: process.env.STRIPE_SUCCESS_URL,
//       cancel_url: process.env.STRIPE_CANCEL_URL,
//       customer: customer.id,
//     });
    
//     await user.save();

//     console.log(session)
//     // Update the user's payment-related fields
//     user.stripeCustomerId = session.customer;
//     // You may want to update other fields like stripeAccountId if you're using Express accounts

//     // Save the updated user
//     await user.save();

//     res.json({ sessionId: session.id });
//   } catch (err) {
//     console.error("MAKE INSTRUCTOR ERROR: ", err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };






