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

//Get project details.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, paginationResults(Project), ProjectController.getProject);

//Get filtered data.
router.get('/filtered-list', ProjectController.getFilterdProject);

//get project by details id.
router.get('/get/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.getProjectById);

//Update project.
router.put('/update/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateProject);

//Update run-log
router.put('/update-run/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateRunLog);

//Update test-case
router.put('/update-test/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.updateTestCase);

//Remove project.
router.delete('/remove/:projectID', verifyAccessTokenForUserId, getFeatureAccess, ProjectController.deleteProject);

module.exports =router;

