const {app} = require("../app");


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/privacy-policy", (req, res) => {
    res.render("privacyPolicy");
});

app.get("/about-us", (req, res) => {
    res.render("aboutUs");
});

app.get("/terms-and-condition", (req, res) => {
    res.render("termsAndConditions");
});

app.get("/refund-policy", (req, res) => {
    res.render("refundPolicy");
});

app.get("/verify-payment", (req, res) => {
    res.render("verifyPayment");
});
