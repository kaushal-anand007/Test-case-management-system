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
const User = require('../Models/user');
const csvtojson = require("csvtojson");
const path = require('path');


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
    let userRole = req.user.payload.user.role;
    let status;
    
    try {
        console.log("dssf -->",req.files);
        let { nameOfProject, handledBy, projectDescription, members, attachments, startDate, endDate, relevantData} = req.body;
        let projectObj = { nameOfProject, handledBy, projectDescription, members, attachments, startDate, endDate, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date, "role" : userRole}
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

                        // if(req.files.length == undefined){
                        //     req.files.length == 0;
                        // }

                        let attachments = [];
                        for(let i = 0; i<req.files.length; i++){
                            attachments.push(req.files[i].originalname)
                        }
                       
                        projectObj["attachments"] =  attachments;
                        await Project.create( projectObj);
                        let result = {
                            status : 'success',
                            data : {
                                message : " Project has sucessfully created "
                            }
                        }

                        let fName = "";
                        let email = "";
                        let confirmationCode = "";
                        let path = '';
                        let password = "";
                        let otp = "";
                        let html = "get deatils about project";
                        let csv = "";
                        let runcode = "";
                        let filename = projectcode;
                        let projectName = "";
                        let member = [];
                        for(let i=0;i<members.length;i++){
                            member.push(members[i].fName);
                        }
            
                        getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate);
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
    let userID = req.user.payload.userId;
    let output;
    let projectOutput = [];

    try {
        let userRole = req.user.payload.user.role;
        let getProjectDetails = await Project.find({"condition" : "Active", $or : [{"members._id" : userID}, {"handledBy._id" : userID}]}).sort({_id : -1});
        let index = userRole.lastIndexOf(' ');
        let role = userRole.slice(0,index);
        if(role == 'Admin'){
            output = await Project.find({ "condition" : "Active" }).sort({_id : -1});
        }else{
            getProjectDetails.forEach(function(r,i){
                let projectObj = Object.assign({},{_id:r._id,projectCode:r.projectCode,nameOfProject:r.nameOfProject,handledBy:r.handledBy,projectDescription:r.projectDescription,members:r.members,startDate:r.startDate,endDate:r.endDate,status:r.status,createdBy:r.createdBy,createdOn:r.createdOn,modifiedBy:r.modifiedBy,modifiedOn:r.modifiedOn,condition:r.condition,attachments:r.attachments});
                projectOutput.push(projectObj);
            });
            output = projectOutput
        } 
        res.status(200).json(output);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
 };
 
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

        if(daterightnow <= startdate){
            status = 'created';
        };
         
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
        let result = await Scenario.find({"projectId" : req.params.projectID}).sort({_id : -1});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}


