const express = require('express');
const router = express.Router();
const DashboardController = require("../Controllers/dashboard");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

router.get('/get-dash-board/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//Admin DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyCreatedProjectForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectOnGoingForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyModifiedProject/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentActivitiesForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//QA Manager DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent5ProjectForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10ActivitiesForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10TestCasesForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10RunLogForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//QA Lead DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent5ProjectForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10TestCasesForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10RunLogForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//Tester DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent5ProjectForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10TestCasesForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10RunLogForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);



module.exports =router;