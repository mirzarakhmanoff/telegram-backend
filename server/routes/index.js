const authController = require("../controller/auth.controller.js");
const userController = require("../controller/user.controller.js");

const router = require("express").Router();

require("express-routes-group");

router.group("/auth", (route) => {
  route.post("/login", authController.login);
  route.post("/verify", authController.verify);
});

router.group("/user", (route) => {
  route.get("/messages/:contactId", userController.getMessages);
  route.get("/contacts", userController.getContacts);

  route.post("/message", userController.createMessage);
  route.post("/contact", userController.createContact);
  route.post("reaction", userController.createReaction);
  route.post("/send-otp", userController.sendOtp);
  route.post("message-read", userController.messageRead);

  route.put("/message/:messageId", userController.updateMessage);
  route.put("/profile", userController.updateProfile);
  route.put("email", userController.updateEmail);

  route.delete("/message/:messageId", userController.deleteMessage);
  route.delete("/", userController.deleteUser);
});

module.exports = router;
