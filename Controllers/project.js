const Project = require('../Models/project');
const mongoose =require('mongoose');

async function postProject (req,res) {
    try {
        let { nameOfProject, handledBy, projectDescription, startDate, endDate, runLog, testCase} = req.body;
        let projectObj = { nameOfProject, handledBy, projectDescription, startDate, endDate, runLog, testCase }
        await Project.create( projectObj);
        let result = {
            status : 'success',
            data : {
                message : " Project has sucessfully created "
            }
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

async function getProject (req,res) {
   try {
       let result = await Project.find();
       res.status(200).json(result);
   } catch (error) {
       res.status(400).json({ message : error });
   }
}

async function getProjectById (req,res) {
    try {
        let projectById = await Project.find({ _id : req.params.projectID})
        res.status(200).json(projectById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

async function updateProject (req,res) {

    let { nameOfProject, handledBy, projectDescription, runLogCount, testCasePass, testCaseFailed, comment, imageOrAttactment, title, testDescriptions, attachment, status, assignedToId, assignedToName } = req.body; 
    
    try {
        //Getting _id from array inside the db.
        let objId1 = await Project.findOne({ _id : req.params.projectID});
        let objId2 = objId1.runLog[0]._id;
        let objId3 = objId1.testCase[0]._id;

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
        if(runLogCount) {
            setQuery["runLog.$.runLogCount"] = runLogCount;
        }
        if(testCasePass) {
            setQuery["runLog.$.testCasePassed"] = testCasePass;
        }
        if(testCaseFailed) {
            setQuery["runLog.$.testCaseFailed"] = testCaseFailed;
        }
        if(comment) {
            setQuery["runLog.$.comment"] = comment;
        }
        if(imageOrAttactment) {
            setQuery["runLog.$.imageOrAttactment"] = imageOrAttactment;
        }
        if(title) {
            setQuery["testCase.$.title"] = title;
        }
        if(testDescriptions) {
            setQuery["testCase.$.testDescriptions"] = testDescriptions;
        }
        if(attachment) {
            setQuery["testCase.$.attachment"] = attachment;
        }
        if(status) {
            setQuery["testCase.$.status"] = status;
        }
        if(assignedToId) {
            setQuery["testCase.$.assignedToId"] = assignedToId;
        }
        if(assignedToName) {
            setQuery["testCase.$.assignedToName"] = assignedToName;
        }

        let update = await Project.findOneAndUpdate(
            {_id : objId1, "runLog._id" : objId2, "testCase._id" : objId3},
            {$set : setQuery},
            {new : true}
        )
        res.status(200).json(update);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }

}

async function deleteProject (req,res) {
    try {
        let deleteProject = await Project.remove({_id : req.params.projectID});
        res.status(200).json(deleteProject);
    } catch (error) {
        res.status(400).json({ message : error});
    }
}

module.exports = {
    postProject : postProject,
    getProject : getProject,
    getProjectById : getProjectById,
    updateProject : updateProject,
    deleteProject : deleteProject
}