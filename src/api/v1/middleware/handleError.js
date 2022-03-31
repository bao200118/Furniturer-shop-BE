function handleError(err, req, res, next) {
    return res.status(err.status || 500).send(error.message);
}

module.exports = handleError;
