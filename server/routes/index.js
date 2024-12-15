const authController = require("../controller/auth.controller.js");

const router = require("express").Router();

require("express-routes-group");

router.group("/auth", (route) => {
  route.post("/login", authController.login);
  route.post("/verify", authController.verify);
});

router.group("/user", (route) => {
  route.get("/contacts", (req, res) => {
    res.json({ contacts: [] });
  });
});

module.exports = router;
