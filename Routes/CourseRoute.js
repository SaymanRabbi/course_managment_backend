const {
  createCourseController,
  getCourseController,
  updateCourseController,
  getQuizController,
  getNotificationController,
  updateAssignmentController

} = require("../Controllers/courseController");
const { apiLimiter } = require("../Middlewares/ApiLimiter");
const { authorization } = require("../Middlewares/IsAdmin");
const VerifyToken = require("../Middlewares/VerifyToken");

const router = require("express").Router();
/**
 * @postAPI to create course in the application
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/course/create
 * @rule 1- the request must be post request with the body of the request contain the following
 */
router.post(
  "/create",
  apiLimiter,
  VerifyToken,
  authorization("admin"),
  createCourseController
);
/**
 * @getAPI to get course in the application
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/course/getCourse
 * @rule 1- the request must be get request with the body of the request contain the following userid and courseid
 */
router.get("/getCourse", getCourseController);

/**
 * @patchAPI to update course in the application
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/course/updateCourse
 * @rule 1- the request must be patch request with the body of the request contain the following userid and courseid
 */
router.put(
  "/updateCourse/:id",
  apiLimiter,
  VerifyToken,
  authorization("admin"),
  updateCourseController
);
router.post(
  "/getQuiz/:id",
  VerifyToken,
  authorization("admin", "teacher", "student"),
  getQuizController
);
router.get(
  "/getNotification",
  VerifyToken,
  getNotificationController
)
router.put(
  "/assignment",
  VerifyToken,
  authorization("admin","student"),
  updateAssignmentController
)
module.exports = router;
