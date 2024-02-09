const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      fcm_token: {
        type: String,
        required: true,
      },
  },
  {
      timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;