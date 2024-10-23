const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {body} = require("express-validator");
const {AdminUser} = require("../../../models");
const {authMiddleware} = require("../../../middleware/authMiddleware");


const updateProfile = async (req, res) => {
    try {
        const {id} = req.response;
        const {firstName, lastName, mobile, email} = req.body;

        const user = await AdminUser.findByPk(id, {
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });
        user.firstName = firstName;
        user.lastName = lastName;
        user.mobile = mobile;
        user.email = email;
        user.save();
        return res.status(200).json(success('Profile updated successfully', {user}));
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

updateRouter.put('/v1/admin/profile',
    authMiddleware(),
    validate([
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('mobile').notEmpty().withMessage('Phone number is required'),
        body('email').notEmpty().withMessage('Email is required'),
    ]),
    wrapRequestHandler(updateProfile))