const { retrieveRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {query} = require("express-validator");
const {Post, User} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");
const {Op} = require('sequelize');


const retrievePosts = async (req, res) => {
    try {
        const {limit, page, search, postByUserId} = req.query;
        const {id} = req.response.user;

        let where = {};


        if (search) {
            where = {
                [Op.or]: [
                    {title: {[Op.like]: "%" + search + "%"}},
                    {description: {[Op.like]: "%" + search + "%"}},
                ]
            }
        }

        let userWhere = {}

        if (postByUserId){
            userWhere = {
                ...userWhere,
                id
            }
        }

        const posts = await Post.findAll({
            where,
            attributes: ['id', 'title', 'description', 'attachments'],
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'profileImage'],
                where: userWhere
            }],
            // limit: +limit,
            // offset: page * limit,
            order: [['id', 'DESC']]
        });

        return res.status(200).json(success('', {posts}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


retrieveRouter.get('/app/v1/user/posts',
    validate([
        // query('search').notEmpty().withMessage('Search is required'),
        query('limit').notEmpty().withMessage('Limit is required'),
        query('page').notEmpty().withMessage('page is required'),
    ]),
    userAppAuthMiddleware(),
    wrapRequestHandler(retrievePosts))