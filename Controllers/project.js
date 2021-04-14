const Project = require('../Models/project');
const mongoose =require('mongoose');
const Log =require('../Models/log');
const RoleCounter = require('../Models/counter');
const toCreateMessageforLog = require('../Helpers/log');
const User = require('../Models/user');

//Function to auto increment the usercode.
function getNextSequenceValue(sequenceName){
    return new Promise ( (resolve, reject) => {
             RoleCounter.findOneAndUpdate({"role" : sequenceName},{
                $set : { role : sequenceName},
                $inc : { sequenceValue: 1 }
             },{upsert: true, returnNewDocument:true}).then( (result) => {
                console.log(result);
                resolve(result ?  parseInt(result.sequenceValue)+1 : 1);
             })
             .catch( (error) => {
                console.log("error -- > ",error);
                reject(error);
        });
    });
};

//Function to post the project.
async function postProject (req,res) {
    let date = new Date();
    let action = "Added project details";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let runLog;
    let testCase;
    let scenario;
    
    try {
        let { nameOfProject, handledBy, projectDescription, members, startDate, endDate, relevantData} = req.body;
        let projectObj = { nameOfProject, handledBy, projectDescription, members, startDate, endDate, runLog, testCase, scenario, "userID" : userID, "createdBy" : actedBy, "createdOn" : date}
        if(nameOfProject == "" || handledBy == "" || projectDescription == "" || startDate == "" || endDate == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            await Project.findOne({"nameOfProject" : nameOfProject}, async function(err,results){
                    if(err){ res.json({message : err})}
                    if(results){
                        res.json({ message : "The project name already exists!!!!"});
                    }else{
                        getNextSequenceValue("projectCode").then(async data => {
                        let projectcode = 'P'+ data;    
                        projectObj.projectCode = projectcode;  
                        await Project.create( projectObj);
                        let result = {
                            status : 'success',
                            data : {
                                message : " Project has sucessfully created "
                            }
                        }
                        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
                        res.status(200).json(result);
                    
                     }).catch(error => {
                    console.log(error);
                    res.status(400).json( { message : error });
                  });    
                }
            });
        }
    }catch (error) {
        console.log(error);
    res.status(400).json({ message : error });
}
}

