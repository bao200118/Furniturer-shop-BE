class CustomError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}

function handleError(err, req, res, next) {
    console.log(err);
    return res.status(err.status || 500).send({
        status: err.status,
        message: err.message,
    });
}
module.exports = {
    CustomError,
    handleError,
};
