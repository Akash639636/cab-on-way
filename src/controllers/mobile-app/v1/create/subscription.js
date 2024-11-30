const {createRouter} = require('../../../../routes/apiRouter')
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {UsersSubscription} = require("../../../../models");
const {body} = require("express-validator");
const {validate} = require("../../../../helpers/validations");


const createSubscription = async (req, res) => {
    try {
        // const {id} = res.response;
        const {id} = req.body
        const subscription = await UsersSubscription.create({
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
    validate([
        body('id').notEmpty().withMessage('ID is required'),
    ]),
    wrapRequestHandler(createSubscription))