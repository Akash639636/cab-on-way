const {createRouter} = require('../../../../routes/apiRouter')
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
const {UsersSubscription} = require("../../../../models");
const {body} = require("express-validator");
const {validate} = require("../../../../helpers/validations");
const crypto = require("crypto");
const axios = require("axios");
const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");


const createSubscription = async (req, res) => {
    try {
        const {user: {id, name, mobile}} = req.response;

        const merchantTransactionId = 'M' + Date.now();
        const rawPayload = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID' + id,
            name,
            amount: 199 * 100,
            redirectUrl: `https://cab-on-way.onrender.com/verify-payment?mtxnId=${merchantTransactionId}`,
            redirectMode: 'REDIRECT',
            mobileNumber: mobile,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(rawPayload);
        const payloadMain = Buffer.from(payload).toString('base64');
        const checksum = crypto.createHash('sha256').update(`${payloadMain}/pg/v1/pay` + process.env.SALT_KEY).digest('hex') + "###" + process.env.SALT_INDEX;

        const options = {
            method: 'POST',
            url: process.env.PHONEPE_BASE_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const {data: {data: {instrumentResponse}}} = await axios.request(options);

        await UsersSubscription.create({
            userId: id,
            paymentStatus: 'pending',
            subscriptionStatus: 'inactive',
            merchantTransactionId,
            isActive: false
        });

        return res.status(200).json(success('', {instrumentResponse}));


    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}


createRouter.post('/app/v1/user/subscription',
    userAppAuthMiddleware(),
    wrapRequestHandler(createSubscription))