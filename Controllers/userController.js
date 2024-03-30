const mongoose = require('mongoose');
const { createToken } = require("../Middlewares/CreateToken");
const {
  userCreateServices,
  userLoginServices,
  updateUserServices,
} = require("../Services/userServices");
const bcrypt = require("bcrypt");
const { generateUniqueCode } = require("../utils/uniqueCode");
const ChangesPass = require("../Models/ChangesPass");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../utils/sendMail");
const UserModel = require("../Models/UserModel");
const CourseModel = require("../Models/CourseModel");
const Notification = require('../Models/Notification');
exports.userGetAllUser = async (req, res) => {
  try {
     
    const users = await UserModel.find({}).select("-password");
    if (!users) {
      return res.status(404).send({
        status: false,
        message: "Users not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}
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
      message: "User created successfully Please check Email to verify Account",
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
    if (!user.isVerified) {
      return res.status(400).send({
        status: false,
        message: "Please Verify Your email",
      });
    }

    const token = createToken(user);
    // Handle token creation failure
    if (!token) {
      return res.status(500).json({
        status: false,
        message: "Token creation failed. Invalid credentials.",
      });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 86400000, // 1 day
    });
    // Check the number of active devices
    // if (user.activeDevice.length >= 10) {
    //   return res.status(403).json({
    //     message: "User already logged in on 10 devices",
    //     status: false,
    //   });
    // }
    // Update the activeDevices array with the current device identifier
    user.activeDevice = [...user.activeDevice, deviceIdentifier];
    await user.save();
    // Send user data in frontend without password
    const { password, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      data: rest,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// ------login user-----
exports.useLoginUserWithTokenController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const user = await UserModel.findById(_id).select("-password");
    res.status(200).send({
      status: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
// ------update user role-----
exports.updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!id) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await updateUserServices(id, 'admin');

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
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
// ------update user role-----

// changes password
exports.userForgotPasswordController = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).send({
        status: false,
        message: "Please provide email",
      });
    }
    const user = await userLoginServices(email);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const makeCode = generateUniqueCode();
    await sendForgotPasswordEmail(user, makeCode);
    // -----check id exits or not
    const exits = await ChangesPass.findOne({ userId: user._id });
    if (exits) {
      await ChangesPass.findOneAndUpdate(
        { userId: user._id },
        { Passcode: makeCode }
      );
    }
    if (!exits) {
      const makeTempPass = await ChangesPass.create({
        Passcode: makeCode,
        userId: user._id,
      });
      makeTempPass.save();
    }
    res.status(200).send({
      status: true,
      message: "Code sent successfully",
      code: makeCode,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
// changes password
exports.userChangePasswordController = async (req, res) => {
  try {
    const { password, code, _id } = req.body;
    if (!password || !code || !_id) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    // -----check id exits or not
    const exits = await ChangesPass.findOne({ userId: _id });
    if (!exits) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    if (exits.Passcode !== parseInt(code)) {
      return res.status(400).send({
        status: false,
        message: "Code not matched",
      });
    }
    const user = await UserModel.findById({
      _id,
    });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) {
      return res.status(500).send({
        status: false,
        message: "Something went wrong",
      });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true, useFindAndModify: false }
    );
    if (!updatedUser) {
      return res.status(500).send({
        status: false,
        message: "Something went wrong",
      });
    }
    return res.status(200).send({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

exports.useUpdateQuizScoreController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { id } = req.params;
    const { courseId, score, submitAnswerobg, title, quizLength } = req.body;
    if (!courseId || score === undefined) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const exits = user.quizs.find((item) => item.quizId == id);
    if (!exits) {
      user.quizs.push({
        courseId,
        score,
        quizId: id,
        submitAnswerobg,
        title,
        quizLength,
      });
      await user.save();
      return res.status(200).send({
        status: true,
        message: "Update Quiz Score successfully",
      });
    }
    if (exits) {
      const index = user.quizs.findIndex((item) => item.quizId == id);
      user.quizs[index].score = score;
      user.quizs[index].submitAnswerobg = submitAnswerobg;

      await user.save();
      return res.status(200).send({
        status: true,
        message: "Update Quiz Score successfully",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.useUpdateUserProfileController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const {
      name,
      lastname,
      UserName,
      PhoneNumber,
      ExpartIn,
      Biography,
      displayName,
    } = req.body;
    if (!name || !lastname || !UserName || !PhoneNumber || !ExpartIn) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        name,
        lastname,
        UserName,
        PhoneNumber,
        ExpartIn,
        Biography,
        displayName,
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: true,
      message: "Update Profile successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

exports.useUpdateUserProfileProgressController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const {  lessonId, title } = req.body;
    if (!lessonId || !title) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await UserModel.findById(_id);
    
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const exits = user.courseProgress.find((item) => {
      if(item.courseId == lessonId && item.title == title){
        return true
      }
      return false
    });
    if(exits){
      return res.status(200).send({
        status: true,
        message: "Update Profile Progress successfully",
      });
    }

    // check total video in course
      const course = await CourseModel.find({})
      
      const totalLesson = course[0].modules.reduce((accModule, module) => {
        const moduleVideoCount = module.lessons.reduce((accLesson, lesson) => {
          if (lesson.type === "video") {
            accLesson++;
          }
          return accLesson;
        }, 0);
      
        return accModule + moduleVideoCount;
      }, 0);
    if (!exits) {
      user.courseProgress.push({
        courseId: lessonId,
        title,
      });
      const progress = user.seeTotalVideo + 1;
      user.seeTotalVideo = progress;
      user.prfileProgress = (progress / totalLesson) * 100;
      await user.save();
      return res.status(200).send({
        status: true,
        message: "Update Profile Progress successfully",
      });
    }
    if (exits) {
      return res.status(200).send({
        status: true,
        message: "Update Profile Progress successfully",
      });
    }
    
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}

exports.updateImageController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { imageUrl } = req.body
    if (!imageUrl) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        ProfileImage: imageUrl,
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: true,
      message: "Update Image successfully",
      data: user,
    });
  } catch (error) {
   
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}
exports.instructorInfoController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        status: false,
        message: "Please provide all the fields",
      });
    }
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      status: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}

exports.getLeaderboardController = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await UserModel.find({}).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Users not found",
      });
    }

    // Calculate total score for each user
    const leaderboard = users.map(user => {
      // Calculate total quiz score
      const quizScore = user.quizs.reduce((total, quiz) => total + quiz.score, 0);

      // Calculate total assignment score
      const assignmentScore = user.assignment.reduce((total, mark) => Number(total) + Number(mark), 0);

      // Calculate total score (sum of quiz score and assignment score)
      const totalScore = quizScore + assignmentScore;

      // Return user with their total score
      return { user, totalScore };
    });

    // Sort users based on total score in descending order
    // Filter out users with null totalScore
const filteredLeaderboard = leaderboard.filter(entry => entry.totalScore !== null);

filteredLeaderboard.sort((a, b) => b.totalScore - a.totalScore);

// Prepare response
const responseData = filteredLeaderboard.map(entry => ({
  name: entry.user.name,
  totalScore: entry.totalScore,
  image: entry.user.ProfileImage || '' // Assuming ProfileImage is the property holding the user's image
}));

    res.status(200).json({
      status: true,
      message: "Leaderboard generated successfully",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};