const { apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, success, error} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {User, Otp} = require('../../../../models');


const generateOtp = async (req, res) => {
    const {id} = req.body;
    try {
        const OTP = 1234;

        let user = await User.findByPk(id);
        if (!user) return res.json(error('user not found.'));

        await Otp.create({
            userId: id,
            otp: OTP
        });

        return res.status(200).json(success(''));

    } catch (e) {
        return res.status(500).json(error(e));
    }

}


apiRouter.post('/app/v1/user/generateOtp', validate([
        body('id').notEmpty().withMessage('Id is required'),
    ]),
    wrapRequestHandler(generateOtp))