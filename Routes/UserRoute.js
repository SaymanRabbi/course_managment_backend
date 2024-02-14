const {
  userCreateController,
  userLoginController,
  updateUserController,
  userForgotPasswordController,
  userChangePasswordController,
  useUpdateQuizScoreController,
  useLoginUserWithTokenController,
  useUpdateUserProfileController,
} = require("../Controllers/userController");
const { apiLimiter } = require("../Middlewares/ApiLimiter");
const { authorization } = require("../Middlewares/IsAdmin");
const VerifyToken = require("../Middlewares/VerifyToken");
const { VerifyTokenServices } = require("../Services/userServices");
const router = require("express").Router();
/**
 * @postAPI to register user in the application
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/register
 * @rule 1- the request must be post request with the body of the request contain the following
 */
router.post("/register", apiLimiter, userCreateController);
/**
 * @getAPI to login user in the application
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/login
 * @rule 1- the request must be get request with the body of the request contain the following
 */
router.post("/login", apiLimiter, userLoginController);
/**
 * @updateAPI to login user with token
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/login/token
 */
router.get("/login/token", VerifyToken, useLoginUserWithTokenController);
/**
 * @updateAPI to update user role
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/updateRole
 * @rule 1- the request must be put request with the id of the user in the params and the body of the request contain the following
 */

router.put(
  "/update/:id",
  apiLimiter,
  VerifyToken,
  authorization("admin"),
  updateUserController
);
/**
 * @updateAPI to update user verification
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/verify-email
 * @rule 1- the request must be put request with the token of the user in the params
 */
router.put("/verify-email/:token", apiLimiter, VerifyTokenServices);
/**
 * @updateAPI to update user password
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/forgot-password
 * @rule 1- the request must be put request with the email of the user in the params
 */
router.put("/forgot-password/:email", apiLimiter, userForgotPasswordController);
router.put("/changes-password", apiLimiter, userChangePasswordController);
/**
 * @updateAPI to update user quiz score
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/update-quiz-score/:id
 * @rule 1- the request must be put request with the id of the user in the params and the body of the request contain the following
 */
router.put(
  "/update-quiz-score/:id",
  apiLimiter,
  VerifyToken,
  authorization("admin", "teacher", "student"),
  useUpdateQuizScoreController
);
/**
 * @updateAPI to update user profile
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/updateprofile
 * @rule 1- the request must be put request with the id of the user in the params and the body of the request contain the following
 */
router.put(
  "/updateprofile",
  apiLimiter,
  VerifyToken,
  useUpdateUserProfileController
);
module.exports = router;
