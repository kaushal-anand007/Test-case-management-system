const { json } = require('body-parser');
const Report = require('../Models/report');
const Log = require('../Models/log');

async function reportDetails (req,res) {
 let date = new Date().toLocaleDateString();
 let time = new Date().toLocaleTimeString();
 let action = "Added Report";
 let UserID = req.user.payload.userID;   
 let {testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink , priority, bugIdStatus, comments} = req.body;
 try {
     let reportObj ={testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink, priority, bugIdStatus, comments };
     if(testerId == "" || projectName == "" || expectedResult == "" || actualResult == "" || noOfTestCasePassed == "" || noOfTestCaseFailed == "" || bugId == "" || jiraLink == "" || priority == "" || bugIdStatus == "" || comments == ""){
         res.json({ message : "Please fill all the fields!!"})
     }else{
         Report.findOne({"projectName" : projectName}, async function(err,results){
             if(err){ res.json({ message : err})};
             if(results){
                 res.json({ message : "The project name provided already exists!!!"});
             }else{
                await Report.create(reportObj);
                    let result = {
                        status : "success",
                        data : "Report sucessfully Added!!"
                    }
                    await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
                    res.status(200).json(result);
             }
         });
     }
 } catch (error) {
     console.log(error);
     res.status(400).json({ message : error });
 }
}

async function getReportDetails (req,res) {
    try {
        let reportDetails = await Report.find();
        res.status(200).json(reportDetails);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });  
    }
}

async function getReportDetailsById (req,res) {
    try {
        let reportDetailById = await Report.findOne({ _id : req.params.reportID});
        res.status(200).json(reportDetailById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

async function updateReportDetails (req,res) {
 let date = new Date().toLocaleDateString();
 let time = new Date().toLocaleTimeString();
 let action = "Updated Report";
 let UserID = req.user.payload.userID; 
    let report = req.body;
    try {
        let reportUpdate = await Report.updateOne(
            {_id : req.params.reportID},
            {$set : report}
        );
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID});
        res.status(200).json(reportUpdate);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

async function deleteReportDetails (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted Report";
    let UserID = req.user.payload.userID; 
    try {
        let reportDelete = await Report.remove({_id : req.params.reportID});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID});
        res.status(200).json(reportDelete);
    } catch (error) {
        res.status(400).json({ message : error });
    }
}

module.exports = {
    reportDetails : reportDetails,
    getReportDetails : getReportDetails,
    getReportDetailsById : getReportDetailsById,
    updateReportDetails : updateReportDetails,
    deleteReportDetails : deleteReportDetails
}