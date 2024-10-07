const requireDir = require('require-dir');
const { app } = require('./app')
const { error } = require('./helpers/response')
require('../src/models')
require('dotenv').config();

requireDir("./controllers", { recurse: true });
requireDir('./routes');

app.use(function (err, req, res, next) {
    res.json(error(err.message));
});
const server = app.listen(process.env.PORT,async () => {
    console.log(`app is listening on port: ${process.env.PORT} `)
})





module.exports = { app, server }