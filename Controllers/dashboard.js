const Users = require('../Models/user');
const Project = require('../Models/project');
const RunLog = require('../Models/runlog');
const TestCases = require('../Models/testcase');
const Scenario = require('../Models/scenario');
const Logs = require('../Models/log');
const Counters = require('../Models/counter');
const date = new Date();
const todayDate = date.toLocaleDateString(); 

async function getAdminDashBoard(userID, userName, requiredRoute){
        return new Promise(async (resolve,reject) => {
            try {
                let getdate = date.getDate();
                console.log("getdate --- > ", getdate);
                let adminDataObj = {};
        
                let totalProject = await Project.find({"condition" : "Active"});
                // adminDataObj["totalProjectForAdmin"] = totalProject;
        
                let recentlyCreatedProject = await Project.find().sort({_id : -1}).limit(10);
                // adminDataObj["recentlyCreatedProjectForAdmin"] = recentlyCreatedProject;
                
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

                // adminDataObj["projectCrossedDeadLineForAdmin"] = projectCrossedDeadLine;
                
                let projectOnGoing = await Project.find({$or : [{"status" : "pending"},{ $or : [{"status" : "created"}, {"status" : "progress"}]}]});
                // adminDataObj["projectOnGoingForAdmin"] = projectOnGoing;
        
                let projectCompleted = await Project.find({"status" : "complete"});
                // adminDataObj["projectCompletedForAdmin"] = projectCompleted;
        
                let projectReject = await Project.find({"status" : "rejected"});
                // adminDataObj["projectRejectForAdmin"] = projectReject;
        
                let recentActivities = await Logs.find({}).sort({_id : -1}).limit(10);
                // adminDataObj["recentActivitiesForAdmin"] = recentActivities;

                switch (requiredRoute) {
                    case "totalProjectForAdmin":
                        adminDataObj["totalProjectForAdmin"] = totalProject;
                        break;
                    case "recentlyCreatedProjectForAdmin":
                        adminDataObj["recentlyCreatedProjectForAdmin"] = recentlyCreatedProject;
                        break;
                    case "projectCrossedDeadLineForAdmin":
                        adminDataObj["projectCrossedDeadLineForAdmin"] = projectCrossedDeadLine;
                        break;  
                    case "projectOnGoingForAdmin":
                        adminDataObj["projectOnGoingForAdmin"] = projectOnGoing;
                        break;
                    case "projectCompletedForAdmin":
                        adminDataObj["projectCompletedForAdmin"] = projectCompleted;
                        break;
                    case "projectRejectForAdmin":
                        adminDataObj["projectRejectForAdmin"] = projectReject;
                        break;
                    case "recentActivitiesForAdmin":
                        adminDataObj["recentActivitiesForAdmin"] = recentActivities;
                        break;                           
                    default:
                        adminDataObj["error"] = "Router your are requesting for is not present!"
                        break;
                }

                resolve(adminDataObj);  
            } catch (error) {
                console.log("error -- > ", error);
                reject(error);
            }
            
        })
};

async function getQAManagerDashBoard(userID, userName, requiredRoute){
    return new Promise( async (resolve,reject) => {
        try {
            let qaManagerDataObj = {};

            let projectData = await Project.find({$and : [ {"condition" : "Active"}, {$or : [{"handledBy._id" : userID}, {"createdBy" : userName}]} ]});
           // console.log("projectData --- > ", projectData);
            
            let projectCreatedByQAManager = await Project.find({$and : [{"condition" : "Active"}, {"createdBy" : userName}]});
            // qaManagerDataObj["projectCreatedByQAManagerForQAManager"] = projectCreatedByQAManager;
    
            let projectQAMangerIsLead = await Project.find({$and : [{"condition" : "Active"}, {"handledBy._id" : userID}]});
            // qaManagerDataObj["projectQAMangerIsLeadForQAManager"] = projectQAMangerIsLead;
            
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

            // qaManagerDataObj["projectCrossedDeadLineForQAManager"] = projectCrossedDeadLine;
            // qaManagerDataObj["projectOnGoingForQAManager"] = projectOnGoing;
            // qaManagerDataObj["projectCompletedForQAManager"] = projectCompleted;
            // qaManagerDataObj["projectRejectForQAManager"] = projectReject;

    
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

            // qaManagerDataObj["memberActivitieForQAManager"] = memberActivitie;
            // qaManagerDataObj["tescaseAddedOrUpdatedTodayForQAManager"] = tescaseAddedOrUpdatedToday;
            // qaManagerDataObj["runlogAddedOrUpdatedTodayForQAManager"] = runlogAddedOrUpdatedToday;

            switch (requiredRoute) {
                case "projectCreatedByQAManagerForQAManager":
                    qaManagerDataObj["projectCreatedByQAManagerForQAManager"] = projectCreatedByQAManager;
                    break;
                case "projectQAMangerIsLeadForQAManager":
                    qaManagerDataObj["projectQAMangerIsLeadForQAManager"] = projectQAMangerIsLead;
                    break;
                case "projectCrossedDeadLineForQAManager":
                    qaManagerDataObj["projectCrossedDeadLineForQAManager"] = projectCrossedDeadLine;
                    break;  
                case "projectOnGoingForQAManager":
                    qaManagerDataObj["projectOnGoingForQAManager"] = projectOnGoing;
                    break;
                case "projectCompletedForQAManager":
                    qaManagerDataObj["projectCompletedForQAManager"] = projectCompleted;
                    break;
                case "projectRejectForQAManager":
                    qaManagerDataObj["projectRejectForQAManager"] = projectReject;
                    break;
                case "memberActivitieForQAManager":
                    qaManagerDataObj["memberActivitieForQAManager"] = memberActivitie;
                    break;
                case "tescaseAddedOrUpdatedTodayForQAManager":
                    qaManagerDataObj["tescaseAddedOrUpdatedTodayForQAManager"] = tescaseAddedOrUpdatedToday;
                    break;  
                case "runlogAddedOrUpdatedTodayForQAManager":
                    qaManagerDataObj["runlogAddedOrUpdatedTodayForQAManager"] = runlogAddedOrUpdatedToday;
                    break;                                       
                default:
                    qaManagerDataObj["error"] = "Router your are requesting for is not present!"
                    break;
            }

            resolve(qaManagerDataObj)
        } catch (error) {
            console.log("error --- > ", error);
            reject(error)
        }
    });
};

