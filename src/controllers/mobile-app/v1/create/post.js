const {createRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {Post} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");
const {multiFileUpload} = require("../../../../helpers/fileUpload");


const createPost = async (req, res) => {
    try {
        const {id} = req.response.user;
        const {title, description} = req.body;
        const attachments = req.files;
        const acceptedSize = 500000;
        const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];


        const uploadResponse = await multiFileUpload(attachments, 'uploads/post-attachments', acceptedSize, acceptedFileTypes)
        if (!uploadResponse.success) return res.status(415).json(error(uploadResponse.errorMessage));

        const post = await Post.create({
            userId: id,
            title,
            description,
            attachments: JSON.stringify(uploadResponse.fileNames)
        });

        if (global.postCount == 0){
            global.io.emit("reload", "reload to see new post");
            global.postCount = 0;
        }else{
            global.postCount +=1;
        }

        return res.status(200).json(success('Post created.', {post: post}));

    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}


createRouter.post('/app/v1/user/post',
    validate([
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ]),
    userAppAuthMiddleware(),
    wrapRequestHandler(createPost))