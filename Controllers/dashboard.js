const Users = require('../Models/user');
const Project = require('../Models/project');
const RunLog = require('../Models/runlog');
const TestCases = require('../Models/testcase');
const Scenario = require('../Models/scenario');
const Logs = require('../Models/log');
const Counters = require('../Models/counter');
const moment = require('moment');
const date = new Date();
let getThisMonth = date.getMonth();
let getDay = date.getDay();
const todayDate = date.toLocaleDateString(); 

async function getAdminDashBoard(userID, userName, requiredRoute){
        return new Promise(async (resolve,reject) => {
            try {
                let adminDataObj = {};
        
                let totalProject = await Project.find({"condition" : "Active"}).sort({_id : -1});
                // adminDataObj["totalProjectForAdmin"] = totalProject;

                let modifiedProjectObj = [];
                for(let i=0; i<totalProject.length; i++){
                    let getModifiedProject = totalProject[i].modifiedOn;
                    if(getModifiedProject != null){
                        modifiedProjectObj.push(getModifiedProject);
                    }
                }

                let countMonth = 0;
                for(let j=0; j<totalProject.length; j++){
                    let getProjectCreationDate = totalProject[j].createdOn;
                    let getMonth = getProjectCreationDate.getMonth();
                    if(getMonth == getThisMonth){
                        countMonth++;
                    }
                }

                
        
                let recentlyCreatedProject = await Project.find().sort({_id : -1}).limit(10);
                // adminDataObj["recentlyCreatedProjectForAdmin"] = recentlyCreatedProject;
                
                let projectCrossedDeadLineData = await Project.find({"status" : "pending"});

                // adminDataObj["projectCrossedDeadLineForAdmin"] = projectCrossedDeadLine;
                
                let projectOnGoing = await Project.find({ $or : [{"status" : "created"}, {"status" : "progress"}]});
                // adminDataObj["projectOnGoingForAdmin"] = projectOnGoing;
        
                let projectCompleted = await Project.find({"status" : "complete"});
                // adminDataObj["projectCompletedForAdmin"] = projectCompleted;
        
                let projectReject = await Project.find({"status" : "rejected"});
                // adminDataObj["projectRejectForAdmin"] = projectReject;
        
                let recentActivities = await Logs.find({}).sort({_id : -1}).limit(10);
                // adminDataObj["recentActivitiesForAdmin"] = recentActivities;

                switch (requiredRoute) {
                    case "collectionOfDataInFormOfCountForAdmin":
                        adminDataObj["totalProjectForAdmin"] = totalProject.length;
                        adminDataObj["projectCrossedDeadLineForAdmin"] = projectCrossedDeadLineData.length;
                        adminDataObj["projectCompletedForAdmin"] = projectCompleted.length;
                        adminDataObj["projectRejectForAdmin"] = projectReject.length;
                        adminDataObj["projectCreatedInThisMonth"] = countMonth;
                        break;
                    case "recentlyCreatedProjectForAdmin":
                        adminDataObj["recentlyCreatedProjectForAdmin"] = recentlyCreatedProject;
                        break;
                    case "projectOnGoingForAdmin":
                        adminDataObj["projectOnGoingForAdmin"] = projectOnGoing;
                        break;
                    case "recentlyModifiedProject":
                        adminDataObj["recentlyModifiedProject"] = recentlyModifiedProject;
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

            let projectData = await Project.find({$or : [{"handledBy._id" : userID}, {"condition" : "Active"}]}).sort({_id : -1});
            
            let projectCreatedByQAManager = await Project.find({$and : [{"condition" : "Active"}, {"createdBy" : userName}]});
    
            let projectQAMangerIsLead = await Project.find({$and : [{"condition" : "Active"}, {"handledBy._id" : userID}]});
            
            let projectCrossedDeadLine = [];
            let projectOnGoing = [];
            let projectCompleted = [];
            let projectReject = []
            for(let k=0; k<projectData.length; k++){
                let status = projectData[k].status;

                if(status == "pending"){
                    projectCrossedDeadLine.push(projectData[k]);                                        
                }

                if(status == "created" || status == "progress"){
                    projectOnGoing.push(projectData[k]);
                }
                
                if(status == "complete"){
                    projectCompleted.push(projectData[k]);
                }

                if(status == "rejected"){
                    projectReject.push(projectData[k]);
                }
            };
            
            let countMonth = 0;
                for(let l=0; l<projectData.length; l++){
                    let getProjectCreationDate = projectData[l].createdOn;
                    let getMonth = getProjectCreationDate.getMonth();
                    if(getMonth == getThisMonth){
                        countMonth++;
                }
            }

            let recentlyAdded5ProjectData = await Project.find({$or : [{"handledBy._id" : userID}, {"condition" : "Active"}]}).sort({_id : -1}).limit(5);

            let modifiedProjectObj = [];
                for(let m=0; m<projectData.length; m++){
                    let getModifiedProject = projectData[m].modifiedOn;
                    if(getModifiedProject != null){
                        modifiedProjectObj.push(getModifiedProject);
                }
            }

            let recentlyModified5Project = modifiedProjectObj.splice(5);
            
            let memberActivitie = [];
            let tescaseAddedOrUpdatedToday = [];
            let runlogAddedOrUpdatedToday = [];
            let totalTestCaseUnderHim;
            let testCaseLowPriority = 0;
            let testCaseMediumPriority = 0;
            let testCaseHighPriority = 0;
            let totalTestCaseAddedLastWeek = [];
            let totalRunLogAddedLastWeek = [];
            let recent10TestCases;
            let runLogCount = 0;
            let runlogCompletedCount = 0;
            let runlogRemainingCount = 0;
            let recent10RunLogs;
            let testCasesForWeekOnDailyBasis = [];
            let runLogForWeekOnDailyBasis = [];

            for(let i=0; i<projectData.length; i++){
                let projectMembersData = projectData[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
                    
                    totalTestCaseUnderHim = await TestCases.find({"_id" : membersId});

                    recent10TestCases = await TestCases.find({"_id" : membersId}).sort({_id : -1}).limit(10);

                    let mondayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (7 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"mondayTestCaseCount" : mondayTestCaseCount.length});
                    let tuesdayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (6 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"tuesdayTestCaseCount" : tuesdayTestCaseCount.length});
                    let wednesdayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (5 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"wednesdayTestCaseCount" : wednesdayTestCaseCount.length});
                    let thusdayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (4 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"thusdayTestCaseCount" : thusdayTestCaseCount.length});
                    let fridayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (3 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"fridayTestCaseCount" : fridayTestCaseCount.length});
                    let saturdayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (2 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"saturdayTestCaseCount" : saturdayTestCaseCount.length});
                    let sundayTestCaseCount = await TestCases.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (1 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    testCasesForWeekOnDailyBasis.push({"sundayTestCaseCount" : sundayTestCaseCount.length});

                    let mondayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (7 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"mondayRunLogCount" : mondayRunLogCount.length});
                    let tuesdayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (6 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"tuesdayRunLogCount" : tuesdayRunLogCount.length});
                    let wednesdayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (5 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"wednesdayRunLogCount" : wednesdayRunLogCount.length});
                    let thusdayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (4 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"thusdayRunLogCount" : thusdayRunLogCount.length});
                    let fridayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (3 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"fridayRunLogCount" : fridayRunLogCount.length});
                    let saturdayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (2 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"saturdayRunLogCount" : saturdayRunLogCount.length});
                    let sundayRunLogCount = await RunLog.find({$and : [{"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$eq : new Date(new Date - (1 * 60 * 60 * 24 * 1000)- (getDay * 60 * 60 * 24 * 1000))}}]});
                    runLogForWeekOnDailyBasis.push({"sundayRunLogCount" : sundayRunLogCount.length});

                    let testCaseLastWeekResult = await TestCases.find({"_id" : membersId}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                    for(let q=0; q<testCaseLastWeekResult.length; q++){
                        totalTestCaseAddedLastWeek.push(testCaseLastWeekResult[q]);
                    };

                    let runLogLastWeekResult = await RunLog.find({"_id" : membersId}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                    for(let s=0; s<runLogLastWeekResult.length; s++){
                        totalRunLogAddedLastWeek.push(runLogLastWeekResult[s]);
                    };



                    for(let n=0; n<totalTestCaseUnderHim.length; n++){
                        let getPriority = totalTestCaseUnderHim[n].priority;

                        if(getPriority == "low"){
                            testCaseLowPriority++;
                        }

                        if(getPriority == "medium"){
                            testCaseMediumPriority++;
                        }

                        if(getPriority == "high"){
                            testCaseHighPriority++;
                        }
                    }

                    let totalRunLog = await RunLog.find({"_id" : membersId, "condition" : "Active"});

                    for(let r=0; r<totalRunLog.length; r++){
                        let runlogStatus = totalRunLog[r].status;
                        runLogCount++;

                        if(runlogStatus == "completed"){
                            runlogCompletedCount++;
                        }

                        if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                            runlogRemainingCount++;
                        }
                    }

                    recent10RunLogs = RunLog.find({"_id" : membersId, "condition" : "Active"}).sort({_id : -1}).limit(10);
    
                    let memberActivities = await Logs.find({"UserID" : membersId});
                    for(let l=0; l<memberActivities.length; l++){
                        memberActivitie.push(memberActivities[l]);
                    }
    
                    let tescaseData = await TestCases({$and : [{$or : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId}]});
                    for(let m=0; m<tescaseData.length; m++){
                        tescaseAddedOrUpdatedToday.push(tescaseData[m]);
                    }
                    
    
                    let runlogData = await RunLog({$and : [{$or : [{"createdOn" : date}, {"modifiedOn" : date}]}, {"_id" : membersId}]})
                    for(let n=0; n<runlogData.length; n++){
                        tescaseAddedOrUpdatedToday.push(runlogData[n]);
                    }
                }
            }

            switch (requiredRoute) {
                case "collectionOfDataInFormOfCountForQAManager":
                    qaManagerDataObj["projectCreatedByQAManager"] = projectCreatedByQAManager.length;
                    qaManagerDataObj["projectCompletedForQAManager"] = projectCompleted.length;
                    qaManagerDataObj["projectRejectForQAManager"] = projectReject.length;
                    qaManagerDataObj["projectOnGoingForQAManager"] = projectOnGoing.length;
                    qaManagerDataObj["projectCrossedDeadLineForQAManager"] = projectCrossedDeadLine.length;
                    qaManagerDataObj["projectCreatedInThisMonth"] = countMonth;
                    qaManagerDataObj["totalTestCaseUnderHim"] = totalTestCaseUnderHim.length;
                    qaManagerDataObj["testCaseLowPriority"] = testCaseLowPriority;
                    qaManagerDataObj["testCaseMediumPriority"] = testCaseMediumPriority;
                    qaManagerDataObj["testCaseHighPriority"] = testCaseHighPriority;
                    qaManagerDataObj["totalTestCaseAddedLastWeek"] = totalTestCaseAddedLastWeek.length;
                    qaManagerDataObj["totalRunLogCount"] = runLogCount;
                    qaManagerDataObj["totalRunLogCompleted"] = runlogCompletedCount;
                    qaManagerDataObj["totalRunLogRemaining"] = runlogRemainingCount;
                    qaManagerDataObj["totalRunLogAddedLastWeek"] = totalRunLogAddedLastWeek;
                    qaManagerDataObj["testCasesForWeekOnDailyBasis"] = testCasesForWeekOnDailyBasis;
                    qaManagerDataObj["runLogForWeekOnDailyBasis"] = runLogForWeekOnDailyBasis;
                    break;
                case "projectQAMangerIsLeadForQAManager":
                    qaManagerDataObj["projectQAMangerIsLeadForQAManager"] = projectQAMangerIsLead;
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
                case "recentlyAdded5ProjectData":
                    qaManagerDataObj["recentlyAdded5ProjectData"] = recentlyAdded5ProjectData;
                    break;
                case "recentlyModified5Project":
                    qaManagerDataObj["recentlyModified5Project"] = recentlyModified5Project;
                    break;
                case "recent10TestCases":
                    qaManagerDataObj["recent10TestCases"] = recent10TestCases;
                    break;
                case "recent10RunLogs":
                    qaManagerDataObj["recent10RunLogs"] = recent10RunLogs;
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
            
                    let project ;
                    let totalProject = [];
                    let totalProjectCompleted = 0;
                    let totalProjectReject = 0;
                    let totalProjectPending = 0;
                    let totalProjectOnGoing = 0;
                    let recentlyAddedProjectInMonth = 0;
                    let recentlyAdded5Project;
                    let totalTestCase = 0;
                    let totalLowPriorityTestCase = 0;
                    let totalMediumPriorityTestCase = 0;
                    let totalHighPriorityTestCase = 0;
                    let totalTestCasesAddedInLastWeek = [];
                    let totalRunLogCasesAddedInLastWeek = [];
                    let recentlyAdded10TestCases = [];
                    let totalRunLog = 0;
                    let totalRunLogCompleted = 0;
                    let totalRunLogRemaining = [];
                    let recentlyAdded10RunLog = [];

                    let projectQALeadPartOf = await Project.find({"condition" : "Active"}).sort({_id : -1});
                    for(let i=0; i<projectQALeadPartOf.length; i++){
                        let projectMembers = projectQALeadPartOf[i].members;
                        let projectStatus = projectQALeadPartOf[i].status
                        project = projectQALeadPartOf[i];
                        for(let j=0; j<projectMembers.length; j++){
                            let memberId = projectMembers[j]._id;

                            if(memberId == userID){

                                totalProject.push(project);

                                if(projectStatus == "complete"){
                                    totalProjectCompleted++;
                                }

                                if(projectStatus == "rejected"){
                                    totalProjectReject++;
                                }

                                if(projectStatus == "pending"){
                                    totalProjectPending++;
                                }

                                if(projectStatus == "created" || projectStatus == "progress"){
                                    totalProjectOnGoing++;
                                }
                                    
                            }
                        }
                    };

                    for(let l=0; l<totalProject.length; l++){
                        let getProjectCreationDate = totalProject[l].createdOn;
                        let getMonth = getProjectCreationDate.getMonth();
                            if(getMonth == getThisMonth){
                                recentlyAddedProjectInMonth++;
                        }
                    };

                    for(let m=0; m<5; m++){
                        recentlyAdded5Project.push(totalProject[m]);
                    }

                    let testCaseCreatedAndModified = [];
                    let testCaseData = await TestCases.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let k=0; k<testCaseData.length; k++){
                        testCaseCreatedAndModified.push(testCaseData[k])
                    }
            
                    let runLogCreatedAndModified = [];
                    let runLogData = await RunLog.find({$or : [{"createdBy" : userName}, {"modifiedBy" : userName}]});
                    for(let l=0; l<runLogData.length; l++){
                        runLogCreatedAndModified.push(runLogData[l])
                    };
            
                    let tescase = [];
                    let runlog = [];
                    for(let i=0; i<totalProject.length; i++){
                        let projectMembersData = totalProject[i].members;
                        for(let j=0; j<projectMembersData.length; j++){
                            let membersId = projectMembersData[j]._id;
            
                            let tescaseData = await TestCases({"_id" : membersId}).sort({_id : -1});
                            for(let m=0; m<tescaseData.length; m++){
                                totalTestCase++;
                                tescase.push(tescaseData[m]);
                            };


                            for(let n=0; n<tescaseData.length; n++){
                                let getPriority = tescaseData[n].priority;

                                if(getPriority == "low"){
                                    totalLowPriorityTestCase++;
                                }

                                if(getPriority == "medium"){
                                    totalMediumPriorityTestCase++;
                                }

                                if(getPriority == "high"){
                                    totalHighPriorityTestCase++;
                                }
                            }

                            let testCaseLastWeekResult = await TestCases.find({"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                            for(let q=0; q<testCaseLastWeekResult.length; q++){
                                totalTestCasesAddedInLastWeek.push(testCaseLastWeekResult[q]);
                            };

                            let runlogData = await RunLog({"_id" : membersId}).sort({_id : -1});
                            for(let o=0; o<runlogData.length; 0++){
                                totalRunLog++;
                                let runlogStatus = runlogData[o].status;

                                runlog.push(runlogData[o]);

                                if(runlogStatus == "completed"){
                                    totalRunLogCompleted++;
                                }

                                if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                                    totalRunLogRemaining++;
                                }

                                runlogToBeDone.push(runlogData[o]);
                            }; 
                            
                            let runLogLastWeekResult = await RunLog.find({"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                            for(let t=0; t<runLogLastWeekResult.length; t++){
                                totalRunLogCasesAddedInLastWeek.push(runLogLastWeekResult[t]);
                            };
                        }
                    }

                    for(let s=0; s<10; s++){
                        recentlyAdded10TestCases = recentlyAdded10TestCases.push(tescase[s]);
                    }

                    for(let r=0; r<10; r++){
                        recentlyAdded10RunLog = recentlyAdded10RunLog.push(runlog[r]);
                    }

                    switch (requiredRoute) {
                        case "collectionOfDataInFormOfCountForQALead":
                            qaLeadDataObj["totalProjectForQALead"] = totalProject.length;
                            qaLeadDataObj["totalProjectCompleted"] = totalProjectCompleted;
                            qaLeadDataObj["totalProjectReject"] = totalProjectReject;
                            qaLeadDataObj["totalProjectPending"] = totalProjectPending;
                            qaLeadDataObj["totalProjectOnGoing"] = totalProjectOnGoing;
                            qaLeadDataObj["totalProjectCreatedInMonth"] = recentlyAddedProjectInMonth;
                            qaLeadDataObj["totalTestCase"] = totalTestCase;
                            qaLeadDataObj["testCaseLowPriority"] = totalLowPriorityTestCase;
                            qaLeadDataObj["testCaseMediumPriority"] = totalMediumPriorityTestCase;
                            qaLeadDataObj["testCaseHighPriority"] = totalHighPriorityTestCase;
                            qaLeadDataObj["totalTestCasesAddedInLastWeek"] = totalTestCasesAddedInLastWeek.length;
                            qaLeadDataObj["totalRunLog"] = totalRunLog;
                            qaLeadDataObj["totalRunLogCompleted"] = totalRunLogCompleted;
                            qaLeadDataObj["totalRunLogRemaining"] = totalRunLogRemaining;
                            qaLeadDataObj["totalRunLogCasesAddedInLastWeek"] = totalRunLogCasesAddedInLastWeek.length;
                            break;
                        case "recentlyAdded5Project":
                            qaLeadDataObj["recentlyAdded5Project"] = recentlyAdded5Project;;
                            break;
                        case "recentlyAdded10TestCases":
                            qaLeadDataObj["recentlyAdded10TestCases"] = recentlyAdded10TestCases;
                            break;  
                        case "recentlyAdded10RunLog":
                            qaLeadDataObj["recentlyAdded10RunLog"] = recentlyAdded10RunLog;
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
            let totalProjectCompleted = 0;
            let totalProjectReject = 0;
            let totalProjectPending = 0;
            let totalProjectOnGoing = 0;
            let recentlyAddedProjectInMonth = 0;
            let recentlyAdded5Project = [];
            let totalLowPriorityTestCase = 0;
            let totalMediumPriorityTestCase = 0;
            let totalHighPriorityTestCase = 0;
            let totalTestCasesAddedInLastWeek = [];
            let recentlyAdded10TestCases = [];
            let totalRunLogCompleted = 0;
            let totalRunLogRemaining = 0;
            let totalRunLogCasesAddedInLastWeek = [];
            let recentlyAdded10RunLog = [];

            let projectTesterPartOf = await Project.find({"condition" : "Active"});
            
            let totalProject = [];
            for(let i=0; i<projectTesterPartOf.length; i++){
                let projectMembers = projectTesterPartOf[i].members;
                project = projectTesterPartOf[i];
                for(let j=0; j<projectMembers.length; j++){
                    let memberId = projectMembers[j]._id;
                    let projectStatus = projectMembers[j].status;
                    if(memberId == userID){
                        totalProject.push(project);

                        if(projectStatus == "complete"){
                            totalProjectCompleted++;
                        }

                        if(projectStatus == "rejected"){
                            totalProjectReject++;
                        }

                        if(projectStatus == "pending"){
                            totalProjectPending++;
                        }

                        if(projectStatus == "created" || projectStatus == "progress"){
                            totalProjectOnGoing++;
                        }
                    }
                }
            };

            for(let l=0; l<totalProject.length; l++){
                let getProjectCreationDate = totalProject[l].createdOn;
                let getMonth = getProjectCreationDate.getMonth();
                    if(getMonth == getThisMonth){
                        recentlyAddedProjectInMonth++;
                }
            };

            for(let m=0; m<5; m++){
                recentlyAdded5Project.push(totalProject[m]);
            }
            
            let tescase = [];
            let runlog = [];
            for(let i=0; i<project.length; i++){
                let projectMembersData = project[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;
    
                    let tescaseData = await TestCases({"_id" : membersId});
                    for(let k=0; k<tescaseData.length; k++){
                        tescase.push(tescaseData[k]);
                    }

                    for(let n=0; n<tescaseData.length; n++){
                        let getPriority = tescaseData[n].priority;

                        if(getPriority == "low"){
                            totalLowPriorityTestCase++;
                        }

                        if(getPriority == "medium"){
                            totalMediumPriorityTestCase++;
                        }

                        if(getPriority == "high"){
                            totalHighPriorityTestCase++;
                        }
                    }

                    let testCaseLastWeekResult = await TestCases.find({"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                    for(let q=0; q<testCaseLastWeekResult.length; q++){
                        totalTestCasesAddedInLastWeek.push(testCaseLastWeekResult[q]);
                    };
                    
                    let runlogData = await RunLog({"_id" : membersId});
                    for(let l=0; l<runlogData.length; l++){

                        let runlogStatus = runlogData[l].status;

                        if(runlogStatus == "completed"){
                            totalRunLogCompleted++;
                        }

                        if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                            totalRunLogRemaining++;
                        }

                        runlog.push(runlogData[l]);
                    }

                    let runLogLastWeekResult = await RunLog.find({"_id" : membersId, "condition" : "Active"}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}});
                    for(let t=0; t<runLogLastWeekResult.length; t++){
                        totalRunLogCasesAddedInLastWeek.push(runLogLastWeekResult[t]);
                    };
                }
            }

            for(let s=0; s<10; s++){
                recentlyAdded10TestCases = recentlyAdded10TestCases.push(tescase[s]);
            }

            for(let r=0; r<10; r++){
                recentlyAdded10RunLog = recentlyAdded10RunLog.push(runlog[r]);
            }

            switch (requiredRoute) {
                case "collectionOfDataInFormOfCountForTester":
                    testerDataObj["totalProjectForTester"] = totalProject.length;
                    testerDataObj["totalProjectCompleted"] = totalProjectCompleted;
                    testerDataObj["totalProjectReject"] = totalProjectReject;
                    testerDataObj["totalProjectPending"] = totalProjectPending;
                    testerDataObj["totalProjectOnGoing"] = totalProjectOnGoing;
                    testerDataObj["recentlyAddedProjectInMonth"] = recentlyAddedProjectInMonth;
                    testerDataObj["totalTestCases"] = tescase.length;
                    testerDataObj["totalLowPriorityTestCase"] = totalLowPriorityTestCase;
                    testerDataObj["totalMediumPriorityTestCase"] = totalMediumPriorityTestCase;
                    testerDataObj["totalHighPriorityTestCase"] = totalHighPriorityTestCase;
                    testerDataObj["totalTestCasesAddedInLastWeek"] = totalTestCasesAddedInLastWeek.length;
                    testerDataObj["totalRunLog"] = runlog.length;
                    testerDataObj["totalRunLogCompleted"] = totalRunLogCompleted;
                    testerDataObj["totalRunLogRemaining"] = totalRunLogRemaining;
                    testerDataObj["totalRunLogCasesAddedInLastWeek"] = totalRunLogCasesAddedInLastWeek.length;
                    break;
                case "recentlyAdded5Project":
                    testerDataObj["recentlyAdded5Project"] = recentlyAdded5Project;
                    break;
                case "recentlyAdded10TestCases":
                    testerDataObj["recentlyAdded10TestCases"] = recentlyAdded10TestCases;
                    break; 
                case "recentlyAdded10RunLog":
                    testerDataObj["recentlyAdded10RunLog"] = recentlyAdded10RunLog;
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