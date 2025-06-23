const handleLimitError = (error) =>{
    const errorDetails = {
        status:error.status,
        message:"You’ve exceeded your free limits. Please wait and try again later.",
    }
    return errorDetails
}

const handleDuplicateError = (error) => {
    const errorCode = error.code;
    const keyPattern = error?.keyPattern || error?.cause?.keyPattern || {};
    const keyValue = error?.keyValue || error?.cause?.keyValue || {};

    const errorKey = Object.keys(keyPattern)[0];
    const errorVal = keyValue[errorKey];    
    const errorMessage = `${errorKey}:${errorVal} already in use`;
    console.log(error)
    const errorDetails = {
        status:400,
        message:errorMessage,
        code:11000
    };
    return errorDetails
}

const handleError = (err,req,res,next) =>{
    let limitErrorMessage = handleLimitError(err);
    let duplicateError = handleDuplicateError(err);
    if (err.status === 429) {
        return res.status(limitErrorMessage.status).json({
            status:"error",
            message:limitErrorMessage.message
        })
    }else if (err.code === duplicateError.code){
        return res.status(duplicateError.status).json({
            status:"error",
            message:duplicateError.message
        })
    }else{
        res.status(400).json({
            status:"error",
            message:`Something went wrong`,
            errorCode:err.code,
            errorMessage:err.message,
            errStatus:err.status
        })
    }
}

module.exports = handleError