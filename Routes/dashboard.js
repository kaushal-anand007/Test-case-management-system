const express = require('express');
const router = express.Router();
const DashboardController = require("../Controllers/dashboard");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

router.get('/get-dash-board/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//Admin DashBoard Routes.


router.get('/totalProjectForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentlyCreatedProjectForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectCrossedDeadLineForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectOnGoingForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectCompletedForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectRejectForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/recentActivitiesForAdmin/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//QA Manager DashBoard Routes.


router.get('/projectCreatedByQAManagerForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectQAMangerIsLeadForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectCrossedDeadLineForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectOnGoingForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectCompletedForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/projectRejectForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/memberActivitieForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/tescaseAddedOrUpdatedTodayForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/runlogAddedOrUpdatedTodayForQAManager/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//QA Lead DashBoard Routes.


router.get('/totalProjectForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/testCaseCreatedAndModifiedForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/runLogCreatedAndModifiedForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/tescaseToBeDoneForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/runlogToBeDoneForQALead/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);


//Tester DashBoard Routes.


router.get('/totalProjectForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/tescaseToBeDoneForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

router.get('/runlogToBeDoneForTester/', verifyAccessTokenForUserId, DashboardController.getDashBoardData);

module.exports =router;