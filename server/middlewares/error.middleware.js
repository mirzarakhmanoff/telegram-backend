const BaseError = require("../errors/base.error");

module.exports = function (err, req, res, next) {
  if (res.status) {
    if (err instanceof BaseError) {
      return res
        .status(err.status)
        .json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: err.message });
  } else {
    next(err);
  }
};
