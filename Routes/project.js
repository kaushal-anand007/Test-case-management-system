const express=require('express');
const router =express.Router();
const ProjectController = require("../Controllers/project");
const { route } = require('./user');
const Project = require('../Models/project');
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const paginationResults = require('../Helpers/pagination');
const { getFeatureAccess } = require('../Helpers/role');

//post project details.
router.post('/add/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.postProject);

//Get project data.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getProject);

//Get filtered data.
router.get('/filtered-list', ProjectController.getFilterdProject);

//get project by details id.
router.get('/get/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getProjectById);

//Update project.
router.put('/update/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateProject);

//Post scenario.
router.post('/add-scenario/:projectID', verifyAccessTokenForUserId, ProjectController.postScenario);

//Get scenario
router.get('/get-scenario/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getScenario);

//Post test case.
router.post('/add-testcase/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.postTestCase);

//List test case.
router.get('/list-testcase/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getTestCase);

//Get test case by id.
router.get('/get-testcase/:testCaseID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getTestCaseById);

//Update test case.
router.put('/update-testcase/:testCaseID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateTestCase);

//Remove test case.
router.delete('/remove-testcase/:testCaseID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.removeTestCase);

//Post run log.
router.post('/add-runlog/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.postRunLog);

//List run log.
router.get('/list-runlog/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getRunLog);

//Get run log by id.
router.get('/get-runlog/:runLogID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getRunLogById);

//Update run-log
router.put('/update-runlog/:runLogID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateRunLog);

//Remove run-log
router.delete('/remove-runlog/:runLogID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.removeRunlog);

//Post pdf of run log.
router.post('/runlog-pdf/:runLogID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.generatePdf);

//Post csv of run log.
router.get('/runlog-csv/:runLogID', verifyAccessTokenForUserId, ProjectController.generateCsv);

//delete project.
router.delete('/delete/:projectID', verifyAccessTokenForUserId, ProjectController.deleteProject);

//Change project condition.
router.put('/remove/:projectID', verifyAccessTokenForUserId, ProjectController.changeProjectCondition);

module.exports =router;

