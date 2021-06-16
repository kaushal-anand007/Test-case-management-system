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
const { title } = require('process');


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

                        

                        // let attachment = [];

                        // if(req.files != undefined){
                        //     for(let i = 0; i<req.files.length; i++){
                        //         attachments.push(req.files[i].originalname);
                        //     }
                        // }

                        // // for(let i = 0; i<req.files.length; i++){
                        // //     attachments.push(req.files[i].originalname)
                        // // }
                       
                        // projectObj["attachments"] =  attachment;
                        // console.log("attachments --- > ", attachment);
                        let projectData = await Project.create( projectObj);
                        let result = {
                            status : 'success',
                            data : {
                                message : " Project has sucessfully created ",
                                projectID : projectData._id
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
                        let createdby = actedBy;
                        for(let i=0;i<members.length;i++){
                            member.push(members[i].fName);
                        }
            
                        getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate, createdby);
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

    let {title, testDescriptions, scenarioID, relevantData, priority} = req.body;
    let project = await Project.findOne({"_id" : projectId})
    let projectName = project.nameOfProject
    let projectcode = project.projectCode;
    let testCaseObj = {testCaseCode, "title" : title, "projectID" : projectId, "projectTitle" :  projectName, "userID" : userID, "testDescriptions" : testDescriptions, "scenarioID" : scenarioID, scenario, "createdBy" : actedBy, "createdOn" : date, "role" : role, priority, "projectCode" : projectcode};
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
                        let createdby = "";
            
                        getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate, createdby, title, testDescriptions, scenario, actedBy, Date, Time);
                        let testcaseData = await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                        let result = {
                            status : 'success',
                            data : {
                                message : " Project has sucessfully created ",
                                testcaseID : testcaseData._id
                            }
                        } 
                        res.status(200).json({message : result});
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
    let date = new Date();
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let projectId = req.params.projectID;
    let testcasecode
    let getScenario;
    let getTitle;
    let getDescription;
    let getScenarioID;
    let getPriority;
    let getProjectCode;
    let getProjectTitle;

    try {
        let jsonArray = await csvtojson().fromFile(req.file.path);
        let testObj = Object.assign({},jsonArray);
        let result = Object.values(testObj);

        let projectCODE = await Project.findOne({ $and : [{"_id" : projectId}, {"condition" : "Active"}]});
     
        let projectcode = projectCODE.projectCode;
        let getprojectcode = result[0].projectCode;

        if(getprojectcode != projectcode){
            res.status(400).json({message : "This testcase is part of other project!!"});   
         }else{
            if(getTestCase != []){
                let getTestCase = await TestCase.find({ $and : [{"projectID" : projectId}, {"condition" : "Active"}]}); 
                for(let j=0; j< getTestCase.length; j++){
                    let testCaseTitle = getTestCase[j].title;
                    for(let k=0; k<result.length; k++){
                        getTitle = result[k].title;
                        if(getTitle == testCaseTitle){
                            //throw new Error(`${getTitle} is already present!!`);    
                            res.status(400).json({ message : `${testCaseTitle} is already present!!`}) 
                        }
                    } 
                }   
            }else{
                for(let i =0; i<result.length; i++){
                    getNextSequenceValue("testCaseCode").then(async data => {
                        testcasecode = 'TC'+ data;
                    });
                    getScenario = result[i].scenario;
                    getTitle = result[i].title;
                    getDescription = result[i].testDescriptions;
                    getPriority = result[i].priority;
                    getProjectCode = result[i].projectCode;
                    getProjectTitle = result[i].projectTitle;
      
                    let generatedScenario = await Scenario.create({"title" : getScenario , "createdBy" : actedBy, "createdOn" : date});
                    getScenarioID = generatedScenario._id;
                    await TestCase.create({"testCaseCode" : testcasecode, "title" : getTitle, "projectID" : projectId, "userID" : userID, "testDescriptions" : getDescription, "scenarioID" : getScenarioID, "scenario" : getScenario, "createdBy" : actedBy, "createdOn" : date, "priority" : getPriority, "projectCode" : getProjectCode, "projectTitle" : getProjectTitle});
                }
            res.status(200).json({ message : "CSV file sucessfull fetched and saved into db" }); 
            }
         }  
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
    // let attachmentArray = [];
    // let additionalAttachmentArray = [];
    // let videoAttachmentArray = [];
    
    try {
        // console.log("req.files --- > ", typeof req.files);
        // let obj

        // if(req.files !== undefined){
        //     obj = JSON.parse(JSON.stringify(req.files));
        //     console.log("obj --- > ", typeof obj);
        //     console.log("obj ---> ", obj);
        // }
        
        let {title, testDescriptions, status, remark, relevantData, runLogId, priority} = req.body;
        
        // if(obj !== undefined){
        //     if(obj.imageOrAttachment != undefined){
        //         for(let i=0; i<obj.imageOrAttachment.length; i++){
        //             let result = obj.imageOrAttachment[i].originalname
        //             attachmentArray.push(result)
        //         }
        //     }
            
        //     if(obj.additionalImageOrAttachment != undefined){
        //         for(let i=0; i<obj.additionalImageOrAttachment.length; i++){
        //             let result = obj.additionalImageOrAttachment[i].originalname
        //             additionalAttachmentArray.push(result)
        //         }
        //     }
            
        //     if(obj.videoAttachment != undefined){
        //         for(let i=0; i<obj.videoAttachment.length; i++){
        //             let result = obj.videoAttachment[i].originalname
        //             videoAttachmentArray.push(result)
        //         }
        //     }
        // }
        
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
            if(priority == null){
                priority = Data.priority;
            }

            await TestCase.findByIdAndUpdate({"_id" : testcaseId}, {$set : setQuery, "modifiedBy" : actedBy, "modifiedOn" : date, "testedBy" : actedBy, "priority" : priority});
            await TestCase.findOneAndUpdate({"_id" : testcaseId}, {$set : {"testedBy" : testedBy}});

            let statusData = Data.status;

            if(status == 'passed'){
                if(statusData == 'passed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 0, "testCaseFailed" : 0}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'failed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCaseFailed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 1, "testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else{
                    res.status(400).json({message : "The required request is not available"});
                }
            };

            if(status == 'failed'){
                if(statusData == 'failed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCasePassed" : 0, "testCaseFailed" : 0}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});    
                }else if(statusData == 'passed'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1, "testCasePassed" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});                    
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : testcasecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}); 
                    res.status(200).json({ message :"Updated runLog details"});
                }else if(statusData == 'pending'){
                    await RunLog.findOneAndUpdate({"_id" : runLogId}, {$inc : {"testCaseFailed" : 1,"testCasePending" : -1}});
                    await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseId}, {$set : {"testCaseList.$.status" : status, "testCaseList.$.testedBy" : testedBy, "testCaseList.$.remark" : remark}});                    
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
    let testCaseList = [];
    let runlogcode;
    let result;
    let countPassed = 0;
    let countFailed = 0;
    let countPending = 0;
    let flag = false;
 
    try {
        let { remark, imageOrAttachment, filename, pdfFileName, status, relevantData } = req.body;
        let runLogObj = { runLogCode, totalTestCase, testCasePassed, testCaseFailed, testCasePending, "userID" : userID, "projectId" : projectId, testCaseList, "leadBy" : { "_id" : userID, "fName" : actedBy, "lName" : lname}, remark, imageOrAttachment, filename, pdfFileName, "userID" : userID, status, "createdBy" : actedBy, "createdOn" : date, "role" : role};

        let getTestCase = await TestCase.find({ $and : [{"projectID" : projectId}, {"condition" : "Active"}] });
        let getProject = await Project.findOne({"_id" : projectId});
        let title = getProject.nameOfProject;

        if(remark == "" || status == ""){
            res.json({ message : "Please fill all the fields!!!"});
        }else{
            let checkRunLog = await RunLog.find({ $and : [{"projectId" : projectId}, {"condition" : "Active"}] });

            if(checkRunLog != []){
                for(let i = 0; i<checkRunLog.length; i++){
                    if(checkRunLog[i].status == "created" || checkRunLog[i].status == "started"){
                        flag = true;
                        continue;
                        //res.status(400).json({ message : "Please Complete the previous runlog before proceeding to new runlog!!!"});
                    }
            }
            getNextSequenceValue("runLogCode").then(async data => {
                runlogcode = 'RL'+ data;
                totalTestCase = getTestCase.length;
                runLogObj["runLogCode"] = runlogcode;
                runLogObj["totalTestCase"] = totalTestCase;
                for(let i = 0; i<getTestCase.length; i++){
                    if(getTestCase[i].status == "passed"){
                        countPassed = countPassed + 1;
                    }
                    if(getTestCase[i].status == "failed"){
                        countFailed = countFailed + 1;
                    }
                    if(getTestCase[i].status == "pending"){
                        countPending = countPending + 1;
                    }
                }

                runLogObj["testCasePassed"] = countPassed;
                runLogObj["testCaseFailed"] = countFailed;
                runLogObj["testCasePending"] = countPending;
                runLogObj["testCaseList"] = getTestCase;
                runLogObj["projectTitle"] = title;
                
                await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : runlogcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                if(flag == true){
                    res.status(400).json({ message : "Please Complete the previous runlog before proceeding to new runlog!!!"});
                }else{
                    await RunLog.create(runLogObj);
                    result = {
                        status : 'success',
                            data : {
                            message : "Successfully added run log!!!"
                            }
                        }
                  res.status(200).json(result);
                }
            }).catch(error => {
                console.log(error);
                res.status(400).json( { message : error });
            });  
        } 
            
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
        let Data = await RunLog.findOne({"_id" : runlogId, "condition" : "Active"})
        let projectId = Data.projectId;
        let countPassed = 0;
        let countFailed = 0;
        let countPending = 0;
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

            let getTestCase = await TestCase.find({"projectID": projectId, "condition" : "Active"})

            

            for(let i = 0; i<getTestCase.length; i++){
                    if(getTestCase[i].status == "passed"){
                        countPassed = countPassed + 1;
                    }
                    if(getTestCase[i].status == "failed"){
                        countFailed = countFailed + 1;
                    }
                    if(getTestCase[i].status == "pending"){
                        countPending = countPending + 1;
                    }
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
            if(remark) {
                setQuery["remark"] = remark ;
            }    
           
            await RunLog.findOneAndUpdate({ "_id": runlogId }, { $set : setQuery, "modifiedBy" : actedBy, "modifiedOn" : date, "testCasePassed" : countPassed, "testCaseFailed" : countFailed, "testCasePending" : countPending});

            if(status == 'completed'){
                for(let i = 0; i<getTestCase.length; i++){
                    let priority = getTestCase[i].priority;
                    let testCaseId = getTestCase[i]._id;
                    await TestCase.findOneAndUpdate({ "_id" : testCaseId }, {"imageOrAttachment" : [], "videoAttachment" : [], "status" : 'pending', 'priority' : priority});
                }
            }

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

async function getTestcaseVideoAttachment (req,res){
    let attachment = req.params.filename
    try {
        let filePath = '/home/kaushal/Desktop/workspace-storeking/test-case-api-service/public/testcaseVideoAttachment/'
        res.sendFile(filePath+`${attachment}`)
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "Error! File is not present."})
    }
};

async function postImageAttachments (req,res) {
    let testcaseid = req.params.testCaseID;
    let { runLogId } = req.body;
    
    try {
        let attachments = [];

        if(req.files != undefined){
        for(let i = 0; i<req.files.length; i++){
            attachments.push(req.files[i].originalname);
           }
        }

        await TestCase.findOneAndUpdate({"_id" : testcaseid}, {$push : {"imageOrAttachment" : attachments}});
        await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseid}, {$push : {"testCaseList.$.imageOrAttachment" : attachments}});
        res.status(200).json("Attachments are uploaded!!!")
    } catch (error) {
        console.log(error);
        res.status(400).json("Attachments not uploaded!!!")
    }
}

