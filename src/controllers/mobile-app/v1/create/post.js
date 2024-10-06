const {createRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {query, body} = require("express-validator");
const {Post} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");


const createPost = async (req, res) => {
    try {
        const {id} = req.response.user;
        const {title, description} = req.body;

        let post = await Post.create({
            userId: id,
            title,
            description
        });

        return res.status(200).json(success('', {post}));

    } catch (e) {
        return res.status(500).json(error(e));
    }
}


createRouter.post('/app/v1/user/post',
    validate([
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ]),
    userAppAuthMiddleware(),
    wrapRequestHandler(createPost))