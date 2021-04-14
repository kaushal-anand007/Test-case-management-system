const { json } = require('body-parser');
const Report = require('../Models/report');
const RoleCounter = require('../Models/counter');;
const Log = require('../Models/log');
const convertHtmlToPdf = require('../Helpers/pdf');
const toCreateMessageforLog = require('../Helpers/log');

//Function to auto increment the reportcode.
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

//Function to post the report details.
async function reportDetails (req,res) {
 let date = new Date();
 let action = "Added Report";
 let reportCode;
 let userID = req.user.payload.userId; 
 let actedBy = req.user.payload.user.fName;  
 let {testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink , priority, bugIdStatus, comments, relevantData } = req.body;
 try {
    let reportObj ={ reportCode, testerId, projectName, expectedResult, actualResult, noOfTestCasePassed, noOfTestCaseFailed, bugId, jiraLink, priority, bugIdStatus, comments, "createdBy" : actedBy, "createdOn" : date };
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

                    await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : reportcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});                    
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
    let date = new Date();
    let action = "Updated Report";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName; 
    let report = req.body;
    try {
        let updateReport = await Report.updateOne(
            {_id : req.params.reportID},
            {$set : report}
        );
        updateReport["modifiedBy"] = fname;
        updateReport["modifiedOn"] = date;
        let reportcode = updateReport.reportCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : reportcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});        
        res.status(200).json({message : "Successfully updated report"});
    } catch (error) {
        console.log(error);
        console.log(400).json({ message : error });
    }
}

//Function to delete the report details.
async function deleteReportDetails (req,res) {
    let date = new Date();
    let action = "Deleted Report";
    let userID = req.user.payload.userId; 
    let reportID = req.params.reportID;
    let actedBy = req.user.payload.user.fName;
    try {
        await Report.remove({"_id" : reportID});
        let report = await Report.findOne({"_id" : reportID});
        let reportcode = report.reportCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : reportcode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});        
        res.status(200).json({message : "Successfully deleted report"});
    } catch (error) {
        res.status(400).json({ message : error });
    }
}

async function generatePdf(req, res) {
    let { filename, pdfFileName } = req.body;
    try {
        let Data = await Report.findOne({"_id" : req.params.reportID});
        if (Data.filename == pdfFileName) {
            res.status(400).json({ message : "Duplicate pdf file name! Try another one."});
        } else { 
            convertHtmlToPdf(Data, filename, pdfFileName).then(async result => {
                await Report.findOneAndUpdate({_id : req.params.reportID}, {$set : {"filename" : filename, "pdfFileName" : pdfFileName}})
                res.status(200).json({ message : "PDF Generated!"});
            }).catch((error) => {
                res.status(400).json({ message : "PDF do not Generated!"});
          });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

module.exports = {
    reportDetails : reportDetails,
    getReportDetails : getReportDetails,
    getReportDetailsById : getReportDetailsById,
    updateReportDetails : updateReportDetails,
    deleteReportDetails : deleteReportDetails,
    generatePdf : generatePdf
}
