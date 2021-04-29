const Project = require('../Models/project');
const mongoose =require('mongoose');
const Log =require('../Models/log');
const RoleCounter = require('../Models/counter');
const toCreateMessageforLog = require('../Helpers/log');
const convertHtmlToPdf = require('../Helpers/pdf');
const RunLog = require('../Models/runlog');
const TestCase = require('../Models/testcase');
const Scenario = require('../Models/scenario');
const { getMailThroughNodeMailer } = require('../Helpers/nodeMailer');
const { Parser, transforms: { unwind }  } = require('json2csv');

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
    let action = "Added project";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let status;
    
    try {
        let { nameOfProject, handledBy, projectDescription, members, startDate, endDate, relevantData} = req.body;

        let projectObj = { nameOfProject, handledBy, projectDescription, members, startDate, endDate, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date}
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
                        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
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
};

//Function to list all the project.
async function getProject (req,res) {
    try {
        let result = await Project.find({"condition" : "Active"}).sort({_id : -1});
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
         "endDate" : req.body.endDate,
         "condition" : "Active"
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
     let date = new Date();
     let projectId = req.params.projectID;
     let status;
     try {
         let project = await Project.findOne({"_id" : projectId});
         let daterightnow = date;
         let startdate = project.startDate;
         let enddate = project.endDate;
         
         if(( startdate <= daterightnow) &&  (daterightnow <= enddate) ){
             status = 'progress';
         };
 
         if ( daterightnow >= enddate){
             status = 'pending';
         };
 
         await Project.findOneAndUpdate({"_id" : projectId}, {$set : {"status" : status}});
         let projectById = await Project.find({ "_id" : projectId});
         res.status(200).json(projectById);
     } catch (error) {
         console.log(error);
         res.status(400).json({ message : error });
     }
 }


//Function to update the project details.
async function updateProject (req,res) {
    let date = new Date();
    let action = "Updated project";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let { nameOfProject, handledBy, projectDescription, members, status, relevantData} = req.body;
    let projectId = req.params.projectID;
        
    try {
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
        if(status) {
            setQuery["status"] = status;
        }

        let project = await Project.findOne({ "_id" : projectId })
        await Project.updateOne(
            { "_id" : projectId },{$set : setQuery, "modifiedBy" : actedBy, "modifiedOn" : date, $addToSet : { "members":members }}
        );
        
        let projectcode = project.projectCode;

        console.log("project --- > ",project);
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
        res.status(200).json({ message :"Updated project details"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
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
        let project = Project.findOne({_id : projectID});
        await Project.deleteOne({_id : projectID});
        let projectcode = project.projectCode;
        let actedOn = project.nameOfProject;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Successfully deleted project"});     
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
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
    let projectId = req.params.projectID;

    try {
        let objId = await Project.findOne({ "_id" : projectId});
        let scenario = await Scenario.create(scenarioObj);
        let scenarioId = scenario._id;
        await Scenario.findOneAndUpdate({"_id" : scenarioId}, {"projectId" : projectId});
        let projectcode = objId.projectCode
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
        res.status(200).json({message : "Successfully added Scenario"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

//Function to get all scenario.
async function getScenario (req,res){
    try {
        let result = await Scenario.find().sort({_id : -1});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}


//Function to post test case.
async function postTestCase (req,res){
    let date = new Date();
    let action = "Add test Case";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let projectId = req.params.projectID;
    let testCaseCode;
    let scenario;

    //Getting _id from array inside the db.
    let {title, testDescriptions, scenarioID, relevantData} = req.body;
   
    let testCaseObj = {testCaseCode, title, "projectID" : projectId, "userID" : userID, testDescriptions, scenarioID, scenario, "createdBy" : actedBy, "createdOn" : date};

    if(title == "" || testDescriptions == ""){
        res.json({ message : "Please fill all the details in test case!!!"});
    }else{
        try {
            await TestCase.findOne({"title" : title}, async function(err,results){
                if(err){ res.json({message : err})}
                if(results){
                    res.json({ message : "The test case already exists!!!!"});
                }else{
                    getNextSequenceValue("testCaseCode").then(async data => {
                        let testcasecode = 'TC'+ data;    
                        testCaseObj.testCaseCode = testcasecode;
                        let getScenario = await Scenario.findOne({"_id" : scenarioID});
                        testCaseObj["scenario"] = getScenario.title;
                        await TestCase.create(testCaseObj);
                        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                        res.status(200).json({message : "Successfully added test case"});
                            }).catch(error => {
                        console.log(error);
                    res.status(400).json( { message : error });
                    });
             }});         
        } catch (error) {
            console.log(error);
            res.status(400).json({ message : error});
        } 
    }
}

//Function to get all test cases.
async function getTestCase (req,res) {
    try {
        let result = await TestCase.find().sort({_id : -1});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to get test case by id.
async function getTestCaseById (req,res) {
    try {
        let result = await TestCase.findOne({"_id" : req.params.testCaseID});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to update test case.
async function updateTestCase (req,res) {
    let date = new Date();
    let action = "Updated test Case";
    let actedBy = req.user.payload.user.fName;
    let testcaseId = req.params.testCaseID;
    let userID = req.user.payload.userId;
    let lname = req.user.payload.user.lName;
    
    try {
        let {title, testDescriptions, status, remark, imageOrAttachment, relevantData, runLogId} = req.body;
        let Data = await TestCase.findOne({"_id" : testcaseId});
        let testcasecode = Data.testCaseCode;
        let testedBy = {
            "_id" : userID,
            "fName" : actedBy,
            "lName" : lname
        };

        if(Data == null){
            res.status(400).json({ message : "The required test case is not present!"})
        }else{
            let setQuery = {};

            if(title) {
                setQuery["title"] = title;
            }
            if(testDescriptions) {
                setQuery["testDescriptions"] = testDescriptions;
            }
            if(status) {
                setQuery["status"] = status;
            }
            if(testedBy) {
                setQuery["testedBy"] = testedBy;
            }
            if(remark) {
                setQuery["remark"] = remark;
            }
            if(imageOrAttachment) {
                setQuery["imageOrAttachment"] = imageOrAttachment;
            }
           
            await TestCase.findByIdAndUpdate({"_id" : testcaseId}, {$set : setQuery, "modifiedBy" : actedBy, "modifiedOn" : date, "testedBy" : actedBy});

            let statusData = Data.status;
            console.log("status --- > ",status);
            console.log("statusData --- > ",statusData);

            if(status == 'passed'){
                if(statusData == 'passed'){
                    res.status(200).json({message : "This test case is already passed!!"});
                }else if(statusData == 'failed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCaseFailed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else{
                    res.status(400).json({message : "The required request is not available"});
                }
            }

            if(status == 'failed'){
                if(statusData == 'failed'){
                    res.status(200).json({message : "This test case is already failed!!"});    
                }else if(statusData == 'passed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1, "testCasePassed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1,"testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else{
                    res.status(400).json({message : "The required request is not available"});
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

//Function to remove test case.
async function removeTestCase (req,res) { 
    try {
        await TestCase.remove({"_id" : req.params.testCaseID});
        res.status(200).json({message : "test case remove sucessfully!!!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to post run log.
async function postRunLog (req,res) {
    let date = new Date();
    let action = "Added run log";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let lname = req.user.payload.user.lName;
    let projectId = req.params.projectID;
    let runLogCode;
    let totalTestCase;
    let testCasePassed;
    let testCaseFailed;
    let testCasePending;
    let testCaseList;
 
    try {
        let { runLogCount, remark, imageOrAttachment, scenarioID, filename, pdfFileName, status, relevantData } = req.body;
        let runLogObj = { runLogCode, runLogCount, totalTestCase, testCasePassed, testCaseFailed, testCasePending, "userID" : userID, "projectId" : projectId, testCaseList, "leadBy" : { "_id" : userID," fName" : actedBy, "lName" : lname}, remark, imageOrAttachment, filename, pdfFileName, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date};

        let getTestCase = await TestCase.find({ "scenarioID" : scenarioID });
        console.log("getTestCase -- > ", getTestCase);

        if(runLogCount == "" || remark == "" || status == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            getNextSequenceValue("runLogCode").then(async data => {
                let runlogcode = 'RL'+ data;
                totalTestCase = getTestCase.length;

                runLogObj["runLogCode"] = runlogcode;
                runLogObj["totalTestCase"] = totalTestCase;
                runLogObj["testCasePending"] = totalTestCase;
                runLogObj["testCaseList"] = getTestCase;
                runLogObj["scenarioID"] = scenarioID;

                await RunLog.create(runLogObj);
                let result = {
                    status : 'success',
                    data : {
                        message : "Successfully added run log!!!"
                    }
                }
                await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
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

//get all run log.
async function getRunLog (req,res){
    try {
        let result = await RunLog.find().sort({_id : -1});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    } 
}

//get run log by id.
async function getRunLogById (req,res){
    try {
        let result = await RunLog.findOne({"_id" : req.params.runLogID});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    } 
}

//Function to update run log. 
async function updateRunLog (req,res) {
    let date = new Date();
    let userID = req.user.payload.userId;
    let action = "Updated run log";
    let actedBy = req.user.payload.user.fName;
    let runlogId = req.params.runLogID;

    try {
        let { runLogCount, comment, imageOrAttachment, status, relevantData } = req.body;
        let Data = await RunLog.findOne({"_id" : runlogId})
        if(Data == null){
            res.status(400).json({ message : "The required runlog is not present!"})
        }else{
            let setQuery = {};

            if(runLogCount) {
                setQuery["runLogCount"] = runLogCount;
            }
            if(comment) {
                setQuery["comment"] = comment;
            }
            if(imageOrAttachment) {
                setQuery["imageOrAttachment"] = imageOrAttachment;
            }
            if(status) {
                setQuery["status"] = status;
            }

            await RunLog.findOneAndUpdate({ "_id": runlogId }, { $set : setQuery, "modifiedBy" : actedBy, "modifiedOn" : date });
            let runlogcode = Data.runLogCode;
            await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
          res.status(200).json({ message :"Updated runLog details"});
        } 
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

//Function to remove runlog case.
async function removeRunlog (req,res) { 
    try {
        await RunLog.remove({"_id" : req.params.runLogID});
        res.status(200).json({message : "runlog deleted sucessfully!!!!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Generate run log pdf
async function generatePdfAndCsv (req, res) {
    let date = new Date();
    let action = "Generated pdf of run log and send it to mail";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;

    try {
        let runLogId = req.params.runLogID
        let Data = await RunLog.findOne({"_id" : runLogId});
        let runcode = Data.runLogCode;
        let filename = 'runlog';
        let pdfFileName = runcode;
        let html = 'get pdf and csv for runlog';
        if(Data == null){
            res.status(400).json({ message : "The required run log is not present!"})
        }else{
            let runlogcode = Data.runLogCode;
                    //convert html to pdf
                    convertHtmlToPdf(Data, filename, pdfFileName, html, runcode).then(async result => {
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$set : {"filename" : filename, "pdfFileName" : pdfFileName}});
                        
                    //convert json to csv.
                    let dataArrays = await RunLog.find({"_id" : runLogId});
                    var myJSON = JSON.stringify(dataArrays);
                    var myParse = JSON.parse(myJSON);
                    let fields = ['leadBy','runLogCount','totalTestCase','testCasePassed','testCaseFailed','testCasePending','status','runLogCode','projectId','testCaseList._id','testCaseList.status', 'testCaseList.testCaseCode', 'testCaseList.testDescriptions', 'testCaseList.scenarioID', 'testCaseList.scenario', 'testCaseList.testedBy', 'remark', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'];
                    let transforms = [unwind({ paths: ['testCaseList']})];
                    let json2csvParser = new Parser({ fields, transforms });
                    let csv = json2csvParser.parse(myParse);

                    let fName ="";
                    let email = "";
                    let confirmationCode = "";
                    let path = '';
                    let password = "";
                    let otp = "";

                    getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode);
                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                    res.status(200).json({message : "pdf and csv generated!"});
                    }).catch((error) => {
                       console.log(error);
                    res.status(400).json({ message : "PDF not Generated!"});
               });
            }
        } catch (error) {
        console.log(error);
      res.status(400).json({error});
    }
};

async function changeProjectCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let projeictd = req.params.projectID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let action;

    if(condition == "Active"){
        action = "The project Activated"
    }
    if(condition == "Inactive"){
        acttion = "The project Inactived"
    }

    try {
        let projectData = await Project.findOne({"_id" : projeictd});
        await Project.findOneAndUpdate({ "_id" : projeictd }, {$set : { "condition" : condition}});
        let actedOn = projectData.nameOfProject;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed project status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
};

module.exports = {  
    postProject : postProject,
    getProject : getProject,
    getProjectById : getProjectById,
    updateProject : updateProject,
    deleteProject : deleteProject,
    postScenario : postScenario,
    getScenario : getScenario,
    removeRunlog : removeRunlog,
    getRunLogById : getRunLogById,
    getRunLog : getRunLog,
    getTestCaseById : getTestCaseById,
    removeTestCase : removeTestCase,
    getTestCase : getTestCase,
    postTestCase : postTestCase,
    postRunLog : postRunLog,
    generatePdfAndCsv : generatePdfAndCsv,
    getFilterdProject : getFilterdProject,
    updateRunLog : updateRunLog,
    updateTestCase : updateTestCase,
    changeProjectCondition : changeProjectCondition
}