//Function to post scenario.
async function postScenario (req, res) {
    let date = new Date();
    let action = "Added scenario";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let { title, relevantData } = req.body;
    let scenarioObj = {title, "createdBy" : actedBy, "createdOn" : date};

    try {
        let objId = await Project.findOne({ _id : req.params.projectID});
        await Project.findOneAndUpdate(
            {_id : objId},
            {$push :{"scenario" : scenarioObj}}
        );
        let projectcode = objId.projectCode
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
        res.status(200).json({message : "Successfully added Scenario"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

//Function to post test case.
async function postTestCase (req,res){
    let date = new Date();
    let action = "Add test Case";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;

    //Getting _id from array inside the db.
    let objId1 = await Project.findOne({ _id : req.params.projectID});
    let {title, testDescriptions, attachment, status, assignedTo, relevantData} = req.body;
    let testCaseObj = {title, testDescriptions, attachment, status, assignedTo, "createdBy" : actedBy, "createdOn" : date};

    if(title == "" || testDescriptions == "" || attachment == "" || status ==  "" || assignedTo == ""){
        res.json({ message : "Please fill all the details in test case!!!"});
    }else{
        try {
            getNextSequenceValue("testCaseCode").then(async data => {
                let testcasecode = 'TC'+ data;    
                testCaseObj.testCaseCode = testcasecode; 
                let project = await Project.findOneAndUpdate(
                    {_id : objId1},
                    {$push :{"testCase": testCaseObj}}
                );
                let projectcode = project.projectCode;
                await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
                res.status(200).json({message : "Successfully added test case"});
                     }).catch(error => {
                console.log(error);
              res.status(400).json( { message : error });
            });     
        } catch (error) {
            console.log(error);
            res.status(400).json({ message : error});
        } 
    }
}

//Function to post run log.
async function postRunLog (req,res) {
    let date = new Date();
    let action = "Added run log";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let { runLogCount, testCasePassed, testCaseFailed, comment, imageOrAttachment, status, relevantData} = req.body;

    try {
        let runLogObj = { runLogCount, testCasePassed, testCaseFailed, comment, imageOrAttachment, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date};

        //Getting _id from array inside the db.
        let objId1 = await Project.findOne({ _id : req.params.projectID});
        if(runLogCount == "" || testCasePassed == "" || testCaseFailed == "" || comment == "" || imageOrAttachment == "" || status == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            getNextSequenceValue("runLogCode").then(async data => {
                let runlogcode = 'RL'+ data;    
                runLogObj.runLogCode = runlogcode;  
                let project = await Project.findOneAndUpdate(
                    {_id : objId1},
                    {$push :{"runLog":runLogObj}}
                ); 
                let result = {
                    status : 'success',
                    data : {
                        message : "Successfully added run log!!!"
                    }
                }
                let projectcode = project.projectCode;
                await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
                res.status(200).json(result);
             }).catch(error => {
            console.log(error);
            res.status(400).json( { message : error });
          });    
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Generate run log pdf
async function generatePdf (req, res) {
    let { filename, pdfFileName, runLogCode } = req.body;
    let projectId = req.params.projectId;
    try {
        let Data = await Project.findOne({"_id" : projectId});
        if(Data == null){
            res.status(400).json({ message : "The required project is not present!"})
        }else{
            for(let i=0; i< Data.runLog.length; i++){
                if (runLogCode == Data.runLog[i].runLogCode) {
                    Data = Data.runLog[i];
                    let runlogcode = Data.runLogCode;
                    if (Data.filename == pdfFileName) {
                        res.status(400).json({ message : "Duplicate pdf file name! Try another one."});
                    } else { 
                        convertHtmlToPdf(Data, filename, pdfFileName).then(async result => {
                            await Project.findOneAndUpdate({_id : req.params.projectID, "runLogCode" : runlogcode}, {$set : {"runLog.filename" : filename, "runLog.pdfFileName" : pdfFileName}});
                            res.status(200).json({ message : "PDF Generated!"});
                        }).catch((error) => {
                            res.status(400).json({ message : "PDF do not Generated!"});
                      });
                    }
                }else{
                    res.status(400).json({ message : "The required run log is not present!"})
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}


//Function to list all the project.
async function getProject (req,res) {
   try {
       let result = await Project.find().sort({_id : -1});
       res.status(200).json(result);
   } catch (error) {
       console.log(error);
       res.status(400).json({ message : error });
   }
}

//Function to filted list.
async function getFilterdProject (req, res) {
    let filter = {
        "startDate" : req.body.startDate,
        "endDate" : req.body.endDate
    };

    try{
        let filteredProject = await Project.find(filter);
        res.json(filteredProject);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
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
    let date = new Date();
    let action = "Updated project details";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let { nameOfProject, handledBy, projectDescription , members, startDate, endDate, status, relevantData} = req.body;
    let projectId = req.params.projectID; 
        
    try {
        //Getting _id from array inside the db.
        //let objId = await Project.findOne({ _id : req.params.projectID});

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
        if(status) {
            setQuery["status"] = status;
        }

        let project = await Project.findOne({"_id" : projectId});
        project["modifiedBy"] = actedBy;
        project["modifiedOn"] = date;

        await Project.updateOne(
            {_id : projectId},{$set : setQuery, $addToSet:{"members":members}}
        );

        let projectcode = project.projectCode;

        console.log("project --- > ",project);
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
        res.status(200).json({ message :"Updated project details"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }

}

//Function to update test case.
async function updateTestCase (req,res) {
    let date = new Date();
    let action = "Updated test Case";
    let actedBy = req.user.payload.user.fName;
    let {title, testDescriptions, attachment, status, assignedTo, relevantData} = req.body;
    let projectId = req.params.projectId;
    
    try {
        let Data = await Project.findOne({"_id" : projectID});
        if(Data == null){
            res.status(400).json({ message : "The required project is not present!"})
        }else{
            let project = await Project.findOne({"_id" : projectId});
            project["modifiedBy"] = actedBy;
            project["modifiedOn"] = date;

            let setQuery = {};

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
            if(assignedTo) {
                setQuery["testCase.$.assignedTo"] = assignedTo;
            }
           
            await Project.findByIdAndUpdate({"_id" : projectId, "testCaseCode" : title}, {$set : setQuery});
            let projectcode = project.projectCode;
            await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
            res.status(200).json({ message :"Updated runLog details"});
        } 
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

//Function to update run log. 
async function updateRunLog (req,res) {
    let date = new Date();
    let userID = req.user.payload.userId;
    let { runLogCode, runLogCount, testCasePassed, testCaseFailed, comment, imageOrAttachment, status, relevantData } = req.body;
    console.log("req.body --- > ",req.body);
    let action = "Updated run log";
    let actedBy = req.user.payload.user.fName;
    let projectId = req.params.projectID;

    try {
        let Data = await Project.findOne({"_id" : projectId});
        //let runLogCode = Data.runLogCode;
        if(Data == null){
            res.status(400).json({ message : "The required project is not present!"})
        }else{
        let project = await Project.findOne({"_id" : projectId});
        project["modifiedBy"] = actedBy;
        project["modifiedOn"] = date;    

        let setQuery = {};

        if(runLogCount) {
            setQuery["runLog.$.runLogCount"] = runLogCount;
        }
        if(testCasePassed) {
            setQuery["runLog.$.testCasePassed"] = testCasePassed;
        }
        if(testCaseFailed) {
            setQuery["runLog.$.testCaseFailed"] = testCaseFailed;
        }
        if(comment) {
            setQuery["runLog.$.comment"] = comment;
        }
        if(imageOrAttachment) {
            setQuery["runLog.$.imageOrAttachment"] = imageOrAttachment;
        }
        if(status) {
            setQuery["runLog.$.status"] = status;
        }
        
        let q = {"_id": projectId,"runLog.runLogCode": runLogCode}
        await Project.findOneAndUpdate(q, {$set : setQuery}, {useFindAndModify: false});
        let projectcode = Data.projectCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}}); 
        res.status(200).json({ message :"Updated runLog details"});
        } 
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

//Function to delete the project.
async function deleteProject (req,res) {
    let date = new Date()
    let action = "Deleted Project";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let projectID = req.params.projectID;
    let { relevantData } = req.body;
    
    try {
        await Project.remove({_id : projectID});
        let project = Project.findOne({_id : projectID});
        let projectcode = project.projectCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});
        res.status(200).json({message : "Successfully deleted project"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

module.exports = {
    postProject : postProject,
    postScenario : postScenario,
    postTestCase : postTestCase,
    postRunLog : postRunLog,
    generatePdf : generatePdf,
    getProject : getProject,
    getFilterdProject : getFilterdProject,
    getProjectById : getProjectById,
    updateProject : updateProject,
    updateRunLog : updateRunLog,
    updateTestCase : updateTestCase,
    deleteProject : deleteProject
}