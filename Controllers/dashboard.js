const Users = require('../Models/user');
const Project = require('../Models/project');
const RunLog = require('../Models/runlog');
const TestCases = require('../Models/testcase');
const Scenario = require('../Models/scenario');
const Logs = require('../Models/log');
const Counters = require('../Models/counter');
const date = new Date();
const todayDate = date.toLocaleDateString(); 

async function getAdminDashBoard(userID, userName){
        return new Promise(async (resolve,reject) => {
            try {
                let getdate = date.getDate();
                console.log("getdate --- > ", getdate);
                let adminDataObj = {};
        
                let totalProject = await Project.find({"condition" : "Active"});
                adminDataObj["totalProject"] = totalProject;
        
                let recentlyCreatedProject = await Project.find().sort({_id : -1}).limit(10);
                adminDataObj["recentlyCreatedProject"] = recentlyCreatedProject;
        
                let projectCrossedDeadLine = await Project.find({});
                for(let i=0; i<projectCrossedDeadLine.length; i++){
                    let getProject = projectCrossedDeadLine[i];
                    let getEndDate = projectCrossedDeadLine[i].endDate;
                    let getenddate = getEndDate.getDate();
                    if(getdate > getenddate){
                        adminDataObj["projectCrossedDeadLine"] = getProject;
                    }
                }
                
                let projectOnGoing = await Project.find({$or : [{"status" : "pending"},{ $or : [{"status" : "created"}, {"status" : "progress"}]}]});
                adminDataObj["projectOnGoing"] = projectOnGoing;
        
                let projectCompleted = await Project.find({"status" : "complete"});
                adminDataObj["projectCompleted"] = projectCompleted;
        
                let projectReject = await Project.find({"status" : "rejected"});
                adminDataObj["projectReject"] = projectReject;
        
                let recentActivities = await Logs.find({}).sort({_id : -1}).limit(10);
                adminDataObj["recentActivities"] = recentActivities;
                resolve(adminDataObj);  
            } catch (error) {
                console.log("error -- > ", error);
                reject(error);
            }
            
        })
};

async function getQAManagerDashBoard(userID, userName){
    return new Promise( async (resolve,reject) => {
        try {
            let qaManagerDataObj = {};

            let projectData = await Project.find({$and : [{"condition" : "Active"}, {"handledBy.$._id" : userID}]});
    
            let projectCreatedByQAManager = await Project.find({$and : [{"condition" : "Active"}, {"createdBy" : userName}]});
            qaManagerDataObj["projectCreatedByQAManager"] = projectCreatedByQAManager;
    
            let projectQAMangerIsLead = await Project.find({$and : [{"condition" : "Active"}, {"handledBy.$._id" : userID}]});
            console.log("projectQAMangerIsLead --- > ", projectQAMangerIsLead);
            qaManagerDataObj["projectQAMangerIsLead"] = projectQAMangerIsLead;
    
            let projectCrossedDeadLine = await Project.find({});
            qaManagerDataObj["projectQAMangerIsLead"] = projectCrossedDeadLine;
    
            let projectOnGoing = await Project.find({$or : [{"status" : "pending", $or : [{"status" : "created"}, {"status" : "progress"}]}]});
            qaManagerDataObj["projectOnGoing"] = projectOnGoing;
    
            let projectCompleted = await Project.find({"status" : "complete"});
            qaManagerDataObj["projectCompleted"] = projectCompleted;
    
            let projectReject = await Project.find({"status" : "rejected"});
            qaManagerDataObj["projectReject"] = projectReject;
    
            let memberActivities;
            let tescaseAddedOrUpdatedToday;
            let runlogAddedOrUpdatedTodat;
            for(let i=0; i<projectData.length; i++){
                let projectMembersData = projectData[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
    
                    memberActivities = await Logs.find({"UserID" : membersId});
                    qaManagerDataObj["memberActivities"] = memberActivities;
    
                    tescaseAddedOrUpdatedToday = await TestCases({ $or : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId});
                    qaManagerDataObj["tescaseAddedOrUpdatedToday"] = tescaseAddedOrUpdatedToday;
    
                    runlogAddedOrUpdatedTodat = await RunLog({ $or : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId})
                    qaManagerDataObj["runlogAddedOrUpdatedTodat"] = runlogAddedOrUpdatedTodat;
                }
            }
            resolve(qaManagerDataObj)
        } catch (error) {
            console.log("error --- > ", error);
            reject(error)
        }
    });
};

