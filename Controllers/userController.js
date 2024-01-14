const { createToken } = require("../Middlewares/CreateToken");
const {
  userCreateServices,
  userLoginServices,
  updateUserServices,
} = require("../Services/userServices");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../utils/sendMail");

exports.userCreateController = async (req, res, next) => {
  try {
    // -------get name email password from req.body
    const { name, email, password } = req.body;
    //  ------check if user already exits with this email or not
    const userExits = await userLoginServices(email);
    if (userExits) {
      return res.status(400).send({
        status: false,
        message: "User already exits with this email use another email",
      });
    }
    //  ------check if user already exits with this email or not
    // ------check if  password length was less than 6 or greater than 20
    if (password.length < 6 || password.length > 20) {
      return res.status(400).send({
        status: false,
        message: "Password must be between 6 to 20 characters",
      });
    }
    // ------check if  password length was less than 6 or greater than 20
    //  ------check if name email password is empty or not
    if (!name || !email || !password) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    //  ------send req.body in services-----
    const user = await userCreateServices(req.body);
    if (!user) {
      return res.status(500).send({
        status: false,
        message: "Something went wrong",
      });
    }
    const token = createToken(user);
    if (!token) {
      return res.status(500).send({
        status: false,
        message: "Token not created",
      });
    }
    await sendVerificationEmail(user, token);
    //  send created user data in frontend
    res.status(200).send({
      status: true,
      message: "User created successfully",
      data: user,
      token,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// ------login user-----
exports.userLoginController = async (req, res) => {
  try {
    const { email, password: pass, deviceIdentifier } = req.body;

    // Check for required fields
    if (!email || !pass) {
      return res.status(400).send({
        status: false,
        message: "Please provide both email and password fields",
      });
    }

    const user = await userLoginServices(email);

    // Handle user not found
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found. Please provide a valid email and password.",
      });
    }
    // Compare passwords in constant time
    const comparepassword = await bcrypt.compare(pass, user.password);
    // Handle password mismatch
    if (!comparepassword) {
      return res.status(400).send({
        status: false,
        message: "Password does not match. Please provide a valid password.",
      });
    }

    const token = createToken(user);
    // Handle token creation failure
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Token creation failed. Invalid credentials.",
      });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 86400000, // 1 day
    });
    // Check the number of active devices
    if (user.activeDevice.length >= 3) {
      return res
        .status(403)
        .json({ message: "User already logged in on two devices" });
    }
    // Update the activeDevices array with the current device identifier
    user.activeDevice = [...user.activeDevice, deviceIdentifier];
    await user.save();
    // Send user data in frontend without password
    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      data: rest,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// ------login user-----

// ------update user role-----
exports.updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await updateUserServices(id, role);
    // console.log(user);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found or role already updated",
      });
    }
    res.status(200).send({
      status: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {}
};
// ------update user role-----
