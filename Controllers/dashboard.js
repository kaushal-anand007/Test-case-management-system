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
                
                let projectCrossedDeadLine = [];
                let projectCrossedDeadLineData = await Project.find({});
                for(let i=0; i<projectCrossedDeadLineData.length; i++){
                    let getProject = projectCrossedDeadLineData[i];
                    let getEndDate = projectCrossedDeadLineData[i].endDate;
                    let getenddate = getEndDate.getDate();
                    if(getdate > getenddate){
                        projectCrossedDeadLine.push(getProject)
                    }
                }

                adminDataObj["projectCrossedDeadLine"] = projectCrossedDeadLine;
                
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

            let projectData = await Project.find({$and : [ {"condition" : "Active"}, {$or : [{"handledBy._id" : userID}, {"createdBy" : userName}]} ]});
           // console.log("projectData --- > ", projectData);
            
            let projectCreatedByQAManager = await Project.find({$and : [{"condition" : "Active"}, {"createdBy" : userName}]});
            qaManagerDataObj["projectCreatedByQAManager"] = projectCreatedByQAManager;
    
            let projectQAMangerIsLead = await Project.find({$and : [{"condition" : "Active"}, {"handledBy._id" : userID}]});
            qaManagerDataObj["projectQAMangerIsLead"] = projectQAMangerIsLead;
            
            let projectCrossedDeadLine = [];
            let projectOnGoing = [];
            let projectCompleted = [];
            let projectReject = []
            for(let k=0; k<projectData.length; k++){
                let endDate = projectData[k].endDate;
                if(date > endDate){
                    projectCrossedDeadLine.push(projectData[k]);                                        
                }

                let status = projectData[k].status;
                if(status == "pending" || status == "created" || status == "progress"){
                    projectOnGoing.push(projectData[k]);
                }
                
                if(status == "complete"){
                    projectCompleted.push(projectData[k]);
                }

                if(status == "rejected"){
                    projectReject.push(projectData[k]);
                }
            };

            qaManagerDataObj["projectCrossedDeadLine"] = projectCrossedDeadLine;
            qaManagerDataObj["projectOnGoing"] = projectOnGoing;
            qaManagerDataObj["projectCompleted"] = projectCompleted;
            qaManagerDataObj["projectReject"] = projectReject;

    
            let memberActivitie = [];
            let tescaseAddedOrUpdatedToday = [];
            let runlogAddedOrUpdatedToday = [];
            for(let i=0; i<projectData.length; i++){
                let projectMembersData = projectData[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
                   // console.log("membersId --- > ", membersId);
    
                    let memberActivities = await Logs.find({"UserID" : membersId});
                    for(let l=0; l<memberActivities.length; l++){
                        memberActivitie.push(memberActivities[l]);
                    }
    
                    let tescaseData = await TestCases({$and : [{$and : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId}]});
                    for(let m=0; m<tescaseData.length; m++){
                        tescaseAddedOrUpdatedToday.push(tescaseData[m]);
                    }
                    
    
                    let runlogData = await RunLog({$and : [{$and : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId}]})
                    for(let n=0; n<runlogData.length; n++){
                        tescaseAddedOrUpdatedToday.push(runlogData[n]);
                    }
                }
            }

            qaManagerDataObj["memberActivitie"] = memberActivitie;
            qaManagerDataObj["tescaseAddedOrUpdatedToday"] = tescaseAddedOrUpdatedToday;
            qaManagerDataObj["runlogAddedOrUpdatedToday"] = runlogAddedOrUpdatedToday;

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
                    let totalProject = [];
                    let projectQALeadPartOf = await Project.find();
                    for(let i=0; i<projectQALeadPartOf.length; i++){
                        let projectMembers = projectQALeadPartOf[i].members;
                        project = projectQALeadPartOf[i];
                        for(let j=0; j<projectMembers.length; j++){
                            let memberId = projectMembers[j]._id;
                            if(memberId == userID){
                                totalProject.push(project);
                            }
                        }
                    };
                    
                    qaLeadDataObj["totalProject"] = totalProject;
                    
                    let testCaseCreatedAndModified = [];
                    let testCaseData = await TestCases.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let k=0; k<testCaseData.length; k++){
                        testCaseCreatedAndModified.push(testCaseData[k])
                    }

                    qaLeadDataObj["testCaseCreatedAndModified"] = testCaseCreatedAndModified;
            
                    let runLogCreatedAndModified = [];
                    let runLogData = await RunLog.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let l=0; l<runLogData.length; l++){
                        runLogCreatedAndModified.push(runLogData[l])
                    }

                    qaLeadDataObj["runLogCreatedAndModified"] = runLogCreatedAndModified;
            
                    let tescaseToBeDone = [];
                    let runlogToBeDone = [];
                    for(let i=0; i<project.length; i++){
                        let projectMembersData = project[i].members;
                        for(let j=0; j<projectMembersData.length; j++){
                            let membersId = projectMembersData[j]._id;
            
                            let tescaseData = await TestCases({"_id" : membersId});
                            for(let m=0; m<tescaseData.length; m++){
                                tescaseToBeDone.push(tescaseData[m]);
                            };
                            
            
                            let runlogData = await RunLog({"_id" : membersId});
                            for(let n=0; n<runlogData.length; n++){
                                runlogToBeDone.push(runlogData[n]);
                            };  
                        }
                    }

                    qaLeadDataObj["tescaseToBeDone"] = tescaseToBeDone;
                    qaLeadDataObj["runlogToBeDone"] = runlogToBeDone;

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
            let project;
            let projectTesterPartOf = await Project.find();
            
            let totalProject = [];
            for(let i=0; i<projectTesterPartOf.length; i++){
                let projectMembers = projectTesterPartOf[i].members;
                project = projectTesterPartOf[i];
                for(let j=0; j<projectMembers.length; j++){
                    let memberId = projectMembers[j]._id;
                    if(memberId == userID){
                        totalProject.push(project);
                    }
                }
            };

            testerDataObj["totalProject"] = totalProject;
            
            let tescaseToBeDone = [];
            let runlogToBeDone = [];
            for(let i=0; i<project.length; i++){
                let projectMembersData = project[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
    
                    let tescaseData = await TestCases({"_id" : membersId});
                    for(let k=0; k<tescaseData.length; k++){
                        tescaseToBeDone.push(tescaseData[k]);
                    }
                    
                    let runlogData = await RunLog({"_id" : membersId});
                    for(let l=0; l<runlogData.length; l++){
                        runlogToBeDone.push(runlogData[l]);
                    }
                }
            }

            testerDataObj["tescaseToBeDone"] = tescaseToBeDone;
            testerDataObj["runlogToBeDone"] = runlogToBeDone;
    
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