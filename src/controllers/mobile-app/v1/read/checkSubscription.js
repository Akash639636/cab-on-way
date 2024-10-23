const {retrieveRouter} = require('../../../../routes/apiRouter')
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {UsersSubscription} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");


const retrieveSubscription = async (req, res) => {
    try {
        const {id} = req.response.user;

        const subscription = await UsersSubscription.findOne({
            where: {
                userId: id,
                isActive: true
            },
            attributes: ['id', 'amount', 'isActive', 'expiredOn']
        });

        return res.status(200).json(success('', {subscription}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/app/v1/user/checkSubscription',
    userAppAuthMiddleware(),
    wrapRequestHandler(retrieveSubscription))