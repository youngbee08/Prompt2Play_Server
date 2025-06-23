const express = require("express");
const { signUp, verifyEmail, signIn, resendMail, reloadUser } = require("../controllers/auth");

const authRouter = express.Router();
authRouter.post("/signup", signUp);
authRouter.post("/verify/:token", verifyEmail);
authRouter.post("/signin", signIn)
authRouter.post("/resendVMail", resendMail)
authRouter.post("/reloadUser", reloadUser)

module.exports = authRouter