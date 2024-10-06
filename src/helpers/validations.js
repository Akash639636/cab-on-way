const { validationResult } = require('express-validator');
const { error } = require('./response');

const validations = validations => {
    return async (req, res, next) => {
        await validations.reduce(async (promise, validation) => {
            await promise;
            return validation.run(req);
        }, Promise.resolve());

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorsArray = errors.array();
        res.status(400).json(error(errorsArray[0].msg, errorsArray));
    };
};
const validatePhone = string => !!string.replace(/[-()\s]/g, "").trim().match(/^\+?[1-9]{0,3}[0-9]{10}$/);
const validateEmail = string => string.split('@')[1] === 'gmail.com';

module.exports = { validate: validations, validatePhone, validateEmail }