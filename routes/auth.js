const express = require("express");
const { signUp, verifyEmail, signIn, resendMail, reloadUser, requestforgotPasswordMail, setForgotPassword, resetPassword, updateProfile, getCurrentUser } = require("../controllers/auth");
const isLoggedIn = require("../middlewares/isLoggedIn");
const uploadImage = require("../config/multer");

const authRouter = express.Router();
authRouter.post("/signup", signUp);
authRouter.post("/verify/:token", verifyEmail);
authRouter.post("/signin", signIn)
authRouter.post("/resendVMail", resendMail)
authRouter.post("/reloadUser", reloadUser)
authRouter.post("/requestforgotPasswordMail", requestforgotPasswordMail)
authRouter.post("/setForgotPassword/:token", setForgotPassword)
authRouter.get("/user", isLoggedIn, getCurrentUser)
authRouter.post("/resetPassword", isLoggedIn, resetPassword)
authRouter.post("/updateProfile", isLoggedIn, uploadImage.single("profilePic"), updateProfile)

module.exports = authRouter