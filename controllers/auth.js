const userModel = require("../models/auth");
const {generateverificationToken} = require("../services/cryptoServices");
const sendEmailVerification = require("../utils/nodemailer/sendEmailVerification");
const {generateAccessToken} = require("../services/jwtServices");
const { hashPassword, verifyPassword } = require("../services/bcryptServices");
const sendForgotPasswordMail = require("../utils/nodemailer/sendResetPasswordMail");
const signUp = async (req,res,next) => {
    const {body} = req;
    if (!body) {
        return res.status(403).json({
            status:"error",
            message:"All fields are required"
        })
    }
    const {password,email,userName} = body;
    try {
        const hashedPassword = await hashPassword(password);
        const token = generateverificationToken(8);
        const tokenExp = Date.now() + 5 * 60 * 1000;
        const returnUser = await userModel.findOne({email});
        if (returnUser) {
            return res.status(403).json({
                status:"error",
                message:"User with the provided Email already exists"
            })
        }
        const user = await userModel.create({...body, password:hashedPassword, emailVerifytoken:token, emailVerifytokenExp:tokenExp});
        if (!user) {
            return res.status(400).json({
                status:"error",
                message:"Unable to sign up"
            })
        }
        sendEmailVerification(userName, email, token)
        res.status(200).json({
            status:"success",
            message:"Signed Up Successfully, Please verify your account before you continue"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const resendMail = async (req,res,next) =>{
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({
                status:"error",
                message: "We couldn't find an account with that email. Please check the email address or sign up."
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                status: "error",
                message: "This account is already verified. Please log in."
            });
        }

        const token = generateverificationToken(8);
        const tokenExp = Date.now() + 5 * 60 * 1000;
        await userModel.findByIdAndUpdate(user._id, {emailVerifytoken:token, emailVerifytokenExp:tokenExp});
        sendEmailVerification(user.userName, user.email, token)
        res.status(200).json({
            status:'success',
            message:"Verification email has been resent. Please check your inbox or spam folder."
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const reloadUser = async (req,res,next) =>{
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email}).select("-password");
        if (!user) {
            return res.status(404).json({
                status:"error",
                message:"Could not find an account with the provided id, try signing up again"
            })
        }
        return res.status(200).json({
            status:"success",
            message:`User reloaded successfully`,
            user
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const verifyEmail = async (req,res,next) =>{
    const {token} = req.params;
    try {
        const userWithToken = await userModel.findOne({emailVerifytoken:token});
        if (!userWithToken) {
            return res.status(400).json({
                status:"error",
                message:"Invalid verification link. Please request a new one."
            })
        }
        if (Date.now() > userWithToken.emailVerifytokenExp) {
            return res.status(410).json({
                status:"error",
                message:"This verification link has expired. Please request a new one."
            })
        }
        await userModel.findByIdAndUpdate(userWithToken._id, {isEmailVerified:true, emailVerifytoken:null, emailVerifytokenExp:null});
        res.status(200).json({
            status:"success",
            message:"Email Verified, you can now sign in"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const signIn = async (req,res,next) =>{
    const {password,email} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                status:"error",
                message:"Invalid Credentials"
            })
        }
        const verifiedPassword = await verifyPassword(password,user)
        if (!verifiedPassword) {
            return res.status(400).json({
                status:"error",
                message:"Invalid Credentials"
            })
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                status: "error",
                message: "Your email is not verified. Please verify your account before you continue",
            });
        }

        const accessToken = generateAccessToken(user)
        res.status(200).json({
            status:"success",
            message:"Signed in successful",
            accessToken
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const requestforgotPasswordMail = async (req,res,next) =>{
    if (!req.body?.email) {
        return res.status(400).json({
            status:"error",
            message:"Please provide your email"
        })
    }
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({
                status:"error",
                message:"Account with the provided email doesn't exist"
            })
        };
        const token = generateverificationToken(8);
        const tokenExp = Date.now() + 5 * 60 * 1000;
        await userModel.findByIdAndUpdate(user._id, {emailVerifytoken:token, emailVerifytokenExp:tokenExp});
        sendForgotPasswordMail(user.userName, user.email, token);
        res.status(200).json({
            status:"success",
            message:`We've sent a password reset link to ${user.email}. Please check your inbox (or spam folder).`
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const setForgotPassword = async (req, res, next) => {
    if (!req.body?.newPassword) {
        return res.status(400).json({
            status: "error",
            message: "New password is required."
        });
    }
    const { token } = req.params;
    const {newPassword} = req.body;
    try {
        const newHashedPassword = await hashPassword(newPassword);
        const user = await userModel.findOne({ emailVerifytoken: token });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired reset link. Please request a new password reset email."
            });
        }

        if (Date.now() > user.emailVerifytokenExp) {
            return res.status(410).json({
                status: "error",
                message: "This password reset link has expired. Please request a new one."
            });
        }


        await userModel.findByIdAndUpdate(user._id, {
            password:newHashedPassword,
            emailVerifytoken: null,
            emailVerifytokenExp: null
        });

        return res.status(200).json({
            status: "success",
            message: "Password reset successfully. You may now sign in"
        });

    } catch (error) {
        console.error("Password reset error:", error);
        next(error);
    }
};

const getCurrentUser = async (req,res,next)=>{
    const user = req.user;
    try{
        const confirmedUser = await userModel.findById(user._id).select("-password");
        if (!confirmedUser) {
            return res.status(400).json({
                status:"error",
                message:"unable to find user"
            })
        }
        res.status(200).json({status:"success",user:confirmedUser})
    }catch (error){
        console.log(error)
        next(error)
    }
};

const resetPassword = async (req,res,next) =>{
    const user = req.user;
    const {oldPassword,newPassword} = req.body;
    try {
        const verifiedPassword = await verifyPassword(oldPassword, user);
        if (!verifiedPassword) {
            return res.status(400).json({
                status:"error",
                message:"Old password is incorrect"
            })
        };

        const isSamePassword = await verifyPassword(newPassword, user);
        if (isSamePassword) {
            return res.status(400).json({
                status: "error",
                message: "New password must be different from the old password."
            });
        }

        const newHashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:newHashedPassword});
        res.status(200).json({
            status:"success",
            message:"Password reset successfully"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

const updateProfile = async (req,res,next)=>{
    if (!req.body) {
        return res.status(400).json({
            status:"error",
            message:"All fields are required"
        })
    }
    if (!req.file) {
        return res.status(400).json({
            status:"error",
            message:"Profile picture is required"
        })
    }
    const user = req.user;
    const {fullName,userName,phoneNumber} = req.body;
    const profilePic = req.file.path;
    try {
        await userModel.findByIdAndUpdate(user._id, {fullName,userName,phoneNumber,profilePic:profilePic})
        res.status(200).json({
            status:"success",
            message:"New changes were saved",
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};


module.exports = {
    signUp,
    resendMail,
    reloadUser,
    verifyEmail,
    signIn,
    requestforgotPasswordMail,
    setForgotPassword,
    getCurrentUser,
    resetPassword,
    updateProfile
}