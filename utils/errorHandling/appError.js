class AppError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
        Error.captureStackTrace(this, AppError);
    }
}

module.exports = AppError;