async function getQALeadDashBoard (userID, userName){
    return new Promise( async (resolve,reject) => {
        try {
            let qaLeadDataObj = {};
                    let project;
                    let projectQALeadPartOf = await Project.find();
                    for(let i=0; i<projectQALeadPartOf.length; i++){
                        let projectMembers = projectQALeadPartOf[i].members;
                        project = projectQALeadPartOf[i];
                        for(let j=0; j<projectMembers.length; j++){
                            let memberId = projectMembers[j]._id;
                            if(memberId == userID){
                                qaLeadDataObj["totalProject"] = project;
                            }
                        }
                    };
                    
                    let testCaseCreatedAndModified = await TestCases.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    qaLeadDataObj["testCaseCreatedAndModified"] = testCaseCreatedAndModified;
            
                    let runLogCreatedOrModified = await RunLog.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    qaLeadDataObj["runLogCreatedOrModified"] = runLogCreatedOrModified;
            
                    let tescaseToBeDone;
                    let runlogToBeDone;
                    for(let i=0; i<project.length; i++){
                        let projectMembersData = project[i].members;
                        for(let j=0; j<projectMembersData.length; j++){
                            let membersId = projectMembersData[j]._id;
            
                            tescaseToBeDone = await TestCases({"_id" : membersId});
                            qaLeadDataObj["tescaseToBeDone"] = tescaseToBeDone;
            
                            runlogToBeDone = await RunLog({"_id" : membersId})
                            qaLeadDataObj["runlogToBeDone"] = runlogToBeDone;
                        }
                    }
                    resolve(qaLeadDataObj)
        } catch (error) {
            console.log("error --- > ", error);
            reject(error)
        }
    })
};

async function getTesterDashBoard (userID, userName){
    return new Promise( async (resolve,reject) => {
        try {
            let testerDataObj = {};
            let tescaseToBeDone;
            let runlogToBeDone;
            let project;
            let projectTesterPartOf = await Project.find();
    
            for(let i=0; i<projectTesterPartOf.length; i++){
                let projectMembers = projectTesterPartOf[i].members;
                project = projectTesterPartOf[i];
                for(let j=0; j<projectMembers.length; j++){
                    let memberId = projectMembers[j]._id;
                    if(memberId == userID){
                        testerDataObj["totalProject"] = project;
                    }
                }
            };
    
            for(let i=0; i<project.length; i++){
                let projectMembersData = project[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
    
                    tescaseToBeDone = await TestCases({"_id" : membersId});
                    testerDataObj["tescaseToBeDone"] = tescaseToBeDone;
    
                    runlogToBeDone = await RunLog({"_id" : membersId})
                    testerDataObj["runlogToBeDone"] = runlogToBeDone;
                }
            }
    
            resolve(testerDataObj); 
        } catch (error) {
            console.log("error --- > ", error);
            reject(error);
        }
    })
};

async function getDashBoardData (req,res){
    let userName = req.user.payload.user.fName;
    let userID = req.user.payload.userId;
    let userRole = req.user.payload.user.role;
   
    try {
        let index = userRole.lastIndexOf(" ")
        let role = userRole.slice(0,index);
        switch (role) {
            case "Admin":
                    getAdminDashBoard(userID,userName)
                    .then( (adminDataObj) => {
                        res.status(200).json(adminDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err)
                    });  
                break;
            case "QA Manager":
                    getQAManagerDashBoard(userID,userName)
                    .then( (qaManagerDataObj) => {
                        res.status(200).json(qaManagerDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err);
                    }); 
                break;
            case "QA Lead":
                    getQALeadDashBoard(userID,userName)
                    .then( (qaLeadDataObj) => {
                        res.status(200).json(qaLeadDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err);
                    }); 
                break;
            case "Tester":
                    getTesterDashBoard(userID,userName)
                    .then( testerDataObj =>{ 
                        res.status(200).json(testerDataObj)
                    }).catch( (err) => {  
                        console.log(err);
                        res.status(400).json(err);
                    }); 
                break;         
            default:
                    res.status(200).json({message : "The required Dashboard is not present for the given role!"});
                break;
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "Something went wrong! Please contact admin."})
    }
}

module.exports = {
    getDashBoardData : getDashBoardData
}