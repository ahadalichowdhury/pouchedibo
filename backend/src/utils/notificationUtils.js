const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const Notification = require("../model/notificationModel");
require("dotenv").config();

initializeApp({
  credential: applicationDefault(),
  projectId: "testing-realtime-commenting",
});

const sendMultiplePushNotification = async (user_id, message, userId) => {
  try {
    console.log(`http://localhost:3000/accept-invitation/${user_id}`)
    console.log(`receiver User id: ${user_id}`);
    console.log(`sender User id: ${userId}`);
    console.log(`Message: ${message}`);
    const tokenCollections = await Notification.find({ user_id });
    if (tokenCollections) {
      const tokens = tokenCollections.map((item) => {
        return item.fcm_token;
      });
      const pushMessage = {
        notification: {
          body: message + `#http://localhost:3000/accept-invitation/${userId}`,
          title: "Book Now?",
         
        },
        tokens,
        webpush: {
          notification: {
            click_action: `http://localhost:3000/accept-invitation/${userId}` 
          },
          fcmOptions: {
            link:  `/accept-invitation/${userId}`
          }
        },
      
      };
      
      const status = await getMessaging().sendMulticast(pushMessage);
      // console.log(status)
      // console.log(pushMessage)
      return status;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

const sendMultipleForApproveAndCancelPushNotification = async (user_id, message) => {
  try {
    
    console.log(`Message: ${message}`);
    const tokenCollections = await Notification.find({ user_id });
    if (tokenCollections) {
      const tokens = tokenCollections.map((item) => {
        return item.fcm_token;
      });
      const pushMessage = {
        notification: {
          body: message ,
          title: "Book Now?",
         
        },
        tokens,
        
      };
      
      const status = await getMessaging().sendMulticast(pushMessage);
      // console.log(status)
      // console.log(pushMessage)
      return status;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

const sendPushNotification = async (user_id, message, token) => {
  try {
    console.log(`User id: ${user_id}`);
    console.log(`Message: ${message}`);
    const pushMessage = {
      notification: {
        body: message,
        title: "Pouche dibo",
      },
      token: token,
    };
    const status = await getMessaging().send(pushMessage);
    console.log("Notification sent successfully:", status);
    return status;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw err;
  }
};

module.exports = {
  sendMultiplePushNotification,
  sendPushNotification,
  sendMultipleForApproveAndCancelPushNotification
};
// $env:GOOGLE_APPLICATION_CREDENTIALS="E:\Rebel Force Tech Solutions\Sonbola MVM\Sonbola-Backend\sonbola-main-firebase-adminsdk-yhc7g-9dcc6cecf6.json"
