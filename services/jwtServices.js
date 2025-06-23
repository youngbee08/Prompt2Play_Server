const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;
const generateAccessToken = (user) =>{
    const accessToken = jwt.sign({id:user._id,email:user.email}, jwt_secret, {expiresIn:process.env.jwt_Exp});
    return accessToken
}


const decodeToken = async (token) =>{
    const decoded = await jwt.decode(token, jwt_secret);
    return decoded
}

module.exports = decodeToken

module.exports = {generateAccessToken,decodeToken}