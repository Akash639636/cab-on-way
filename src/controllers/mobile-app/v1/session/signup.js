const {createRouter, apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, success, error} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {User, Otp} = require('../../../../models');
const {generateBcrypt} = require("../../../../helpers/bcrypt");


const createUser = async (req, res) => {
    try {
        const {mobile, password, name, email} = req.body;
        const OTP = 1234;

        let user = await User.findOne({
            where: {mobile},
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });

        if (user) return res.status(409).json(error('mobile number already in use.'));

        user = await User.create({
            mobile,
            password: generateBcrypt(password),
            name,
            email,
            isVerified: false,
            isActive: true
        });

        await Otp.create({
            userId: user.id,
            otp: OTP
        });

        return res.status(200).json(success('', {user}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


apiRouter.post('/app/v1/user/signup', validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('mobile').notEmpty().withMessage('Phone Number is Required'),
    body('password').notEmpty().withMessage('Password is Required')
]), wrapRequestHandler(createUser))