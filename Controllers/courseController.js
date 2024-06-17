const CourseModel = require("../Models/CourseModel");
const Notification = require("../Models/Notification");
const { courseCreateService } = require("../Services/courseServices");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const UserModel = require("../Models/UserModel");
const AssignmentModal = require("../Models/AssignmentModal");
const { sendAssignmentMark } = require("../utils/sendMail");
cloudinary.config({
  cloud_name: "dnr5u3jpb",
  api_key: "169991872792189",
  api_secret: "eB1Gjuqv1mIorndCfpyF5_F4RN8",
});
const upload = multer({ dest: "uploads/" });
exports.createCourseController = async (req, res) => {
  try {
    const { title, description, modules, image, price } = req.body;

    // -------get id from token
    const { _id } = req.userData;
    if (!title || !description || !modules || !image || !price) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
    const data = {
      title,
      description,
      teacherID: _id,
      modules,
      image,
      price,
    };
    // -------create course
    const course = await courseCreateService(data);
    if (!course) {
      return res.status(400).send({
        status: false,
        message: "Course not created",
      });
    }
    res.status(200).send({
      status: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

exports.getCourseController = async (req, res) => {
  try {
    // const { courseid } = req.body;
    // if (!courseid) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Please fill all required fields",
    //   });
    // }
    // -------get course
    // const course = await courseGetService(courseid);
    const course = await CourseModel.find({});
    if (!course) {
      return res.status(400).send({
        status: false,
        message: "Course not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Course found successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

exports.updateCourseController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { id } = req.params;
    if (!id || !req.body) {
      return res.status(400).json({
        status: false,
        message: "Please provide course ID and new module data",
      });
    }
    const updatedCourse = await CourseModel.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          modules: req.body,
        },
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }
    await Notification.create({
      message: "New module added to the course successfully",
      individual: false,
      id: _id,
    });
    res.status(200).json({
      status: true,
      message: "New module added to the course successfully",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getQuizController = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseid } = req.body;
    if (!id || !courseid) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
    const course = await CourseModel.findById(courseid);
    if (!course) {
      return res.status(400).send({
        status: false,
        message: "Course not found",
      });
    }
    const quiz = course.modules.id(id).lessons.filter((lesson) => {
      if (lesson.type === "quiz") {
        return lesson;
      }
    });
    if (!quiz) {
      return res.status(400).send({
        status: false,
        message: "Quiz not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Quiz found successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

exports.getNotificationController = async (req, res) => {
  try {
    const { _id } = req.userData;
    // Fetch notifications where individual is false or individual is true and userId matches
    const notifications = await Notification.find({
      $or: [
        { individual: false }, // Filter for notifications meant for all users
        {
          $and: [
            // Filter for individual notifications meant for the current user
            { individual: true },
            { userId: _id },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    if (!notifications) {
      return res.status(400).send({
        status: false,
        message: "Notification not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Notification found successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
// update assignment
exports.updateAssignmentController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const {
      moduleId,
      AssignmentMarks,
      AssignmentFile,
      AssignmentName,
      AssignmentDescription,
      AssignmentDeadline,
    } = req.body;
    if (
      !moduleId ||
      !AssignmentMarks ||
      !AssignmentFile ||
      !AssignmentName ||
      !AssignmentDescription ||
      !AssignmentDeadline
    ) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
    const AddAssignment = await AssignmentModal.create({
      AssignmentName,
      AssignmentDescription,
      AssignmentFile,
      AssignmentDeadline,
      AssignmentMarks,
      userId: _id,
      moduleId,
    });

    if (!AddAssignment) {
      return res.status(404).send({
        status: false,
        message: "Assignment not found",
      });
    }
    // todo: create notification
    // await Notification.create({
    //     message: "Assignment submitted successfully",
    // })
    res.status(200).send({
      status: true,
      message: "Assignment submitted successfully",
      data: AddAssignment,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.notificationController = async (req, res) => {
  try {
    const { text } = req.body;
    const { _id } = req.userData;

    const data = await Notification.create({
      message: text,
      individual: false,
      userId: _id,
    });
    res.status(200).send({
      status: true,
      message: "Add Notification successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.getAssignmentWithIdController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const assignment = await AssignmentModal.find({ userId: _id });

    if (!assignment) {
      return res.status(400).send({
        status: false,
        message: "Assignment not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Assignment found successfully",
      data: assignment,
    });
  } catch (error) {}
};
exports.getAllAssignmentsController = async (req, res) => {
  try {
    const assignment = await AssignmentModal.find({})
      .populate("userId")
      .sort({ adminSeen: 1, createdAt: -1 });
    if (!assignment) {
      return res.status(400).send({
        status: false,
        message: "Assignment not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Assignment found successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.updateAssignmentMarkController = async (req, res) => {
  try {
    const { id } = req.params;
    const { AssignmentMarks, userId, AssignmentNote } = req?.body?.datas;
    Number(AssignmentMarks);
    if (!id || !AssignmentMarks) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
    const userUpdate = await UserModel.findById({
      _id: userId,
    });
    userUpdate.assignment.push(AssignmentMarks);
    userUpdate.save();
    const assignment = await AssignmentModal.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        AssignmentMarks,
        adminSeen: true,
      }
    );
    if (!assignment) {
      return res.status(400).send({
        status: false,
        message: "Assignment not found",
      });
    }
    await Notification.create({
      message: `Assignment Mark updated successfully you got ${AssignmentMarks} marks out of 60`,
      individual: true,
      userId: userId,
    });
    const user = await UserModel.findById(userId);
    await sendAssignmentMark(
      {
        name: user.name,
        email: user.email,
      },
      AssignmentMarks,
      AssignmentNote
    );
    res.status(200).send({
      status: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
exports.addReviewController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!id || !rating || !comment) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
    const course = await CourseModel.findById(id);
    console.log(course);
    if (!course) {
      return res.status(400).send({
        status: false,
        message: "Course not found",
      });
    }
    const review = {
      rating,
      comment,
      user: _id,
    };
    course.reviews.push(review);
    await course.save();
    res.status(200).send({
      status: true,
      message: "Review added successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};
