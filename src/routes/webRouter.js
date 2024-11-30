const {app} = require("../app");


app.get("/verify-payment", (req, res) => {
    console.log("okkk")
    res.render("verifyPayment");
});
