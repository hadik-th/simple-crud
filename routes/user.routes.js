import { Router } from "express";
import { logoutUser, newUserRegister,refreshAccessToken } from "../controllers/user.controller.js";
import { loginNewUser } from "../controllers/user.controller.js";
import { verifyTokensOfLoggedInUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(newUserRegister);
router.route("/login").post(loginNewUser);

//secure route-
router.route("/logout").post( verifyTokensOfLoggedInUser,logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)

export default router ;
