const { Router } = require('express');
const { app } = require('../app');

const apiRouter = Router();
app.use("/api", apiRouter);

const createRouter = Router();
apiRouter.use("/create", createRouter);

const deleteRouter = Router();
apiRouter.use("/delete", deleteRouter);

const retrieveRouter = Router();
apiRouter.use("/retrieve", retrieveRouter);

const updateRouter = Router();
apiRouter.use("/update", updateRouter);

module.exports = {
    apiRouter,
    createRouter,
    deleteRouter,
    retrieveRouter,
    updateRouter
};
