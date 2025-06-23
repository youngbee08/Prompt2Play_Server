const crypto = require("crypto")

const generateverificationToken = (num=6)=>{
    const token = crypto.randomBytes(num).toString("hex");
    return token
};

module.exports = {generateverificationToken}