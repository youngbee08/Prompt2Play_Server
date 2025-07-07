const handleLimitError = (error) => {
    return {
        status: error.status || 429,
        message: "You’ve exceeded your free limits. Please wait and try again later.",
    };
};

const handleDuplicateError = (error) => {
    const cause = error?.cause || {};
    const keyPattern = error.keyPattern || cause.keyPattern || {};
    const keyValue = error.keyValue || cause.keyValue || {};
    const errorCode = error.code || cause.code;

    if (Object.keys(keyPattern).length === 0 || Object.keys(keyValue).length === 0) {
        return null;
    }

    const errorKey = Object.keys(keyPattern)[0];
    const errorVal = keyValue[errorKey];
    const errorMessage = `${errorKey}: ${errorVal} already in use`;

    return {
        status: 400,
        message: errorMessage,
        code: errorCode
    };
};

const handleError = (error, req, res, next) => {
    if (error.status === 429) {
        const limitError = handleLimitError(error);
        return res.status(limitError.status).json({
            status: "error",
            message: limitError.message
        });
    }

    if (error.code === 11000 || error?.cause?.code === 11000) {
        const duplicateError = handleDuplicateError(error);
        if (duplicateError) {
            return res.status(duplicateError.status).json({
                status: "error",
                message: duplicateError.message
            });
        }
    }

    console.error("Unhandled Error:", error);
    res.status(error.status || 500).json({
        status: "error",
        message: "Something went wrong",
        errorCode: error.code,
        errorMessage: error.message,
        errStatus: error.status
    });
};

module.exports = handleError;
