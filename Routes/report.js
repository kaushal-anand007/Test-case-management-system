const express=require('express');
const router =express.Router();
const ReportController = require("../Controllers/report");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post report details.
router.post('/add/', verifyAccessTokenForUserId, getFeatureAccess, ReportController.reportDetails);

//Get report details.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, ReportController.getReportDetails); 

//Get report details by id.
router.get('/get/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.getReportDetailsById);

//Update report details.
router.put('/update/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.updateReportDetails);

//Delete report details.
router.delete('/remove/:reportID', verifyAccessTokenForUserId, getFeatureAccess, ReportController.deleteReportDetails);

//route to get PDF.
router.get('/getPdf/:reportID', verifyAccessTokenForUserId, ReportController.generatePdf);

module.exports =router;