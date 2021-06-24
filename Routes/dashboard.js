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

router.get('/projectQAMangerIsLeadForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/memberActivitieForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/tescaseAddedOrUpdatedTodayForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/runlogAddedOrUpdatedTodayForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded5ProjectData/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyModified5Project/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10TestCases/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recent10RunLogs/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//QA Lead DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded5Project/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded10TestCases/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded10RunLog/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//Tester DashBoard Routes.


router.get('/collectionOfDataInFormOfCountForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded5Project/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded10TestCases/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyAdded10RunLog/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

module.exports =router;