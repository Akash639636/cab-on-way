
const error = (message, errors = []) => {
    return {
        message,
        errors,
        type: 'error'
    }
}
const success = (message, data) => {
    return {
        message,
        data,
        type: "success",
    }
}
const response = (data, message = "success") => {
    return {
        data,
        type: "success",
        message,
    }
}
const wrapRequestHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);


module.exports = {
    error,
    wrapRequestHandler,
    success,
    response
}