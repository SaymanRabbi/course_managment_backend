const {
  userCreateController,
  userLoginController,
  updateUserController,
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
router.get("/login", apiLimiter, userLoginController);
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
  authorization("admin", "teacher"),
  updateUserController
);
/**
 * @updateAPI to update user verification
 * @steps 1- send the request to the server
 * @example http://localhost:5000/api/v1/user/verify-email
 * @rule 1- the request must be put request with the token of the user in the params
 */
router.put("/verify-email/:token", VerifyTokenServices);

module.exports = router;
