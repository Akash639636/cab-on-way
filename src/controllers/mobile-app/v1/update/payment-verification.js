const {retrieveRouter, apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {User, UsersSubscription} = require("../../../../models");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");
const Base64 = require("base-64");
const crypto = require("crypto");
const axios = require("axios");
const dayjs = require('dayjs');
const {router} = require("express/lib/application");


const retrieve = async (req, res) => {
    try {
        const {id} = req.query;
        console.log(id)
        const decodedResponse = Base64.decode(req.body.response);
        const {data: {merchantId, merchantTransactionId}} = JSON.parse(decodedResponse);
        const verificationUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;
        const checksum = crypto.createHash('sha256').update(`/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY).digest('hex') + "###" + process.env.SALT_INDEX;

        const options = {
            method: 'GET',
            url: verificationUrl,
            headers: {
                'X-VERIFY': checksum,
                'Content-Type': 'application/json',
                'X-MERCHANT-ID': merchantId,
            }
        }

        const {data} = await axios.request(options);

        let subscriptionObject = {
            userId: id,
            paymentStatus: data.code,
            subscriptionStatus: 'inactive',
            isActive: false
        };
        if (data.code === "PAYMENT_SUCCESS") {
            subscriptionObject.isActive = true;
            subscriptionObject.subscriptionStatus = 'active';
            subscriptionObject.transactionId = data.data.transactionId;
            subscriptionObject.expiredOn = dayjs().add(1, 'month').format('YYYY-MM-DD');
            subscriptionObject.amount = data.data.amount;
        }

        await UsersSubscription.create(subscriptionObject);
        return res.status(200).json(success('', {}));

    } catch (e) {
        console.log(e.message);
        return res.status(500).json(error(e.message));
    }
}


apiRouter.post('/app/v1/user/payment-verification',
    wrapRequestHandler(retrieve))