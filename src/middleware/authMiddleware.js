const {error} = require("../helpers/response");
const {UserToken, User, AdminUser} = require('../models');
const {verifyJWT} = require('../helpers/token')

const authMiddleware = () => async (req, res, next) => {
    try {
        let token_id = req.headers.authorization || req.query.token_id || "";
        token_id = token_id.replace("Bearer ", "");

        const errorMessage = "Invalid Token or Token expired";
        const response = verifyJWT(token_id);
        if (!response || !response?.id) return res.status(401).json(error(errorMessage));
        const dbToken = await AdminUser.findOne({
            where: {id: response?.id, token: token_id},
            attributes: ['id', 'token']
        });
        if (!token_id || !response || !dbToken) {
            return res.status(401).json(error(errorMessage));
        }
        req.response = response
        next();
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

const userAppAuthMiddleware = () => async (req, res, next) => {
    try {
        let token_id = req.headers.authorization || req.query.token_id || "";
        token_id = token_id.replace("Bearer ", "");

        if (!token_id) return res.status(401).json(error("Token is required"));

        const errorMessage = "Invalid Token or Token expired";
        const response = verifyJWT(token_id);

        if (!response) return res.status(401).json(error(errorMessage));
        const dbToken = await UserToken.findOne({where: {userId: response.user.id, token: token_id}});
        const user = await User.findByPk(response.user.id);
        if (!token_id || !response || !dbToken || !user) {
            return res.status(401).json(error(errorMessage));
        }
        if (!user.isVerified) {
            return res.status(403).json(error("Your account is not verified please verify your account first."));
        }
        if (!user.isActive) {
            return res.status(403).json(error("You are inactive by admin!"));
        }
        req.response = response
        next();
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
module.exports = {
    authMiddleware,
    userAppAuthMiddleware
}