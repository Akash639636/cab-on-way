const {createRouter} = require('../../../../routes/apiRouter')
// const {validate} = require('../../../../helpers/validations');
const {wrapRequestHandler, error, success} = require('../../../../helpers/response')
// const {body} = require("express-validator");
const {UsersSubscription} = require("../../../../models");
// const {userAppAuthMiddleware} = require("../../../../middleware/authMiddleware");
// const {multiFileUpload} = require("../../../../helpers/fileUpload");
// const axios = require("axios");
// const crypto = require('crypto');
// const sha256 = require('sha256');




const createSubscription = async (req, res) => {
    try {

        // const REQUEST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
        // const SALT_INDEX = 1;
        // // const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
        // const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
        //
        // const merchantTransactionId = 'M' + Date.now();
        //
        // const data = {
        //     // merchantId: "PGTESTPAYUAT",
        //     merchantId: "PGTESTPAYUAT86",
        //     merchantTransactionId: merchantTransactionId,
        //     merchantUserId: 'MUID' + 455,
        //     name: "yash",
        //     amount: 100 * 100,
        //     redirectUrl: "http:localhost:8080/",
        //     redirectMode: 'GET',
        //     mobileNumber: "9760282941",
        //     paymentInstrument: {
        //         type: 'PAY_PAGE'
        //     }
        // };
        //
        // let bufferObj = Buffer.from(JSON.stringify(data), "utf8");
        // let base64EncodedPayload = bufferObj.toString("base64");
        // let xVerify = sha256(base64EncodedPayload + '/pg/v1/pay' + SALT_KEY) + "###" + SALT_INDEX
        //
        // const options = {
        //     method: 'POST',
        //     url: REQUEST_URL+"/pg/v1/pay",
        //     headers: {
        //         accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         'X-VERIFY': xVerify
        //     },
        //     data: {
        //         request: base64EncodedPayload
        //     }
        // };
        //
        // axios.request(options).then(function (response) {
        //     // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        //     console.log(response.data.data)
        // })
        //     .catch(function (error) {
        //         console.error(error.response?.data ,"======================");
        //     });

        const {id} = res.response;

        const subscription = await  UsersSubscription.create({
            userId: id,
            paymentStatus: 'pending',
            isActive: false
        });


        return res.status(200).json(success(''));

    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}


createRouter.post('/app/v1/user/subscription',
    wrapRequestHandler(createSubscription))