const { apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, success, error} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {User, Otp, UserToken} = require('../../../../models');
const {verify} = require("jsonwebtoken");
const {generateJWT} = require("../../../../helpers/token");


const verifyOtp = async (req, res) => {
    const {id, otp} = req.body;
    try {

        let user = await User.findOne({
            where: {id},
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });

        if (!user) return res.status(404).json(error('user not found.'));

        const retrieveOtp = await Otp.findOne({
            where: {
                userId: id,
                otp
            },
        });

        if (retrieveOtp) {

            if (!user.isVerified) {
                user.isVerified = true;
                user.save();
            }

            await Otp.destroy({where: {userId: id}});
            const token = generateJWT({user});
            await UserToken.create({
                userId: id,
                token
            });
            return res.status(200).json(success('login successfully', {user, token}));
        }

        return res.status(400).json(error('Wrong OTP'));

    } catch (e) {
        return res.status(500).json(error(e));
    }

}

apiRouter.post('/app/v1/user/verifyOtp', validate([
    body('id').notEmpty().withMessage('Id is required'),
    body('otp').notEmpty().withMessage('otp is required'),
]), wrapRequestHandler(verifyOtp))