async function getQALeadDashBoard (userID, userName, requiredRoute){
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
                    
                    // qaLeadDataObj["totalProjectForQALead"] = totalProject;
                    
                    let testCaseCreatedAndModified = [];
                    let testCaseData = await TestCases.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let k=0; k<testCaseData.length; k++){
                        testCaseCreatedAndModified.push(testCaseData[k])
                    }

                    // qaLeadDataObj["testCaseCreatedAndModifiedForQALead"] = testCaseCreatedAndModified;
            
                    let runLogCreatedAndModified = [];
                    let runLogData = await RunLog.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let l=0; l<runLogData.length; l++){
                        runLogCreatedAndModified.push(runLogData[l])
                    }

                    // qaLeadDataObj["runLogCreatedAndModifiedForQALead"] = runLogCreatedAndModified;
            
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

                    // qaLeadDataObj["tescaseToBeDoneForQALead"] = tescaseToBeDone;
                    // qaLeadDataObj["runlogToBeDoneForQALead"] = runlogToBeDone;

                    switch (requiredRoute) {
                        case "totalProjectForQALead":
                            qaLeadDataObj["totalProjectForQALead"] = totalProject;
                            break;
                        case "testCaseCreatedAndModifiedForQALead":
                            qaLeadDataObj["testCaseCreatedAndModifiedForQALead"] = testCaseCreatedAndModified;
                            break;
                        case "runLogCreatedAndModifiedForQALead":
                            qaLeadDataObj["runLogCreatedAndModifiedForQALead"] = runLogCreatedAndModified;
                            break;  
                        case "tescaseToBeDoneForQALead":
                            qaLeadDataObj["tescaseToBeDoneForQALead"] = tescaseToBeDone;
                            break;
                        case "runlogToBeDoneForQALead":
                            qaLeadDataObj["runlogToBeDoneForQALead"] = runlogToBeDone;
                            break;                    
                        default:
                            qaLeadDataObj["error"] = "Router your are requesting for is not present!"
                            break;
                    }

                    resolve(qaLeadDataObj)
        } catch (error) {
            console.log("error --- > ", error);
            reject(error)
        }
    })
};

async function getTesterDashBoard (userID, userName, requiredRoute){
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

            // testerDataObj["totalProjectForTester"] = totalProject;
            
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

            // testerDataObj["tescaseToBeDoneForTester"] = tescaseToBeDone;
            // testerDataObj["runlogToBeDoneForTester"] = runlogToBeDone;

            switch (requiredRoute) {
                case "totalProjectForTester":
                    testerDataObj["totalProjectForTester"] = totalProject;
                    break;
                case "recentlyCreatedProjectForAdmin":
                    testerDataObj["recentlyCreatedProjectForAdmin"] = tescaseToBeDone;
                    break;
                case "runlogToBeDoneForTester":
                    testerDataObj["runlogToBeDoneForTester"] = runlogToBeDone;
                    break;                         
                default:
                    testerDataObj["error"] = "Router your are requesting for is not present!"
                    break;
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

    let route = req.originalUrl;
    route =route.slice(1);  
    let index = route.indexOf('/');
    let lastIndex = route.lastIndexOf('/');
    let requiredRoute = route.slice(index+1,lastIndex);
    console.log("test ---- > ", requiredRoute);
   
    try {
        let index = userRole.lastIndexOf(" ")
        let role = userRole.slice(0,index);
        switch (role) {
            case "Admin":
                    getAdminDashBoard(userID,userName, requiredRoute)
                    .then( (adminDataObj) => {
                        res.status(200).json(adminDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err)
                    });  
                break;
            case "QA Manager":
                    getQAManagerDashBoard(userID,userName, requiredRoute)
                    .then( (qaManagerDataObj) => {
                        res.status(200).json(qaManagerDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err);
                    }); 
                break;
            case "QA Lead":
                    getQALeadDashBoard(userID,userName, requiredRoute)
                    .then( (qaLeadDataObj) => {
                        res.status(200).json(qaLeadDataObj);
                    }).catch( (err) => {
                        console.log(err);
                        res.status(400).json(err);
                    }); 
                break;
            case "Tester":
                    getTesterDashBoard(userID,userName, requiredRoute)
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