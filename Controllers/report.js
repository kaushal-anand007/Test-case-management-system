const { json } = require('body-parser');
const Report = require('../Models/report');
const RoleCounter = require('../Models/counter');
const Log = require('../Models/log');

//Function to get auto count of reportcode.
async function getNextSequenceValue(sequenceName){
    try {
        let sequenceDocument = await RoleCounter.findOneAndUpdate({"role" : sequenceName},{
            $set : { role : sequenceName},
            $inc : { sequenceValue: 1 }
            
         },{upsert: true, returnNewDocument:true});
         console.log(sequenceDocument);
         return sequenceDocument ?  parseInt(sequenceDocument.sequenceValue)+1 : 1;
    } catch (error) {
        console.log(error);
    }
}

//Function to post the report details.
async function reportDetails (req,res) {
 let date = new Date().toLocaleDateString();
 let time = new Date().toLocaleTimeString();
 let action = "Added Report";
 let reportCode;
 let user_ID = req.user.payload.userId;   
 let {testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink , priority, bugIdStatus, comments } = req.body;
 try {
    let reportObj ={ reportCode, testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink, priority, bugIdStatus, comments };
     if(testerId == "" || projectName == "" || expectedResult == "" || actualResult == "" || noOfTestCasePassed == "" || noOfTestCaseFailed == "" || bugId == "" || jiraLink == "" || priority == "" || bugIdStatus == "" || comments == ""){
         res.json({ message : "Please fill all the fields!!"})
     }else{
         Report.findOne({"projectName._id" : projectName._id}, async function(err,results){
             if(err){ res.json({ message : err})};
             if(results){
                 res.json({ message : "The project name provided already exists!!!"});
             }else{
                getNextSequenceValue("reportCode").then(async data=>{
                let reportcode = 'Report'+ data;    
                reportObj.reportCode = reportcode;   
                await Report.create(reportObj);
                    let result = {
                        status : "success",
                        data : "Report sucessfully Added!!"
                    }

                    await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}}); 
                    res.status(200).json(result);
                }).catch(error => {
                    res.status(400).json( { message : error });
               });    
             }
         });
    }
 } catch (error) {
     console.log(error);
     res.status(400).json({ message : error });
 }
}

//Function to get list of all the report details.
async function getReportDetails (req,res) {
    try {
        let reportDetails = await Report.find();
        res.status(200).json(reportDetails);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });  
    }
}

//Function to get report details.
async function getReportDetailsById (req,res) {
    try {
        let reportDetailById = await Report.findOne({ _id : req.params.reportID});
        res.status(200).json(reportDetailById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to update report details.
async function updateReportDetails (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Updated Report";
    let user_ID = req.user.payload.userId; 
    let report = req.body;
    try {
        await Report.updateOne(
            {_id : req.params.reportID},
            {$set : report}
        );
        await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}});
        res.status(200).json({message : "Successfully updated report"});
    } catch (error) {
        console.log(error);
        console.log(400).json({ message : error });
    }
}

//Function to delete the report details.
async function deleteReportDetails (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted Report";
    let user_ID = req.user.payload.userId; 
    try {
        await Report.remove({_id : req.params.reportID});
        await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}});
        res.status(200).json({message : "Successfully deleted report"});
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