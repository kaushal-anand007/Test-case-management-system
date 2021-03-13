const Project = require('../Models/project');
const mongoose =require('mongoose');
const Log =require('../Models/log');

//Function to post the project.
async function postProject (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Added project details";
    let userID = req.user.payload.userId;
    let runLog;
    let testCase;
    
    try {
        let { nameOfProject, handledBy, projectDescription, startDate, endDate} = req.body;
        let projectObj = { nameOfProject, handledBy, projectDescription, startDate, endDate, date, time, runLog, testCase}
        if(nameOfProject == "" || handledBy == "" || projectDescription == "" || startDate == "" || endDate == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            Project.findOne({"nameOfProject" : nameOfProject}, async function(err,results){
                if(err){ res.json({message : err})}
                if(results){
                    res.json({ message : "The project name already exists!!!!"});
                }else{
                    await Project.create( projectObj);
                    let result = {
                        status : 'success',
                        data : {
                            message : " Project has sucessfully created "
                        }
                    }
                    await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID}); 
                    res.status(200).json(result);
                    
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to list all the project.
async function getProject (req,res) {
   try {
       let result = await Project.find();
       res.status(200).json(result);
   } catch (error) {
       console.log(error);
       res.status(400).json({ message : error });
   }
}

//Function to get project by id.
async function getProjectById (req,res) {
    try {
        let projectById = await Project.find({ _id : req.params.projectID})
        res.status(200).json(projectById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to update the project details.
async function updateProject (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Updated project details";
    let userID = req.user.payload.userId;
    let { nameOfProject, handledBy, projectDescription , startDate, endDate} = req.body; 
    
    try {
        //Getting _id from array inside the db.
        let objId1 = await Project.findOne({ _id : req.params.projectID});

        //created object to update the project details.
        let setQuery = {};
        if(nameOfProject) {
            setQuery["nameOfProject"] = nameOfProject;
        }
        if(handledBy) {
            setQuery["handledBy"] = handledBy;
        }
        if(projectDescription) {
            setQuery["projectDescription"] = projectDescription;
        }
        if(startDate) {
            setQuery["startDate"] = startDate;
        }
        if(endDate) {
            setQuery["endDate"] = endDate;
        }

        let update = await Project.findOneAndUpdate(
            {_id : objId1},
            {$set : setQuery},
            {new : true}
        );
        console.log("setQuery --- >",setQuery);
        console.log("update --- >",update);
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID}); 
        res.status(200).json({ message :"Updated project details"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }

}

//Function to push runlog to the given project. 
async function updateRunLog (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Pushed run log details";
    let userID = req.user.payload.userId;
    //Getting _id from array inside the db.
    let objId1 = await Project.findOne({ _id : req.params.projectID});
    let {runLogCount, testCasePassed, testCaseFailed, comment, imageOrAttachment} = req.body;
    let runLogObj = {runLogCount, testCasePassed, testCaseFailed, comment, imageOrAttachment};

    if(runLogCount == "" || testCasePassed == "" || testCaseFailed == "" || comment == "" || imageOrAttachment == "")
    {
      res.json({ message : "Please fill all the details in runlog!!!"});  
    }else{
        try {
            let update = await Project.findOneAndUpdate(
                {_id : objId1},
                {$push :{"runLog":runLogObj}}
            ) 
            await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID}); 
            res.status(200).json({ message :"Updated runLog details"});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message : error});
        } 
    }
}

//Function to push testcase details of the given project.
async function updateTestCase (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Pushed test Case details";
    let userID = req.user.payload.userId;
    //Getting _id from array inside the db.
    let objId1 = await Project.findOne({ _id : req.params.projectID});
    let {title, testDescriptions, attachment, status, assignedTo} = req.body;
    let testCaseObj = {title, testDescriptions, attachment, status, assignedTo};

    if(title == "" || testDescriptions == "" || attachment == "" || status ==  "" || assignedTo == ""){
        res.json({ message : "Please fill all the details in test case!!!"});
    }else{
        try {
            let update = await Project.findOneAndUpdate(
                {_id : objId1},
                {$push :{"testCase": testCaseObj}}
            ) 
            await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID}); 
            res.status(200).json({message : "Successfully updated project"});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message : error});
        } 
    }
}

//Function to delete the project.
async function deleteProject (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted test case";
    let userID = req.user.payload.userId;
    try {
        let deleteProject = await Project.remove({_id : req.params.projectID});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID});
        res.status(200).json({message : "Successfully deleted project"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

module.exports = {
    postProject : postProject,
    getProject : getProject,
    getProjectById : getProjectById,
    updateProject : updateProject,
    updateRunLog : updateRunLog,
    updateTestCase : updateTestCase,
    deleteProject : deleteProject
}