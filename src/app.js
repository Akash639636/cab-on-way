const express = require("express");
const FileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');


app.use(cors({
    origin: [

    ]
}))
app.use(FileUpload({
    tempFileDir: 'assets'
}));

app.use(express.json());
app.use(express.static("assets"));



module.exports = { app };