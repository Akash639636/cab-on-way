const cron = require('node-cron');
const dayjs = require('dayjs');
const {UsersSubscription} = require("../models");
const {Op} = require("sequelize");


const updateSubscriptionStatusCronJob = () => {

    cron.schedule('0 0 * * *', async () => {
        console.log('Checking for expired subscriptions...');
        const today = dayjs().format('YYYY-MM-DD');

        await UsersSubscription.update(
            {isActive: false},
            {
                where: {
                    isActive: true,
                    expiredOn: {
                        [Op.lt]: today
                    }
                }
            }
        );
    });
};


module.exports = updateSubscriptionStatusCronJob




