const express = require("express");
const router = express.Router();
const {
  registration,
  profileUpdate,
  login,
  profileDetails, RecoverVerifyEmail, recoverOTPVerify, RecoverResetPassword, acceptUser,makeInstructor,sendNotificationForAvailableDriver,findSingleUserFromId,ownProfileDetail,approveRideFromUser, declineRideFromUser,successPage,confirmRegistration
} = require("../controllers/userController");
const historyController = require("../controllers/historyController")
const driverController = require("../controllers/driverController")
const vehicleController =  require("../controllers/vehicleController")

const authMiddleware = require("../middleware/authVerifyMiddleware");
const multer = require("multer");
const { uploadImage } = require("../utils/uploadImageUtils");
//upload image 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/upload', upload.single("file"), uploadImage);


router.post("/registration", registration);
router.get("/confirm/:userId", confirmRegistration);
router.post("/login", login);
router.post("/profileUpdate", authMiddleware, profileUpdate);
router.get("/userInfo/:userId", findSingleUserFromId)
router.get("/RecoverVerifyEmail/:email", RecoverVerifyEmail)
router.get("/RecoverVerifyOTP/:email/:otp", recoverOTPVerify)
router.post("/RecoverResetPassword", RecoverResetPassword)
router.post("/make-instructor", makeInstructor);

//history controller
router.post("/createHistory",authMiddleware, historyController.createHistory);



router.get("/profileDetails", authMiddleware, profileDetails);
router.get("/ownProfileDetails", authMiddleware, ownProfileDetail);
router.put("/approve-ride/:userId", approveRideFromUser);
router.put("/decline-ride/:userId", declineRideFromUser);
router.post("/createDriverProfile", authMiddleware, driverController.createDriverProfile);
router.get("/getProfile", authMiddleware, driverController.getUserData)
router.put("/driver-mode", authMiddleware, driverController.updateAvailableToggle)


router.post('/vehicles', vehicleController.createVehicle);

// Route for getting all vehicles
router.get('/vehicles', vehicleController.getAllVehicles);

router.put('/sendNotification', authMiddleware,sendNotificationForAvailableDriver);
router.put('/acceptUser/:userId',authMiddleware, acceptUser);
router.post("/success", successPage)
module.exports = router;
