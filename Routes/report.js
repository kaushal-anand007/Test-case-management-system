const express=require('express');
const router =express.Router();
const ReportController = require("../Controllers/report");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

//Post report details.
router.post('/add', verifyAccessTokenForUserId, ReportController.reportDetails);

//Get report details.
router.get('/get-all', verifyAccessTokenForUserId, ReportController.getReportDetails); 

//Get report details by id.
router.get('/get/:reportID', verifyAccessTokenForUserId, ReportController.getReportDetailsById);

//Update report details.
router.put('/update/:reportID', verifyAccessTokenForUserId, ReportController.updateReportDetails);

//Delete report details.
router.delete('/remove/:reportID', verifyAccessTokenForUserId, ReportController.deleteReportDetails);

module.exports =router;