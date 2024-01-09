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
exports.updateUserServices = async (id, role) => {
  try {
    const oldUser = await UserModel.findById(id);
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, useFindAndModify: false }
    );
    if (updateUser) {
      // Check if the role was actually updated
      if (oldUser.role !== updateUser.role) {
        await sendMail(updateUser);
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
    const user = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(400).send({
            status: false,
            message: "Token Expired",
          });
        }
      }
    );
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
    throw error;
  }
};
