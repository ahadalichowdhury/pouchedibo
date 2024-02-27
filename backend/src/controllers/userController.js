const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../model/OTPModel");
const SendEmailUtils = require("../utilis/SendEmailUtils");
const queryString = require("queryString");
const notificationModel = require("../model/notificationModel");
const {
  sendMultiplePushNotification,
  sendMultipleForApproveAndCancelPushNotification,
} = require("../utils/notificationUtils");
const driverModel = require("../model/driverModel");
const crypto = require("crypto")

const stripe = require("stripe")(
  "sk_test_51OEnDEE7CJNVLFNHoP5cSxNylu7FnRkAKN1pXTip35CrjKIBmc2CQQz8abdv57gtfRQmNZJlaH5z0KQwg5lQ7nwV006n7WEbsr"
);
const bcrypt = require("bcrypt");
const SSLCommerzPayment = require("sslcommerz-lts");
const { ObjectId } = require('mongodb');
const { generateConfirmationLink } = require("../utils/registrationLinkUtils");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false foe sandbox

//registration
exports.registration = async (req, res) => {
  try {
    const reqBody = req.body;
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        status: "fail",
        data: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = await userModel.create({
      ...reqBody,
      password: hashedPassword,
    });

    const confirmationToken = generateConfirmationLink(newUser._id)

    // Send a confirmation email to the user
    const emailMessage = `Click here to confirm your account: ${confirmationToken}`
    const emailSubject = 'RFQ System Account Confirmation'
    const emailSend = await SendEmailUtils(newUser.email, emailMessage, emailSubject)

    newUser.password = undefined

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Something went wrong",
    });
  }
};

//confirm registration
exports.confirmRegistration = async (req, res, next) => {
  try {
    const secretKey = process.env.HASH_SECRET_KEY
    const encryptedUserId = req.params.userId;
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey)
    let decryptedUserId = decipher.update(encryptedUserId, 'hex', 'utf-8')
    decryptedUserId += decipher.final('utf-8')
    // console.log('decrypted user id is', decryptedUserId)

    const user = await userModel.findById(decryptedUserId)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.is_registered = true
    await user.save()

    user.password = undefined

    res.status(200).json({
      status: 'success',
      data: user,
    })
  } catch (error) {
    next(error)
    console.error(error)
    res.status(500).json({ status: 'fail', message: error.message })
  }
}

//user login

exports.login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let currentToken = req.body.currentToken;
    // console.log(currentToken);

    // Find user by email
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ status: "unauthorized" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: "unauthorized" });
    }

    const data = await userModel.aggregate([
      {
        $match: { email: email },
      },
      {
        $project: {
          _id: 1,
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
    ]);

    if (data.length > 0) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: data[0]["email"],
      };
      let token = jwt.sign(Payload, "ahadalichowdhury");

      // Save notification token
      await notificationModel.create({
        user_id: data[0]._id,
        fcm_token: currentToken,
      });

      res.status(200).json({ status: "success", token: token, data: data[0] });
    } else {
      res.status(401).json({ status: "unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.message });
  }
};

//profileUpdate

exports.profileUpdate = async (req, res) => {
  try {
    let email = req.headers["email"];
    let reqBody = req.body;

    // Check if the request body contains a password
    if (reqBody.password) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(reqBody.password, 10);
      // Replace the plain text password with the hashed password
      reqBody.password = hashedPassword;
    }

    // Update the user profile
    const updatedUser = await userModel.updateOne({ email: email }, reqBody);

    if (updatedUser.nModified === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found or no changes to update",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Something went wrong",
    });
  }
};

exports.profileDetails = (req, res) => {
  let email = req.headers["email"];
  userModel.aggregate(
    [
      { $match: { email: email } },
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
        res.status(400).json({ status: "fail", data: err });
      } else {
        res.status(200).json({ status: "success", data: data });
      }
    }
  );
};
exports.ownProfileDetail = async (req, res) => {
  const email = req.headers["email"];
  try {
    const user = await userModel
      .findOne({ email: email })
      .populate("request.user");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ data: user });
  } catch (error) {}
};

