const crypto = require("crypto")

exports.generateConfirmationLink = (userId) => {
    let secretKey = process.env.HASH_SECRET_KEY;
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedUserId = cipher.update(userId.toString(), 'utf-8', 'hex');
    encryptedUserId += cipher.final('hex');
    
    const confirmationLink = `http://localhost:3000/confirm/${encodeURIComponent(encryptedUserId)}`;
    return confirmationLink;
  };