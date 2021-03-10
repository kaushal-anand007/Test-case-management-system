const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    testerId : {
        type : String 
    },

    projectName : {
        type : String
    },

    expectedResult : {
        type : String
    },

    actualResult : {
        type : String
    },

    noOfTestCasePassed : {
        type : Number
    },

    noOfTestCaseFailed : {
        type : Number
    },

    bugId : {
        type : String
    },

    jiraLink : {
        type : String
    },

    priority : {
        type : String
    },

    bugIdStatus : {
        type : String
    },

    comments : {
        type : String
    }
});

module.exports = mongoose.model('Report', reportSchema );