exports.success = (res, data, status = 200) => {
    return res.status(status).json({
        success: true,
        data
    });
}

exports.error = (res, message, status = 500) => {
    return res.status(status).json({
        success: false,
        error: message
    })
}
