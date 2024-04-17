const UserModel = require("../Models/UserModel");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.userCreateServices = async (user) => {
  try {
    const userCreated = (await UserModel.create(user)).save();
    return userCreated;
  } catch (error) {
    throw error;
  }
};

// -----get userLoginServices------
exports.userLoginServices = async (email) => {
  try {
    const getUser = await UserModel.findOne({
      email,
    });
    return getUser;
  } catch (error) {
    throw error;
  }
};
// -----get userLoginServices------
// -----update user role------
exports.updateUserServices = async (id, role, _id) => {
  try {
    const oldUser = await UserModel.findById(id);
    const isAdminORSuperAdmin = await UserModel.findById(_id);
    if (role === "admin" && isAdminORSuperAdmin.role !== "super-admin") {
      return null;
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, useFindAndModify: false }
    );

    if (updateUser) {
      // Check if the role was actually updated
      if (oldUser.role !== updateUser.role) {
        return updateUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
exports.VerifyTokenServices = async (req, res) => {
  try {
    const { token } = req.params;
    try {
      const user = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const check = await UserModel.findById(user?._id);
      if (check.isVerified === true) {
        return res.status(400).send({
          status: false,
          message: "User already verified",
        });
      } else {
        const data = await UserModel.findByIdAndUpdate(user._id, {
          isVerified: true,
        });
        return res.status(200).send({
          status: true,
          message: "User verified successfully",
          data,
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    throw error;
  }
};
