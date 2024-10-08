const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {body} = require("express-validator");
const {User} = require("../../../models");
const {authMiddleware} = require("../../../middleware/authMiddleware");


const updateUserStatus = async (req, res) => {
    try {
        const {id} = req.body;

        const user = await User.findByPk(id, {
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });
        user.isActive = !user.isActive;
        user.save();
        return res.status(200).json(success('', {user}));
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

updateRouter.put('/v1/admin/userStatus',
    authMiddleware(),
    validate([
        body('id').notEmpty().withMessage('Id is required'),
    ]),
    wrapRequestHandler(updateUserStatus))