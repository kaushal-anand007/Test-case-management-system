const { json } = require('body-parser');
const Report = require('../Models/report');

async function reportDetails (req,res) {
 let { tester_id, project_name, no_of_testCase_passed, no_of_testCase_failed, bug_id, jira_link , priority, bug_id_status, comments} = req.body;
 try {
     let reportObj ={ tester_id, project_name, no_of_testCase_passed, no_of_testCase_failed, bug_id, bug_id, jira_link, priority, bug_id_status, comments };
     await Report.create(reportObj);
     let result = {
         status : "success",
         data : "Report sucessfully Added!!"
     }
     res.status(200).json(result);
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
    let report = req.body;
    try {
        let reportUpdate = await Report.updateOne(
            {_id : req.params.reportID},
            {$set : report}
        );
        res.status(200).json(reportUpdate);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

async function deleteReportDetails (req,res) {
    try {
        let reportDelete = await Report.remove({_id : req.params.reportID});
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