const express = require('express');
const router = express.Router();
const DashboardController = require("../Controllers/dashboard");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

router.get('/get-dash-board/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

module.exports =router;