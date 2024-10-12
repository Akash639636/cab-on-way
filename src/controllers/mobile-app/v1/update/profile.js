const { updateRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {User} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");
const {fileUpload} = require("../../../../helpers/fileUpload");


const updateProfile = async (req, res) => {
    const {id} = req.response.user;
    const {name, email, gender} = req.body;
    const files = req.files;
    try {
        const user = await User.findByPk(id, {
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });

        if (files?.profileImage) {
            const acceptedTypes =  ['image/jpeg', 'image/jpg', 'image/png'];
            const {fileName, extension, errorMessage , success} = await fileUpload(files.profileImage, 'uploads/user-profile', 500000,  acceptedTypes);
            if (!success)  return res.status(415).json(error(errorMessage));
            user.profileImage = fileName + extension;
        }
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.save();
        return res.status(200).json(success('', {user}));
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

updateRouter.put('/app/v1/user/profile',
    userAppAuthMiddleware(),
    validate([
        body('name').notEmpty().withMessage('Name is required'),
        body('email').notEmpty().withMessage('Email is required'),
        body('gender').notEmpty().withMessage('Gender is required'),
    ]),
    wrapRequestHandler(updateProfile))