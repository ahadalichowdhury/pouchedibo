const vehicleModel = require("../model/vehicleModel");

exports.createVehicle = async (req, res) => {
  try {
    const { vehicleName, vehicleImage } = req.body;

    // Create a new vehicle instance
    const newVehicle = new vehicleModel({
      vehicleName,
      vehicleImage,
    });

    // Save the new vehicle to the database
    await newVehicle.save();

    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Controller function for getting all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    // Fetch all vehicles from the database
    const vehicles = await vehicleModel.find();

    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error getting vehicles:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
