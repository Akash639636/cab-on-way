const {createRouter} = require('../../../../routes/apiRouter')
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {UsersSubscription} = require("../../../../models");



const createSubscription = async (req, res) => {
    try {
        const {id} = res.response;
        const subscription = await  UsersSubscription.create({
            userId: id,
            paymentStatus: 'pending',
            isActive: false
        });

        return res.status(200).json(success(''));
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}


createRouter.post('/app/v1/user/subscription',
    wrapRequestHandler(createSubscription))