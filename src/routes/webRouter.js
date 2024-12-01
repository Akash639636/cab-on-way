const {app} = require("../app");


app.get("/verify-payment", (req, res) => {
    res.render("verifyPayment");
});
