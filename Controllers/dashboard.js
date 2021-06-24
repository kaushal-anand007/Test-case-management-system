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

async function getAdminDashBoard(userID, userName, requiredRoute){
        return new Promise(async (resolve,reject) => {
            try {
                let adminDataObj = {};
        
                let totalProject = await Project.find({"condition" : "Active"}).sort({_id : -1});

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

                let recentlyCreatedProject = await Project.find({"condition" : "Active"}).sort({_id : -1}).limit(10);
                
                let projectCrossedDeadLineData = await Project.find({$and : [{"condition" : "Active"}, {"status" : "pending"}]});
                
                let projectOnGoing = await Project.find({$and : [{"condition" : "Active"},{ $or : [{"status" : "created"}, {"status" : "progress"}]}]});
        
                let projectCompleted = await Project.find({$and : [{"condition" : "Active"},{"status" : "complete"}]});
        
                let projectReject = await Project.find({$and : [{"condition" : "Active"}, {"status" : "rejected"}]});
        
                let recentActivities = await Logs.find({}).sort({_id : -1}).limit(10);

                switch (requiredRoute) {
                    case "collectionOfDataInFormOfCountForAdmin":
                        adminDataObj["totalProjectForAdmin"] = totalProject.length;
                        adminDataObj["projectCrossedDeadLineForAdmin"] = projectCrossedDeadLineData.length;
                        adminDataObj["projectCompletedForAdmin"] = projectCompleted.length;
                        adminDataObj["projectRejectForAdmin"] = projectReject.length;
                        adminDataObj["projectCreatedInThisMonth"] = countMonth;
                        adminDataObj["projectOnGoing"] = projectOnGoing.length;
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
            let projectCompleted = 0;
            let projectRejected = 0;
            let projectOnGoing = 0;
            let projectpending = 0;
            let projectAssignThisMonth = 0;
            let recent5Project = [];
            let recentActivities = [];
            let recent10Activities = [];
            let totaltestCases = 0;
            let allTestCases = [];
            let testCaseLowPriority = 0;
            let testCaseMediumPriority = 0;
            let testCaseHighPriority = 0;
            let testCaseWeeklyCount = 0;
            let arrayOfTestCasesOnDailyBasis = [];
            let recent10TestCases = [];
            let totalRunLog = 0;
            let allRunLog = [];
            let runLogCompleted = 0;
            let runLogRemaining = 0;
            let runLogWeeklyCount = 0;
            let arrayOfRunlogOnDailyBasis = [];
            let recent10RunLog = [];

            let sundayTestCaseCount = 0;
            let mondayTestCaseCount = 0;
            let tuesdayTestCaseCount = 0;
            let wednesdayTestCaseCount = 0;
            let thusdayTestCaseCount = 0;
            let fridayTestCaseCount = 0;
            let saturdayTestCaseCount = 0;
            
            let sundayRunLogCount = 0;
            let mondayRunLogCount = 0;
            let tuesdayRunLogCount = 0;
            let wednesdayRunLogCount = 0;
            let thusdayRunLogCount = 0;
            let fridayRunLogCount = 0;
            let saturdayRunLogCount = 0;
          
            let qaManagerDataObj = {};

            let projectData = await Project.find({$and : [{"handledBy._id" : userID}, {"condition" : "Active"}]}).sort({_id : -1});
            
            let projectCreatedByQAManager = await Project.find({$and : [{"condition" : "Active"}, {"createdBy" : userName}]});
    
            let projectQAMangerIsLead = await Project.find({$and : [{"condition" : "Active"}, {"handledBy._id" : userID}]});
            
            for(let k=0; k<projectData.length; k++){
                let status = projectData[k].status;

                if(status == "pending"){
                    projectpending++;                                       
                }

                if(status == "created" || status == "progress"){
                    projectOnGoing++;
                }
                
                if(status == "complete"){
                    projectCompleted++;
                }

                if(status == "rejected"){
                    projectRejected++;
                }
            };
            
            
            for(let l=0; l<projectData.length; l++){
                let getProjectCreationDate = projectData[l].createdOn;
                let getMonth = getProjectCreationDate.getMonth();
                if(getMonth == getThisMonth){
                    projectAssignThisMonth++;
                }
            }

            for(let a=0; a<5; a++){
                recent5Project.push(projectData[a]);
            }


            for(let i=0; i<projectData.length; i++){
                let projectMembersData = projectData[i].members;
                for(let j=0; j<projectMembersData.length; j++){
                    let membersId = projectMembersData[j]._id;

                    let getLog = await Logs.find({"UserID" : membersId}).sort({_id : -1});
                    for(let b=0; b<getLog.length; b++){
                        recentActivities.push(getLog[b]); 
                    }
                    
                    let totalTestCaseUnderHim = await TestCases.find({$and : [{"condition" : "Active"}, {"_id" : membersId}]}).sort({_id : -1});
                    for(let a=0; a<totalTestCaseUnderHim.length; a++){
                        allTestCases.push(totalTestCaseUnderHim[a]);
                        let getTestCaseDate = totalTestCaseUnderHim[a].createdOn;
                        let getTesCaseDate = getTestCaseDate.getDate();
                        let getTestCaseMonth = getTestCaseDate.getMonth();
                        let getPriority = totalTestCaseUnderHim[a].priority;

                        if(getTestCaseMonth == getThisMonth){
                            testCaseWeeklyCount++;
                        }

                        function countDay (getDay) {
                            switch (getDay) {
                                case 0 :
                                    sundayTestCaseCount++;
                                    break;
                                case 1:
                                    mondayTestCaseCount++;
                                    break;
                                case 2:
                                    tuesdayTestCaseCount++;
                                    break; 
                                case 3:
                                    wednesdayTestCaseCount++;
                                    break;
                                case 4:
                                    thusdayTestCaseCount++;
                                    break;
                                case 5:
                                    fridayTestCaseCount++;
                                    break;  
                                case 6:
                                    saturdayTestCaseCount++;
                                    break;             
                            
                                default:
                                    break;
                            }

                        }

                        if(getTesCaseDate == moment().add(0,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-1,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-2,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-3,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-4,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-5,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getTesCaseDate == moment().add(-6,'days').format("D")){
                            let getDay = getTestCaseDate.getDay();
                            countDay(getDay); 
                        }

                        if(getPriority == "low"){
                            testCaseLowPriority++;
                        }

                        if(getPriority == "medium"){
                            testCaseMediumPriority++;
                        }

                        if(getPriority == "high"){
                            testCaseHighPriority++;
                        }

                        totaltestCases++;
                    }

                    let testCaseLastWeekResult = await TestCases.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : membersId}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                    for(let q=0; q<testCaseLastWeekResult.length; q++){
                        testCaseWeeklyCount++;
                    };

                    let runLogLastWeekResult = await RunLog.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : membersId}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                    for(let s=0; s<runLogLastWeekResult.length; s++){
                        runLogWeeklyCount++;
                    };

                    let getRunLog = await RunLog.find({$and : [{"_id" : membersId}, {"condition" : "Active"}]}).sort({_id : -1});

                    for(let r=0; r<getRunLog.length; r++){
                        allRunLog.push(getRunLog[r]);
                        let runlogStatus = getRunLog[r].status;
                        let getRunLogDate = getRunLog[r].createdOn;
                        let getRunLgDate = getRunLogDate.getDate();
                        let getRunLogMonth = getRunLogDate.getMonth();

                        if(getRunLogMonth == getThisMonth){
                            runLogWeeklyCount++;
                        }

                        totalRunLog++;

                        if(runlogStatus == "completed"){
                            runLogCompleted++;
                        }

                        if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                            runLogRemaining++;
                        }

                        function countDay (getDay) {
                            switch (getDay) {
                                case 0 :
                                    sundayRunLogCount++;
                                    break;
                                case 1:
                                    mondayRunLogCount++;
                                    break;
                                case 2:
                                    tuesdayRunLogCount++;
                                    break; 
                                case 3:
                                    wednesdayRunLogCount++;
                                    break;
                                case 4:
                                    thusdayRunLogCount++;
                                    break;
                                case 5:
                                    fridayRunLogCount++;
                                    break;  
                                case 6:
                                    saturdayRunLogCount++;
                                    break;             
                            
                                default:
                                    break;
                            }

                        }

                        if(getRunLgDate == moment().add(0,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-1,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-2,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-3,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-4,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-5,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }

                        if(getRunLgDate == moment().add(-6,'days').format("D")){
                            let getDay = getRunLogDate.getDay();
                            countDay(getDay); 
                        }
                    }

                }
            };

            for(let c=0; c<10; c++){
                recent10Activities.push(recentActivities[c]);
            }

            arrayOfTestCasesOnDailyBasis.push({"sundayTestCaseCount" : sundayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"mondayTestCaseCount" : mondayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"tuesdayTestCaseCount" : tuesdayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"wednesdayTestCaseCount" : wednesdayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"thusdayTestCaseCount" : thusdayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"fridayTestCaseCount" : fridayTestCaseCount});
            arrayOfTestCasesOnDailyBasis.push({"saturdayTestCaseCount" : saturdayTestCaseCount});

            arrayOfRunlogOnDailyBasis.push({"sundayRunLogCount" : sundayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"mondayRunLogCount" : mondayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"tuesdayRunLogCount" : tuesdayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"wednesdayRunLogCount" : wednesdayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"thusdayRunLogCount" : thusdayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"fridayRunLogCount" : fridayRunLogCount});
            arrayOfRunlogOnDailyBasis.push({"saturdayRunLogCount" : saturdayRunLogCount});

            for(let e=0; e<10; e++){
                recent10TestCases.push(allTestCases[e]);
            }

            for(let f=0; f<10; f++){
                recent10RunLog.push(allRunLog[f]);
            }

            switch (requiredRoute) {
                case "collectionOfDataInFormOfCountForQAManager":
                    qaManagerDataObj["projectCreatedByQAManager"] = projectCreatedByQAManager.length;
                    qaManagerDataObj["projectCompleted"] = projectCompleted;
                    qaManagerDataObj["projectRejected"] = projectRejected;
                    qaManagerDataObj["projectOnGoing"] = projectOnGoing;
                    qaManagerDataObj["projectpending"] = projectpending;
                    qaManagerDataObj["projectAssignThisMonth"] = projectAssignThisMonth;
                    qaManagerDataObj["totaltestCases"] = totaltestCases;
                    qaManagerDataObj["testCaseLowPriority"] = testCaseLowPriority;
                    qaManagerDataObj["testCaseMediumPriority"] = testCaseMediumPriority;
                    qaManagerDataObj["testCaseHighPriority"] = testCaseHighPriority;
                    qaManagerDataObj["testCaseWeeklyCount"] = testCaseWeeklyCount;
                    qaManagerDataObj["totalRunLog"] = totalRunLog;
                    qaManagerDataObj["runLogCompleted"] = runLogCompleted;
                    qaManagerDataObj["runLogRemaining"] = runLogRemaining;
                    qaManagerDataObj["runLogWeeklyCount"] = runLogWeeklyCount;
                    qaManagerDataObj["arrayOfTestCasesOnDailyBasis"] = arrayOfTestCasesOnDailyBasis;
                    qaManagerDataObj["arrayOfRunlogOnDailyBasis"] = arrayOfRunlogOnDailyBasis;
                    break;
                case "recent5Project":
                    qaManagerDataObj["recent5ProjectForQAManager"] = recent5Project;
                    break;
                case "recent10Activities":
                    qaManagerDataObj["recent10ActivitiesForQAManager"] = recent10Activities;
                    break;
                case "recent10TestCases":
                    qaManagerDataObj["recent10TestCasesForQAManager"] = recent10TestCases;
                    break;  
                case "recent10RunLog":
                    qaManagerDataObj["recent10RunLogForQAManager"] = recent10RunLog;
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
            let totalProject = 0;
            let allProject = [];
            let projectCompleted = 0;
            let projectRejected = 0;
            let projectOnGoing = 0;
            let projectpending = 0;
            let projectAssignThisMonth = 0;
            let recent5Project = [];
            let totaltestCases = 0;
            let allTestCases = [];
            let testCaseLowPriority = 0;
            let testCaseMediumPriority = 0;
            let testCaseHighPriority = 0;
            let testCaseWeeklyCount = 0;
            let recent10TestCases = [];
            let totalRunLog = 0;
            let allRunLog = [];
            let runLogCompleted = 0;
            let runLogRemaining = 0;
            let runLogWeeklyCount = 0;
            let recent10RunLog = [];


            let projectData = await Project.find({"condition" : "Active"}).sort({_id : -1});
            
            for(let k=0; k<projectData.length; k++){
                let getMembersArray = projectData[k].members;
                for(let z=0; z<getMembersArray.length ; z++){
                    if(getMembersArray[z]._id == userID){
                        let status = projectData[k].status;

                        if(status == "pending"){
                            projectpending++;                                       
                        }

                        if(status == "created" || status == "progress"){
                            projectOnGoing++;
                        }
                        
                        if(status == "complete"){
                            projectCompleted++;
                        }

                        if(status == "rejected"){
                            projectRejected++;
                        }

                        let getProjectCreationDate = projectData[k].createdOn;
                        let getMonth = getProjectCreationDate.getMonth();
                        if(getMonth == getThisMonth){
                            projectAssignThisMonth++;
                        }

                        allProject.push(projectData[k]);

                        totalProject++;
                    }
                }
            };
            

            for(let a=0; a<5; a++){
                recent5Project.push(allProject[a]);
            }
                    
            let totalTestCaseUnderHim = await TestCases.find({$and : [{"condition" : "Active"}, {"_id" : userID}]}).sort({_id : -1});
            for(let a=0; a<totalTestCaseUnderHim.length; a++){
                allTestCases.push(totalTestCaseUnderHim[a]);
                let getTestCaseDate = totalTestCaseUnderHim[a].createdOn;
                let getTestCaseMonth = getTestCaseDate.getMonth();
                let getPriority = totalTestCaseUnderHim[a].priority;

                if(getTestCaseMonth == getThisMonth){
                    testCaseWeeklyCount++;
                }

                if(getPriority == "low"){
                    testCaseLowPriority++;
                }

                if(getPriority == "medium"){
                    testCaseMediumPriority++;
                }

                if(getPriority == "high"){
                    testCaseHighPriority++;
                }

                    totaltestCases++;
                }

                let testCaseLastWeekResult = await TestCases.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : userID}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                for(let q=0; q<testCaseLastWeekResult.length; q++){
                    testCaseWeeklyCount++;
                };

                let runLogLastWeekResult = await RunLog.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : userID}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                for(let s=0; s<runLogLastWeekResult.length; s++){
                    runLogWeeklyCount++;
                };

                let getRunLog = await RunLog.find({$and : [{"_id" : userID}, {"condition" : "Active"}]}).sort({_id : -1});

                for(let r=0; r<getRunLog.length; r++){
                    allRunLog.push(getRunLog[r]);
                    let runlogStatus = getRunLog[r].status;
                    let getRunLogDate = getRunLog[r].createdOn;
                    let getRunLogMonth = getRunLogDate.getMonth();

                    if(getRunLogMonth == getThisMonth){
                        runLogWeeklyCount++;
                    }

                    totalRunLog++;

                    if(runlogStatus == "completed"){
                        runLogCompleted++;
                    }

                    if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                        runLogRemaining++;
                    } 
                }

            for(let e=0; e<10; e++){
                recent10TestCases.push(allTestCases[e]);
            }

            for(let f=0; f<10; f++){
                recent10RunLog.push(allRunLog[f]);
                }
                    switch (requiredRoute) {
                        case "collectionOfDataInFormOfCountForQALead":
                            qaLeadDataObj["totalProject"] = totalProject;
                            qaLeadDataObj["projectCompleted"] = projectCompleted;
                            qaLeadDataObj["projectRejected"] = projectRejected;
                            qaLeadDataObj["projectOnGoing"] = projectOnGoing;
                            qaLeadDataObj["projectpending"] = projectpending;
                            qaLeadDataObj["projectAssignThisMonth"] = projectAssignThisMonth;
                            qaLeadDataObj["totaltestCases"] = totaltestCases;
                            qaLeadDataObj["testCaseLowPriority"] = testCaseLowPriority;
                            qaLeadDataObj["testCaseMediumPriority"] = testCaseMediumPriority;
                            qaLeadDataObj["testCaseHighPriority"] = testCaseHighPriority;
                            qaLeadDataObj["testCaseWeeklyCount"] = testCaseWeeklyCount;
                            qaLeadDataObj["totalRunLog"] = totalRunLog;
                            qaLeadDataObj["runLogCompleted"] = runLogCompleted;
                            qaLeadDataObj["runLogRemaining"] = runLogRemaining;
                            qaLeadDataObj["runLogWeeklyCount"] = runLogWeeklyCount;
                            break;
                        case "recent5Project":
                            qaLeadDataObj["recent5ProjectForQALead"] = recent5Project;;
                            break;
                        case "recent10TestCases":
                            qaLeadDataObj["recent10TestCasesForQALead"] = recent10TestCases;
                            break;  
                        case "recent10RunLog":
                            qaLeadDataObj["recent10RunLogForQALead"] = recent10RunLog;
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
            let totalProject = 0;
            let allProject = [];
            let projectCompleted = 0;
            let projectRejected = 0;
            let projectOnGoing = 0;
            let projectpending = 0;
            let projectAssignThisMonth = 0;
            let recent5Project = [];
            let totaltestCases = 0;
            let allTestCases = [];
            let testCaseLowPriority = 0;
            let testCaseMediumPriority = 0;
            let testCaseHighPriority = 0;
            let testCaseWeeklyCount = 0;
            let recent10TestCases = [];
            let totalRunLog = 0;
            let allRunLog = [];
            let runLogCompleted = 0;
            let runLogRemaining = 0;
            let runLogWeeklyCount = 0;
            let recent10RunLog = [];


            let projectData = await Project.find({"condition" : "Active"}).sort({_id : -1});
            
            for(let k=0; k<projectData.length; k++){
                let getMembersArray = projectData[k].members;
                for(let z=0; z<getMembersArray.length ; z++){
                    if(getMembersArray[z]._id == userID){
                        let status = projectData[k].status;

                        if(status == "pending"){
                            projectpending++;                                       
                        }

                        if(status == "created" || status == "progress"){
                            projectOnGoing++;
                        }
                        
                        if(status == "complete"){
                            projectCompleted++;
                        }

                        if(status == "rejected"){
                            projectRejected++;
                        }

                        let getProjectCreationDate = projectData[k].createdOn;
                        let getMonth = getProjectCreationDate.getMonth();
                        if(getMonth == getThisMonth){
                            projectAssignThisMonth++;
                        }

                        allProject.push(projectData[k]);

                        totalProject++;
                    }
                }
            };
            

            for(let a=0; a<5; a++){
                recent5Project.push(allProject[a]);
            }
                    
            let totalTestCaseUnderHim = await TestCases.find({$and : [{"condition" : "Active"}, {"_id" : userID}]}).sort({_id : -1});
            for(let a=0; a<totalTestCaseUnderHim.length; a++){
                allTestCases.push(totalTestCaseUnderHim[a]);
                let getTestCaseDate = totalTestCaseUnderHim[a].createdOn;
                let getTestCaseMonth = getTestCaseDate.getMonth();
                let getPriority = totalTestCaseUnderHim[a].priority;

                if(getTestCaseMonth == getThisMonth){
                    testCaseWeeklyCount++;
                }

                if(getPriority == "low"){
                    testCaseLowPriority++;
                }

                if(getPriority == "medium"){
                    testCaseMediumPriority++;
                }

                if(getPriority == "high"){
                    testCaseHighPriority++;
                }

                    totaltestCases++;
                }

                let testCaseLastWeekResult = await TestCases.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : userID}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                for(let q=0; q<testCaseLastWeekResult.length; q++){
                    testCaseWeeklyCount++;
                };

                let runLogLastWeekResult = await RunLog.find({$and : [{"condition" : "Active"}, {$and : [{"_id" : userID}, {"createdOn" : {$gte : new Date(new Date - (7 * 60 * 60 * 24 * 1000))}}]}]});
                for(let s=0; s<runLogLastWeekResult.length; s++){
                    runLogWeeklyCount++;
                };

                let getRunLog = await RunLog.find({$and : [{"_id" : userID}, {"condition" : "Active"}]}).sort({_id : -1});

                for(let r=0; r<getRunLog.length; r++){
                    allRunLog.push(getRunLog[r]);
                    let runlogStatus = getRunLog[r].status;
                    let getRunLogDate = getRunLog[r].createdOn;
                    let getRunLogMonth = getRunLogDate.getMonth();

                    if(getRunLogMonth == getThisMonth){
                        runLogWeeklyCount++;
                    }

                    totalRunLog++;

                    if(runlogStatus == "completed"){
                        runLogCompleted++;
                    }

                    if(runlogStatus == "created" || runlogStatus == "started" || runlogStatus == "pending"){
                        runLogRemaining++;
                    } 
                }

            for(let e=0; e<10; e++){
                recent10TestCases.push(allTestCases[e]);
            }

            for(let f=0; f<10; f++){
                recent10RunLog.push(allRunLog[f]);
                }

            switch (requiredRoute) {
                case "collectionOfDataInFormOfCountForTester":
                    testerDataObj["totalProject"] = totalProject;
                    testerDataObj["projectCompleted"] = projectCompleted;
                    testerDataObj["projectRejected"] = projectRejected;
                    testerDataObj["projectOnGoing"] = projectOnGoing;
                    testerDataObj["projectpending"] = projectpending;
                    testerDataObj["projectAssignThisMonth"] = projectAssignThisMonth;
                    testerDataObj["totaltestCases"] = totaltestCases;
                    testerDataObj["testCaseLowPriority"] = testCaseLowPriority;
                    testerDataObj["testCaseMediumPriority"] = testCaseMediumPriority;
                    testerDataObj["testCaseHighPriority"] = testCaseHighPriority;
                    testerDataObj["testCaseWeeklyCount"] = testCaseWeeklyCount;
                    testerDataObj["totalRunLog"] = totalRunLog;
                    testerDataObj["runLogCompleted"] = runLogCompleted;
                    testerDataObj["runLogRemaining"] = runLogRemaining;
                    testerDataObj["runLogWeeklyCount"] = runLogWeeklyCount;
                    break;
                case "recent5Project":
                    testerDataObj["recent5ProjectForTester"] = recent5Project;
                    break;
                case "recent10TestCases":
                    testerDataObj["recent10TestCasesForTester"] = recent10TestCases;
                    break; 
                case "recent10RunLog":
                    testerDataObj["recent10RunLogForTester"] = recent10RunLog;
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