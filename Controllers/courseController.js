const CourseModel = require("../Models/CourseModel");
const { courseCreateService } = require("../Services/courseServices");

exports.createCourseController = async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    // -------get id from token
    const { _id } = req.userData;
    if (!title || !description || !modules) {
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
    if (!id) {
      return res.status(400).send({
        status: false,
        message: "Please fill all required fields",
      });
    }
  } catch (error) {
    res.status(500).send({
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
    const quiz = course.modules.id(id).lessons.map((lesson) => {
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
