const { retrieveRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {query} = require("express-validator");
const { UsersSubscription, User} = require("../../../models");
const { authMiddleware} = require("../../../middleware/authMiddleware");
const {Op} = require('sequelize');


const retrieveUsers = async (req, res) => {
    try {
        const {limit, page, search} = req.query;

        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    {'$user.name$': {[Op.like]: "%" + search + "%"}},
                    {'$user.mobile$': {[Op.like]: "%" + search + "%"}},
                    {transactionId: {[Op.like]: "%" + search + "%"}},
                ]
            }
        }

        const userSubscriptions = await UsersSubscription.findAll({
            where,
            include:[
                {
                    model:User,
                    as: 'user',
                    attributes: ['name', 'mobile']
                }
            ],
            limit: +limit,
            offset: page * limit,
            order: [['id', 'DESC']]
        });
        const totalRecords = await UsersSubscription.count();
        return res.status(200).json(success('', {userSubscriptions, totalRecords}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/v1/admin/userSubscriptions',
    authMiddleware(),
    validate([
        query('limit').notEmpty().withMessage('Limit is required'),
        query('page').notEmpty().withMessage('page is required'),
    ]),
    wrapRequestHandler(retrieveUsers))