const { retrieveRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {query} = require("express-validator");
const { AdminUser} = require("../../../models");
const { authMiddleware} = require("../../../middleware/authMiddleware");
const {Op} = require('sequelize');


const retrieveUsers = async (req, res) => {
    try {
        const {id} = req.response;
        const adminUser = await  AdminUser.findByPk(id, {attributes:{exclude:['createdAt', 'updatedAt', 'password', 'token']}})
        return res.status(200).json(success('', {adminUser}));
    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/v1/admin/profile',
    authMiddleware(),
    wrapRequestHandler(retrieveUsers))