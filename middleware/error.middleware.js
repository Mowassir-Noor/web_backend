const errorMiddleware = (err, req, res, next) => {
    try {
        let error={...err};
        error.message=err.message;

       console.error(err);

       if(err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message); 
            error.statusCode = 404;
        }
        if(err.code === 11000) {
            const message = `Duplicate key error: ${Object.keys(err.keyValue)} already exists`;
            error = new Error(message);
            error.statusCode = 400;
        }
        if(err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val) => val.message);
            error = new Error(message.join(","));
            error.statusCode = 400;

        }
        if(err.name === "JsonWebTokenError") {
            const message = `Invalid token`;
            error = new Error(message);
            error.statusCode = 401;

        }
        if(err.name === "TokenExpiredError") {
            const message = `Token expired`;
            error = new Error(message);
            error.statusCode = 401;
        }
        if(err.name === "NotBeforeError") {
            const message = `Token not active`;
            error = new Error(message);
            error.statusCode = 401;
        }




        
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;