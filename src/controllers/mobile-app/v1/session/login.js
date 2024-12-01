const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {User, Otp, UserToken} = require("../../../../models");
const {compareBcrypt} = require("../../../../helpers/bcrypt");
const {generateJWT} = require("../../../../helpers/token");


const Login = async (req, res) => {
    const {mobile, password} = req.body;

    try {

        let user = await User.findOne({where: {mobile}});

        if (!user) return res.status(404).json(error('user not exist.'));

        if (compareBcrypt(password, user.password)) {

            const token = generateJWT({user});
            await UserToken.create({
                userId: user.id,
                token
            });

            return res.status(200).json(success('login successfully', {user, token}));
        } else {
            res.status(400).json(error('Username or password is incorrect'))
        }


    } catch (e) {
        console.log(e)
        return res.status(500).json(error(e));
    }

}


apiRouter.post('/app/v1/user/login', validate([
    body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    body('password').notEmpty().withMessage('Password is Required')
]), wrapRequestHandler(Login))