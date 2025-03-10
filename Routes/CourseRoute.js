const {
  createCourseController,
  getCourseController,
  updateCourseController,
  getQuizController,
  getNotificationController,
  updateAssignmentController,
  notificationController,
  getAssignmentWithIdController,
  getAllAssignmentsController,
  updateAssignmentMarkController,
  addReviewController,
} = require("../Controllers/courseController");
const { apiLimiter } = require("../Middlewares/ApiLimiter");
const { authorization } = require("../Middlewares/IsAdmin");
const VerifyToken = require("../Middlewares/VerifyToken");

const router = require("express").Router();
/**
 * @postAPI to create course in the application
 * @steps 1- send the request to the server
 * @example   https://course-managment-backend.onrender.com/api/v1/course/create
 * @rule 1- the request must be post request with the body of the request contain the following
 */
router.post(
  "/create",
  apiLimiter,
  VerifyToken,
  authorization("admin", "super-admin"),
  createCourseController
);
/**
 * @getAPI to get course in the application
 * @steps 1- send the request to the server
 * @example   https://course-managment-backend.onrender.com/api/v1/course/getCourse
 * @rule 1- the request must be get request with the body of the request contain the following userid and courseid
 */
router.get("/getCourse", getCourseController);

/**
 * @patchAPI to update course in the application
 * @steps 1- send the request to the server
 * @example   https://course-managment-backend.onrender.com/api/v1/course/updateCourse
 * @rule 1- the request must be patch request with the body of the request contain the following userid and courseid
 */
router.put(
  "/updateCourse/:id",
  apiLimiter,
  VerifyToken,
  authorization("admin", "super-admin"),
  updateCourseController
);
// add rivew to course
router.put(
  "/addReview/:id",
  VerifyToken,
  authorization("admin", "super-admin", "student"),
  addReviewController
);
// add rivew to course
router.post(
  "/getQuiz/:id",
  VerifyToken,
  authorization("admin", "super-admin", "student"),
  getQuizController
);
router.get("/getNotification", VerifyToken, getNotificationController);
router.post(
  "/assignment",
  VerifyToken,
  authorization("admin", "student", "super-admin"),
  updateAssignmentController
);
router.get(
  "/getAssignments",
  VerifyToken,
  authorization("admin", "student", "super-admin"),
  getAssignmentWithIdController
);
router.get(
  "/AllAssignments",
  VerifyToken,
  authorization("admin", "super-admin"),
  getAllAssignmentsController
);
router.put(
  "/updateAssignmentMark/:id",
  VerifyToken,
  authorization("admin", "super-admin"),
  updateAssignmentMarkController
);
router.post(
  "/newNotification",
  VerifyToken,
  authorization("admin", "super-admin"),
  notificationController
);
module.exports = router;