async function postAttachmentsForProject (req,res) {
    let projectid = req.params.projectID;
    
    try {
        console.log("projectid ---> ", projectid);
        console.log("req.files --- > ", req.files);
        let attachments = [];

        if(req.files != undefined){
        for(let i = 0; i<req.files.length; i++){
            attachments.push(req.files[i].originalname);
           }
        }
        console.log("attachments --- > ", attachments);
        await Project.findOneAndUpdate({"_id" : projectid}, {$push : {"attachments" : attachments}});
        res.status(200).json("Attachments are uploaded!!!")
    } catch (error) {
        console.log(error);
        res.status(400).json("Attachments not uploaded!!!")
    }
}

async function postVideoAttachment (req,res) {
    let testcaseid = req.params.testCaseID;
    let { runLogId } = req.body;
    try {
        let attachments = [];

        if(req.files != undefined){
        for(let i = 0; i<req.files.length; i++){
            attachments.push(req.files[i].originalname);
           }
        }
        
        await TestCase.findOneAndUpdate({"_id" : testcaseid}, {$push : {"videoAttachment" : attachments}});
        await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseid}, {$push : {"testCaseList.$.videoAttachment" : attachments}});
        res.status(200).json("Video Attachments are uploaded!!!")
    } catch (error) {
        console.log(error);
        res.status(400).json("Video Attachments not uploaded!!!")
    }
}

