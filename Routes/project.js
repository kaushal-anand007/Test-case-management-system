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

//Post scenario.
router.post('/add-scenario/:projectID', verifyAccessTokenForUserId, ProjectController.postScenario);

//Post test case.
router.post('/add-testcase/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.postTestCase);

//Post run log.
router.post('/add-runlog/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.postRunLog);

//Post pdf of run log.
router.get('/runlog-pdf/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.generatePdf);

//Get project data.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getProject);

//Get filtered data.
router.get('/filtered-list', ProjectController.getFilterdProject);

//get project by details id.
router.get('/get/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getProjectById);

//Update project.
router.put('/update/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateProject);

//Update run-log
router.put('/update-runlog/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateRunLog);

//Update test-case
router.put('/upadte-testcase/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateTestCase);

//Remove project.
router.delete('/remove/:projectID', verifyAccessTokenForUserId, ProjectController.deleteProject);

module.exports =router;

