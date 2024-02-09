const driverModel = require("../model/driverModel");
const userModel = require("../model/userModel");

exports.createDriverProfile = async (req, res) => {
  const email = req.headers.email;
  console.log("email", email);
  const reqBody = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json("User not found");
    }
    // Create a new driver profile using the driverModel
    const driverProfile = await driverModel.create(reqBody);
    if (!driverProfile) {
      return res.status(401).json("Failed to create Driver Profile");
    }
    user.Driver = driverProfile._id;
    await user.save();
    res.status(201).json({ success: true, data: driverProfile });
  } catch (error) {
    // Handle any errors
    console.error("Error creating driver profile:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getUserData = async (req, res) => {
  const email = req.headers.email;
  console.log(email);
  try {
    const user = await userModel.findOne({ email: email }).populate({
      path: "Driver",
      model: "Driver",
      populate: {
        path: "vehicleType",
        model: "Vehicle"
      },
    });

    if (!user) {
      return res.status(404).json("Failed to find User Data");
    }

    return res.status(200).json({ success: "success", data: user });
  } catch (error) {
    console.log(error);
  }
};