const trans_id = new ObjectId().toString();
exports.approveRideFromUser = async (req, res) => {
  const userId = req.params.userId;
  const { driverId, price } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "request.isAccepted": false,
          $unset: { "request.user": "" },
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }
    
    const driverProfile = await userModel.findById(driverId);
    console.log(driverProfile)
   

    const data = {
      total_amount: price,
      currency: "BDT",
      tran_id: trans_id, // use unique tran_id for each api call
      success_url: `http://localhost:8000/api/v1/success`,
      fail_url: "http://localhost:3000/fail",
      cancel_url: "http://localhost:3030/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: driverProfile?.firstName + driverProfile?.lastName,
      cus_email: driverProfile.email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: driverProfile.mobile,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({url: GatewayPageURL});
      console.log("Redirecting to: ", GatewayPageURL);
    });

    await sendMultipleForApproveAndCancelPushNotification(
      driverId,
      "Your ride request has been approved"
    );
    
  } catch (error) {
    console.error("Error approving ride from user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.declineRideFromUser = async (req, res) => {
  const userId = req.params.userId;
  const { driverId } = req.body;
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "request.isAccepted": false,
          $unset: { "request.user": "" },
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    await sendMultipleForApproveAndCancelPushNotification(
      driverId,
      "Your ride request has been decline"
    );
    res.status(200).json({
      status: "success",
      message: "Ride request updated successfully",
    });
  } catch (error) {
    console.error("Error approving ride from user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  //otp code genarate
  let OTPCode = Math.floor(100000 + Math.random() * 900000);

  try {
    //email account find query
    //if counting result is true , then we can decide that user is exist
    let userCount = await userModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);
    if (userCount.length > 0) {
      //otp insert

      let createOTP = await OTPModel.create({ email: email, otp: OTPCode });

      //email send

      let emailSend = await SendEmailUtils(
        email,
        "Your Pin Code is: " + OTPCode,
        "Pouche Debo Verification System"
      );

      res.status(200).json({ status: "success", data: emailSend });
    } else {
      res.status(200).json({ status: "fail", data: "User Not Found" });
    }
  } catch (err) {
    res.status(200).json({ status: "fail", data: err });
  }
};

exports.findSingleUserFromId = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "user found",
      data: user,
    });
  } catch (error) {}
};

exports.recoverOTPVerify = async (req, res) => {
  //find email and otp from the parameter
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;

  try {
    //first otp count
    let OTPCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTPCode, status: status } },
      { $count: "total" },
    ]);
    //check otp for the specific email address if status ==>0 then we use it otherwise not
    //if status = 0 we update the status to 1
    if (OTPCount.length > 0) {
      let otpUpdate = await OTPModel.updateOne(
        { email: email, otp: OTPCode, status: status },
        {
          email: email,
          otp: OTPCode,
          status: 1,
        }
      );
      res.status(200).json({ status: "success", data: otpUpdate });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid OTP Code" });
    }
  } catch (err) {
    res.status(200).json({ status: "fail", data: err });
  }
};

exports.RecoverResetPassword = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let newPassword = req.body["password"];

  // Check if the request body contains a new password
  if (newPassword) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Check if OTP is valid and not already used
      let status = 1;
      let OTPUsedCount = await OTPModel.aggregate([
        { $match: { email: email, otp: OTPCode, status: status } },
        { $count: "total" },
      ]);

      if (OTPUsedCount.length > 0) {
        // Update the user's password with the hashed new password
        let passwordUpdate = await userModel.updateOne(
          { email: email },
          {
            password: hashedPassword,
          }
        );

        res.status(200).json({ status: "success", data: passwordUpdate });
      } else {
        res.status(200).json({ status: "fail", data: "OTP Code is not valid" });
      }
    } catch (err) {
      res.status(200).json({ status: "fail", data: err });
    }
  } else {
    res.status(200).json({ status: "fail", data: "New password is required" });
  }
};

exports.makeInstructor = async (req, res) => {
  const userEmail = req.body.email;

  try {
    // Use findOne instead of find
    const user = await userModel.findOne({ email: userEmail }).exec();

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    //create customer
    const customer = await stripe.customers.create({
      email: user.email,
    });
    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1OFGWcE7CJNVLFNHGe2cePE8", // Replace with your actual Price ID
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer: customer.id,
    });

    await user.save();

    console.log(session);
    // Update the user's payment-related fields
    user.stripeCustomerId = session.customer;
    // You may want to update other fields like stripeAccountId if you're using Express accounts

    // Save the updated user
    await user.save();

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("MAKE INSTRUCTOR ERROR: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.sendNotificationForAvailableDriver = async (req, res) => {
  const { vehicleId, senderUserId, startLocation, endLocation } = req.body;

  try {
    // console.log(userId)
    // Find the driver documents with the given vehicleId
    const drivers = await driverModel.find({
      vehicleType: vehicleId,
      driver_mode: true,
    });
    console.log("drivers",drivers)
    // return;

    if (!drivers || drivers.length === 0) {
      return res
        .status(403)
        .json({ message: "Drivers not found for the given vehicle ID" });
    }

    // Extract the user IDs from the drivers
    const userIds = drivers.map((driver) => driver.user);
    console.log("user Ids",userIds)

    // Send notifications to users with the retrieved user IDs
    for (const userId of userIds) {
      await sendMultiplePushNotification(
        userId,
        `Are Your want to ride ${startLocation} to ${endLocation}             `,
        senderUserId
      );
    }

    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.acceptUser = async (req, res) => {
  const userId = req.params.userId;
  const { isAccepted } = req.body;
  const email = req.headers.email;
  console.log(email);
  try {
    const driverUser = await userModel.findOne({ email: email });
    if (!driverUser) {
      return res.status(403).json({ message: "Your Profile is not found" });
    }
    const user = await userModel.findByIdAndUpdate(
      userId,
      { "request.isAccepted": true, "request.user": driverUser._id },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "User accepted successfully", user });
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.successPage = async (req, res)=>{
  res.redirect("http://localhost:3000/success");
}