async function postFileAttachment (req,res) {
    let testcaseid = req.params.testCaseID;
    let { runLogId } = req.body;
    try {
        let attachments = [];

        if(req.files != undefined){
        for(let i = 0; i<req.files.length; i++){
            attachments.push(req.files[i].originalname);
           }
        }
        
        await TestCase.findOneAndUpdate({"_id" : testcaseid}, {$push : {"fileAttachment" : attachments}});
        await RunLog.findOneAndUpdate({"_id" : runLogId, "testCaseList._id" : testcaseid}, {$push : {"testCaseList.$.fileAttachment" : attachments}});
        res.status(200).json("File Attachments are uploaded!!!");
    } catch (error) {
        console.log(error);
        res.status(400).json("File Attachments not uploaded!!!");
    }
}

async function getCsvOfTestcase (req,res){
    let date = new Date();
    let action = "Generated csv for test case and downloaded";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let projectId = req.params.projectID;
    console.log("projectId ---> ", projectId);

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
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
      
    } catch (error) {
          console.log(error);
        res.status(400).json({ message : "CSV not Downloaded!"});
    }
}

async function getAllTestCases (req,res) {
    try {
        let result = await TestCase.find({"condition" : "Active"}).sort({_id : -1});
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message : "Sorry cannot fing test cases"});
    }
}

async function getAllRunLogs (req,res) {
    try {
        let result = await RunLog.find({"condition" : "Active"}).sort({_id : -1});
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message : "Sorry cannot fing runlogs"});
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
    getCsvOfTestcase : getCsvOfTestcase,
    postImageAttachments : postImageAttachments,
    postVideoAttachment : postVideoAttachment,
    postAttachmentsForProject : postAttachmentsForProject,
    getTestcaseVideoAttachment : getTestcaseVideoAttachment,
    getAllTestCases : getAllTestCases,
    getAllRunLogs : getAllRunLogs,
    postFileAttachment : postFileAttachment
}