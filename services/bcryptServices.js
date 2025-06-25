const bcrypt = require ("bcryptjs");

const hashPassword = async (password)=>{
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    return hashedPassword
};

const verifyPassword = async (password,user)=>{
    const verifiedPassword = await bcrypt.compare(password, user.password);
    return verifiedPassword
};

module.exports = {hashPassword,verifyPassword}
