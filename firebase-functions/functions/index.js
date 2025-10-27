const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 🔥 HTTP function to trigger push notification manually or via scheduler
exports.sendReminderNotification = functions.https.onRequest(async (req, res) => {
  const token = req.body.token; // device token sent from frontend

  if (!token) {
    return res.status(400).send("Missing FCM token");
  }

  const message = {
    notification: {
      title: "⏰ Task Reminder",
      body: "You have pending tasks!",
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).send("Failed to send notification");
  }
});
