const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {UsersSubscription} = require("../../../../models");
const crypto = require("crypto");
const axios = require("axios");
const dayjs = require('dayjs');
const {body} = require("express-validator");


const retrieve = async (req, res) => {
    try {
        const {mtxnId} = req.body;

        const userSub = await UsersSubscription.findOne({where: {merchantTransactionId: mtxnId, paymentStatus: 'pending'}});
        if (!userSub) return res.status(422).json(error('Invalid Data'));

        const verificationUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.MERCHANT_ID}/${mtxnId}`;
        const checksum = crypto.createHash('sha256').update(`/pg/v1/status/${process.env.MERCHANT_ID}/${mtxnId}` + process.env.SALT_KEY).digest('hex') + "###" + process.env.SALT_INDEX;

        const options = {
            method: 'GET',
            url: verificationUrl,
            headers: {
                'X-VERIFY': checksum,
                'Content-Type': 'application/json',
                'X-MERCHANT-ID': process.env.MERCHANT_ID,
            }
        }

        const {data} = await axios.request(options);


        if (data.code === "PAYMENT_SUCCESS") {
            userSub.isActive = true;
            userSub.subscriptionStatus = 'active';
            userSub.transactionId = data.data.transactionId;
            userSub.expiredOn = dayjs().add(1, 'month').format('YYYY-MM-DD');
            userSub.amount = data.data.amount * 1000;
            userSub.paymentStatus = 'success';
            userSub.save();
        }
        return res.status(200).json(success('', {status: data.data.state}));

    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}


apiRouter.post('/app/v1/user/payment-verification', validate([
        body('mtxnId').notEmpty().withMessage('mtxnId is required'),
    ]),
    wrapRequestHandler(retrieve))