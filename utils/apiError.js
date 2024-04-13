 class ApiError extends Error {
   

    constructor(
        statusCode,
        message= "wrong",
        errors = [],
        stack= ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
};

export {ApiError}
