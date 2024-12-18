const BaseError = require("../errors/base.error");
const userModel = require("../models/user.model");

class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body;
      const existUser = userModel.findOne({ email });
      if (existUser) {
        throw BaseError.BadRequest("User already exists", [
          { email: "User already exists" },
        ]);
      }
      const createUser = await userModel.create({ email });
      res.status(201).json(createUser);
    } catch (error) {
      next(error);
    }
  }
  async verify(req, res, next) {
    const { email, otp } = req.body;
    res.json({ email, otp });
  }
}

module.exports = new AuthController();
