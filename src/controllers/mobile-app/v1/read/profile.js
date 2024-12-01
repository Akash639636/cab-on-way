const { retrieveRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {User} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");


const retrieveProfile = async (req, res) => {
    const {id} = req.response.user;
    try {

        let user = await User.findByPk(id,{
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });

        return res.status(200).json(success('', {user}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/app/v1/user/profile',userAppAuthMiddleware(),
    wrapRequestHandler(retrieveProfile))