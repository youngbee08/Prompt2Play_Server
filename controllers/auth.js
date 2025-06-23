const userModel = require("../models/auth");
const {generateverificationToken} = require("../services/cryptoServices");
const sendEmailVerification = require("../utils/nodemailer/sendEmailVerification");
const {generateAccessToken} = require("../services/jwtServices");
const { hashPassword, verifyPassword } = require("../services/bcryptServices");
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
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).json({
                status:"error",
                message:"User Not Found"
            })
        }
        return res.status(200).json({
            status:"success",
            message:`User reloaded successfully`,
            user
        })
    } catch (error) {
        console.log(error)
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
    const {password} = req.body;
    const identifier = Object.keys(req.body).find(key => key !== "password");
    const identifierValue = req.body[identifier];
    try {
        const user = await userModel.findOne({[identifier]:identifierValue});
        if (!user) {
            return res.status(400).json({
                status:"error",
                message:"Invalid Credentials"
            })
        }
        const verifiedPassword = verifyPassword(password,user)
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

module.exports = {
    signUp,
    resendMail,
    reloadUser,
    verifyEmail,
    signIn
}