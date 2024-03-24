const CourseModel = require("../Models/CourseModel");
const Notification = require("../Models/Notification");
const { courseCreateService } = require("../Services/courseServices");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const UserModel = require("../Models/UserModel");     
cloudinary.config({ 
  cloud_name: 'dnr5u3jpb', 
  api_key: '169991872792189', 
  api_secret: 'eB1Gjuqv1mIorndCfpyF5_F4RN8' 
});
const upload = multer({ dest: 'uploads/' });
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
    })
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
    const notification = await Notification.find({});
    if (!notification) {
      return res.status(400).send({
        status: false,
        message: "Notification not found",
      });
    }
    res.status(200).send({
      status: true,
      message: "Notification found successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}
// update assignment
exports.updateAssignmentController = async (req, res) => {
  try {
      const { _id } = req.userData;
      const { assignmentId, totalMarks, submitAnswerobg,title } = req.body;
      if (!assignmentId || !totalMarks || !submitAnswerobg) {
          return res.status(400).send({
              status: false,
              message: "Please fill all required fields",
          });
      }
      const updatedAssignment = await UserModel.findOneAndUpdate(
          { _id},
          {
              $push: {
                  assignment: {
                      assignmentId,
                      totalMarks,
                      submitAnswerobg,
                      title
                  },
              },
          },
          { new: true }
      )
      console.log(updatedAssignment)
      if (!updatedAssignment) {
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
          data: updatedAssignment,
      });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
}