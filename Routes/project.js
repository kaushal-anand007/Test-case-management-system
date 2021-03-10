const express=require('express');
const router =express.Router();
const ProjectController = require("../Controllers/project");
const { route } = require('./user');
const Project = require('../Models/project');
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const paginationResults = require('../Helpers/pagination');

//post project details.
router.post('/add', verifyAccessTokenForUserId, ProjectController.postProject); //log

//Get project details.
router.get('/list', verifyAccessTokenForUserId, paginationResults(Project), ProjectController.getProject);

//get project by details id.
router.get('/get/:projectID', verifyAccessTokenForUserId, ProjectController.getProjectById);

//Update project.
router.put('/update/:projectID', verifyAccessTokenForUserId, ProjectController.updateProject); //log

//Remove project.
router.delete('/remove/:projectID', verifyAccessTokenForUserId, ProjectController.deleteProject); //log

module.exports =router;

