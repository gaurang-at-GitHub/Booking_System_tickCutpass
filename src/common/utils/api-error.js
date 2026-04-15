class ApiError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
    static badRequest(message='Bad Request'){
    return new ApiError(400, message)
}
}







export default ApiError