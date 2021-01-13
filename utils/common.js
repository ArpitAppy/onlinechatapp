function ResponseJson(res, statusCode, success, message, data, error) {
    return res.status(statusCode).json({
        success,
        message: message ? message : '',
        data: data ? data : {},
        error: error ? error : {},
    });
}

module.exports = {
    ResponseJson
}