//Function to post test case.
async function postTestCase (req,res){
    let date = new Date();
    let time = date.toLocaleTimeString(); 
    let action = "Add test Case";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let role = req.user.payload.user.role;
    let projectId = req.params.projectID;
    let testCaseCode;
    let scenario;

    //Getting _id from array inside the db.
    let {title, testDescriptions, scenarioID, relevantData} = req.body;
    console.log("testDescriptions --- > ", testDescriptions);
    let testCaseObj = {testCaseCode, title, "projectID" : projectId, "userID" : userID, testDescriptions, scenarioID, scenario, "createdBy" : actedBy, "createdOn" : date, "role" : role};

    if(title == "" || testDescriptions == ""){
        res.json({ message : "Please fill all the details in test case!!!"});
    }else{
        try {
            await TestCase.findOne({"title" : title}, async function(err,results){
                if(err){ res.json({message : err})}
                if(results){
                    console.log("title --- > ", title);
                    console.log("result ---> ",results);
                    res.json({ message : "The test case already exists!!!!"});
                }else{
                    getNextSequenceValue("testCaseCode").then(async data => {
                        let testcasecode = 'TC'+ data;    
                        testCaseObj.testCaseCode = testcasecode;
                        let getScenario = await Scenario.findOne({"_id" : scenarioID});
                        let getPendingTestCase = await RunLog.findOne({"projectId" : projectId});
                        testCaseObj["scenario"] = getScenario.title;

                        let testCaseResult = await TestCase.create(testCaseObj);
                        if(getPendingTestCase != null && getPendingTestCase.status != 'completed'){
                            await RunLog.findOneAndUpdate({"projectId" : projectId}, {$push : {"testCaseList" : testCaseResult}, $inc : {"totalTestCase" : 1, "testCasePending" : 1}, $set : {"status" : "pending"}});
                        }

                        let fName = "";
                        let email = "";
                        let confirmationCode = "";
                        let path = '';
                        let password = "";
                        let otp = "";
                        let html = "get deatils about test case";
                        let csv = "";
                        let runcode = "";
                        let filename = testcasecode;
                        let member = "";
                        let startDate = "";
                        let endDate = "";
                        let projectDescription = "";
                        let handledBy = "";
                        let nameOfProject = "";
                        let Time = time;
                        scenario = getScenario.title;
                        let Date = date.toDateString();
                        let projectName = "";
            
                        getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate, title, testDescriptions, scenario, actedBy, Date, Time);
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
};

//Function to convert json testcase from csv file.
async function getjsonfromcsv (req,res) {
    let { csvFile } = req.body;
    try {
        console.log("Hello");
        let csvFilePath = `/home/kaushal/Desktop/workspace-storeking/test-case-api-service/csv_attachment/${csvFile}`;
       // console.log(csvFilePath);
        let jsonArray = await csvtojson().fromFile(csvFilePath);
        //console.log("jsonArray ---> ", jsonArray);
        let testObj = Object.assign({},jsonArray);
        let result = Object.values(testObj);
        console.log("result --- >", result);
        await TestCase.create(result);
        res.status(200).json({ message : "CSV file sucessfull fetched and saved into db" }); 
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
};

//Function to get all test cases.
async function getTestCase (req,res) {
    try {
        let output = await TestCase.find({$and : [{"projectID" : req.params.projectID}, {"condition" : "Active"}]}).sort({_id : -1});
        res.status(200).json(output);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to get test case by id.
async function getTestCaseById (req,res) {
    try {
        let output = await TestCase.findOne({"_id" : req.params.testCaseID});
        res.status(200).json(output);
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
    let attachmentArray = [];
    let additionalAttachmentArray = [];
    let videoAttachmentArray = [];
    
    try {
        const obj = JSON.parse(JSON.stringify(req.files));
        console.log("length ---> ", obj.imageOrAttachment.length);
        let {title, testDescriptions, status, remark, imageOrAttachment, additionalImageOrAttachment, videoAttachment, relevantData, runLogId} = req.body;

        for(let i=0; i<obj.imageOrAttachment.length; i++){
            let result = obj.imageOrAttachment[i].originalname
            attachmentArray.push(result)
        }

        for(let i=0; i<obj.additionalImageOrAttachment.length; i++){
            let result = obj.additionalImageOrAttachment[i].originalname
            additionalAttachmentArray.push(result)
        }

        for(let i=0; i<obj.videoAttachment.length; i++){
            let result = obj.videoAttachment[i].originalname
            videoAttachmentArray.push(result)
        }

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
            if(testedBy){
                setQuery["testedBy"] = testedBy;
            }
            if(status) {
                setQuery["status"] = status;
            }
            if(remark) {
                setQuery["remark"] = remark;
            }

            await TestCase.findByIdAndUpdate({"_id" : testcaseId}, {$set : setQuery, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray, "videoAttachment" : videoAttachmentArray}, "modifiedBy" : actedBy, "modifiedOn" : date, "testedBy" : actedBy});
            await TestCase.findOneAndUpdate({"_id" : testcaseId}, {$set : {"testedBy" : testedBy}});

            let statusData = Data.status;

            if(status == 'passed'){
                if(statusData == 'passed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 0, "testCaseFailed" : 0}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'failed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCaseFailed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){

                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else{
                    res.status(400).json({message : "The required request is not available"});
                }
            };

            if(status == 'failed'){
                if(statusData == 'failed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 0, "testCaseFailed" : 0}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});    
                }else if(statusData == 'passed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1, "testCasePassed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1,"testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}, $push : {"imageOrAttachment" : attachmentArray, "additionalImageOrAttachment" : additionalAttachmentArray}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else{
                    res.status(400).json({message : "The required request is not available"});
                }
            };
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

//Function to delete test case.
async function deleteTestCase (req,res) { 
    try {
        await TestCase.remove({"_id" : req.params.testCaseID});
        res.status(200).json({message : "test case remove sucessfully!!!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to remove test case.
async function changeTestCaseCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let testcaseid = req.params.testCaseID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action;

    if(condition == "Active"){
        action = "The testcase Activated"
    }
    if(condition == "Inactive"){
        acttion = "The testcase Deactivated"
    }

    try {
        let testCaseData = await TestCase.findOne({"_id" : testcaseid});
        await TestCase.findOneAndUpdate({ "_id" : testcaseid }, {$set : { "condition" : condition}});
        let actedOn = testCaseData.testCaseCode;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : actedOn, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed testcase status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
};

//Function to post run log.
async function postRunLog (req,res) {
    let date = new Date();
    let action = "Added run log";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let lname = req.user.payload.user.lName;
    let role = req.user.payload.user.role;
    let projectId = req.params.projectID;
    let runLogCode;
    let totalTestCase;
    let testCasePassed;
    let testCaseFailed;
    let testCasePending;
    let testCaseList;
 
    try {
        let { remark, imageOrAttachment, filename, pdfFileName, status, relevantData } = req.body;
        let runLogObj = { runLogCode, totalTestCase, testCasePassed, testCaseFailed, testCasePending, "userID" : userID, "projectId" : projectId, testCaseList, "leadBy" : { "_id" : userID, "fName" : actedBy, "lName" : lname}, remark, imageOrAttachment, filename, pdfFileName, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date, "role" : role};

        let getTestCase = await TestCase.find({ $and : [{"projectID" : projectId}, {"condition" : "Active"}] });
        let getProject = await Project.findOne({"_id" : projectId});
        let title = getProject.nameOfProject

        if(remark == "" || status == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            getNextSequenceValue("runLogCode").then(async data => {
                let runlogcode = 'RL'+ data;
                totalTestCase = getTestCase.length;
                runLogObj["runLogCode"] = runlogcode;
                runLogObj["totalTestCase"] = totalTestCase;
                let countPassed = 0;
                let countFailed = 0;
                let countPending = 0;
                let testCase = await TestCase.find({"projectID" : projectId});
                
                for(let i = 0; i<testCase.length; i++){
                    if(testCase[i].status == "passed"){
                        countPassed = countPassed + 1;
                    }
                    if(testCase[i].status == "failed"){
                        countFailed = countFailed + 1;
                    }
                    if(testCase[i].status == "pending"){
                        countPending = countPending + 1;
                    }
                }
                runLogObj["testCasePassed"] = countPassed;
                runLogObj["testCaseFailed"] = countFailed;
                runLogObj["testCasePending"] = countPending;
                runLogObj["testCaseList"] = getTestCase;
                runLogObj["projectTitle"] = title;

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
        let output = await RunLog.find({$and : [{"projectId" : req.params.projectID}, {"condition" : "Active"}]}).sort({_id : -1});
        res.status(200).json(output);
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
        let { comment, imageOrAttachment, status, remark, relevantData } = req.body;
        let Data = await RunLog.findOne({"_id" : runlogId})
        if(Data == null){
            res.status(400).json({ message : "The required runlog is not present!"})
        }else{
            let setQuery = {};

            if(comment) {
                setQuery["comment"] = comment;
            }
            if(imageOrAttachment) {
                setQuery["imageOrAttachment"] = imageOrAttachment;
            }
            if(status) {
                setQuery["status"] = status;
            }
            if(remark) {
                setQuery["remark"] = remark ;
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

//Function to delete runlog.
async function deleteRunlog (req,res) { 
    try {
        await RunLog.remove({"_id" : req.params.runLogID});
        res.status(200).json({message : "runlog deleted sucessfully!!!!"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to remove runlog.
async function changeRunLogCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let runlogid = req.params.runLogID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action;

    if(condition == "Active"){
        action = "The runlog Activated"
    }
    if(condition == "Inactive"){
        acttion = "The runlog Deactivated"
    }

    try {
        let runLogData = await RunLog.findOne({"_id" : runlogid});
        await RunLog.findOneAndUpdate({ "_id" : runlogid }, {$set : { "condition" : condition}});
        let actedOn = runLogData.runLogCode;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : actedOn, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed runlog status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
};

//Generate run log pdf.
async function generatePdf (req, res) {
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
        let html = 'get pdf for runlog';
        if(Data == null){
            res.status(400).json({ message : "The required run log is not present!"})
        }else{
            let runlogcode = Data.runLogCode;
                    //convert html to pdf
                    convertHtmlToPdf(Data, filename, pdfFileName, html, runcode).then(async result => {
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$set : {"filename" : filename, "pdfFileName" : pdfFileName}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                    res.status(200).json({message : "PDF generated!"});
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

//Generate csv file.
async function convertJsonToCsv (req,res){
    let date = new Date();
    let action = "Generated csv of run log and send it to mail";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    try {
        let runLogId = req.params.runLogID
        let Data = await RunLog.findOne({"_id" : runLogId});
        let runcode = Data.runLogCode;
        let filename = 'runlog';
        let html = 'get csv for runlog';
        if(Data == null){
            res.status(400).json({ message : "The required run log is not present!"})
        }else{
            let runlogcode = Data.runLogCode;
            //convert json to csv.
            let dataArrays = await RunLog.find({"_id" : runLogId});
            var myJSON = JSON.stringify(dataArrays);
            var myParse = JSON.parse(myJSON);
            let fields = ['leadBy.fName','totalTestCase','testCasePassed','testCaseFailed','testCasePending','status','runLogCode','projectId','testCaseList._id','testCaseList.status', 'testCaseList.testCaseCode', 'testCaseList.testDescriptions', 'testCaseList.scenarioID', 'testCaseList.scenario', 'testCaseList.testedBy.fName', 'remark', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'];
            let transforms = [unwind({ paths: ['testCaseList']})];
            let json2csvParser = new Parser({ fields, transforms });
            let csv = json2csvParser.parse(myParse);

            let fName ="";
            let email = "";
            let confirmationCode = "";
            let path = '';
            let password = "";
            let otp = "";
            filename = runcode;

            getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode);
            await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
            res.status(200).json({message : "CSV generated!"});
           }
        }catch(error) {
           console.log(error);
        res.status(400).json({ message : "CSV not Generated!"});
    }

}


async function changeProjectCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let projeictd = req.params.projectID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action;

    if(condition == "Active"){
        action = "The project Activated"
    }
    if(condition == "Inactive"){
        acttion = "The project Deactivated"
    }   

    try {
        let projectData = await Project.findOne({"_id" : projeictd});
        let projectcode = projectData.projectCode;
        await Project.findOneAndUpdate({ "_id" : projeictd }, {$set : { "condition" : condition}});
        let actedOn = projectData.nameOfProject;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : projectcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed project status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
};

async function getProjectAttachments (req,res){
    let attachment = req.params.filename
    try {
        let filePath = '/home/kaushal/Desktop/workspace-storeking/test-case-api-service/public/projectAttachments/'
        res.sendFile(filePath+`${attachment}`)
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "Error! File is not present."})
    }
};

async function getTestcaseAttachment (req,res){
    let attachment = req.params.filename
    try {
        let filePath = '/home/kaushal/Desktop/workspace-storeking/test-case-api-service/public/testcaseAttachments/'
        res.sendFile(filePath+`${attachment}`)
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "Error! File is not present."})
    }
};

async function getCsvOfTestcase (req,res){
    let date = new Date();
    let action = "Generated csv for test case and downloaded";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let projectId = req.params.projectID;

    try {
        //convert json to csv.
        let dataArrays = await TestCase.find({"projectID" : projectId});
        let project = await Project.findOne({"_id" : projectId})
        let projectCode = project.projectCode;
        let myJSON = JSON.stringify(dataArrays);
        let myParse = JSON.parse(myJSON);
        let fields = ['testCaseCode','title','projectID','userID','testDescriptions','scenarioID','scenario','runLogId','status','testedBy._id', 'testedBy.fName', 'testedBy.lName', 'remark', 'imageOrAttachment', 'additionalImageOrAttachment', 'videoAttachment', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'];
        let transforms = [unwind({ paths: ['testCaseList']})];
        let json2csvParser = new Parser({ fields, transforms });
        let csv = json2csvParser.parse(myParse);

        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
    
        res.header('Content-Type', 'text/csv');
        res.attachment(`${projectCode}.csv`);
        res.status(200).send(csv);
    } catch (error) {
          console.log(error);
        res.status(400).json({ message : "CSV not Download!"});
    }
}

module.exports = {  
    postProject : postProject,
    getProject : getProject,
    getProjectById : getProjectById,
    updateProject : updateProject,
    deleteProject : deleteProject,
    postScenario : postScenario,
    getScenario : getScenario,
    deleteRunlog : deleteRunlog,
    changeRunLogCondition : changeRunLogCondition,
    getRunLogById : getRunLogById,
    getRunLog : getRunLog,
    getTestCaseById : getTestCaseById,
    deleteTestCase : deleteTestCase,
    changeTestCaseCondition : changeTestCaseCondition,
    getTestCase : getTestCase,
    getjsonfromcsv : getjsonfromcsv,
    postTestCase : postTestCase,
    postRunLog : postRunLog,
    generatePdf : generatePdf,
    convertJsonToCsv : convertJsonToCsv,
    getFilterdProject : getFilterdProject,
    updateRunLog : updateRunLog,
    updateTestCase : updateTestCase,
    changeProjectCondition : changeProjectCondition,
    getProjectAttachments : getProjectAttachments,
    getTestcaseAttachment : getTestcaseAttachment,
    getCsvOfTestcase : getCsvOfTestcase
}