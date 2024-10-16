const {apiRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../helpers/response')
const {body} = require("express-validator");
const {AdminUser} = require("../../../models");
const {compareBcrypt} = require("../../../helpers/bcrypt");
const {generateJWT} = require("../../../helpers/token");


const adminLogin = async (req, res) => {

    try {
        const {mobile, password} = req.body;

        let user = await AdminUser.findOne({where: {mobile}});

        if (!user) return res.status(404).json(error('Phone Number or password is incorrect'));

        if (compareBcrypt(password, user.password)) {

            const token = generateJWT({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                mobile: user.mobile,
                email: user.email
            });
            user.token = token;
            user.save();

            return res.status(200).json(success('login successfully', {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobile: user.mobile,
                    email: user.email,
                    token
                }
            }));
        } else {
            res.status(401).json(error('Phone Number or password is incorrect'))
        }


    } catch (e) {
        return res.status(500).json(error(e));
    }

}


apiRouter.post('/v1/admin/login', validate([
    body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    body('password').notEmpty().withMessage('Password is Required')
]), wrapRequestHandler(adminLogin))