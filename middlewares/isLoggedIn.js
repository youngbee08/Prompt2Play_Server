const userModel = require("../models/user");
const {decodeToken} = require("../services/jwtServices");

const isLoggedIn = async (req,res,next) =>{
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Access denied. No token provided."
            })
        };
        const decoded = await decodeToken(token)
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token. Please log in again."
            })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
};

module.exports = isLoggedIn