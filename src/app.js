const express = require("express");
const FileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');


app.use(cors({
    origin: [
        "http://localhost:4173",
        "http://localhost:5173",
        "https://cab-on-way-react-admin.onrender.com"
    ]
}))
app.use(FileUpload({
    tempFileDir: 'assets'
}));

app.use(express.json());
app.use(express.static("assets"));
app.set("views", "./src/views");
app.set("view engine", "ejs");


module.exports = { app };