const express=require('express');
const router =express.Router();
const ReportController = require("../Controllers/report");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post report details.
router.post('/add/', verifyAccessTokenForUserId, getFeatureAccess, ReportController.report);

//Get report details.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, ReportController.getReport); 

//Get report details by id.
router.get('/get/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.getReportById);

//Update report details.
router.put('/update/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.updateReport);

//Delete report.
router.delete('/remove/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.deleteReport);

//route to get PDF.
router.get('/getPdf/:reportID', verifyAccessTokenForUserId, ReportController.generatePdf);

//Change report condition.
router.put('/remove/:reportID', verifyAccessTokenForUserId, ReportController.changeReportCondition);

module.exports =router;