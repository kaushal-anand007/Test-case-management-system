const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    tester_id : {
        type : String 
    },

    project_name : {
        type : String
    },

    expected_result : {
        type : String
    },

    actual_result : {
        type : String
    },

    no_of_testCase_passed : {
        type : String
    },

    no_of_testCase_failed : {
        type : String
    },

    bug_id : {
        type : String
    },

    jira_link : {
        type : String
    },

    priority : {
        type : String
    },

    bug_id_status : {
        type : String
    },

    comments : {
        type : String
    }
});

module.exports = mongoose.model('Report', reportSchema );