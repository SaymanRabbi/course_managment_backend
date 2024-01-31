const UserModel = require("../Models/UserModel");

module.exports.authorization = (...role) => {
  return async (req, res, next) => {
    const id = req.userData._id;
    const user = await UserModel.findById(id);
    const userRole = user.role;

    if (!role.includes(userRole)) {
      return res.status(401).send({
        status: false,
        message: "You are not authorized to access this route",
      });
    }
    next();
  };
};
