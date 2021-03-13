const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportCode : {
        type : String 
    },

    testerId : {
        type : String 
    },

    projectName : {
        _id : { type : String},
        nameOfProject : { type : String}
    },

    expectedResult : {
        type : String
    },

    actualResult : {
        type : String
    },

    noOfTestCasePassed : {
        type : String
    },

    noOfTestCaseFailed : {
        type : String
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