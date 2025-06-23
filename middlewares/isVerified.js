const isVerified = (req,res,next) =>{
    const {isEmailVerified} = req.user
    try {
        if (!isEmailVerified) {
            return res.status(403).json({
                status:"error",
                message:"Oops, You must be verified to perform this action"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
};

module.exports = isVerified