const userModel = require("../models/auth");
const { decodeToken } = require("../services/jwtServices");

const isLoggedIn = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Access denied. No token provided."
            });
        }

        const decoded = await decodeToken(token);
        if (!decoded || !decoded.id) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired token."
            });
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User not found. Please log in again."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};

module.exports = isLoggedIn;