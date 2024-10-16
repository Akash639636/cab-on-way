const { retrieveRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {query} = require("express-validator");
const { User} = require("../../../models");
const { authMiddleware} = require("../../../middleware/authMiddleware");
const {Op} = require('sequelize');


const retrieveUsers = async (req, res) => {
    try {
        const {limit, page, search} = req.query;

        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    {name: {[Op.like]: "%" + search + "%"}},
                    {mobile: {[Op.like]: "%" + search + "%"}},
                ]
            }
        }

        const users = await User.findAll({
            where,
            attributes: {exclude:['password','createdAt', 'updatedAt']},
            limit: +limit,
            offset: page * limit,
            order: [['id', 'DESC']]
        });
        const totalRecords = await User.count();
        return res.status(200).json(success('', {users, totalRecords}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/v1/admin/users',
    authMiddleware(),
    validate([
        query('limit').notEmpty().withMessage('Limit is required'),
        query('page').notEmpty().withMessage('page is required'),
    ]),
    wrapRequestHandler(retrieveUsers))