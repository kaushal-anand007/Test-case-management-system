const mongoose = require('mongoose');

const runLogSchema = new mongoose.Schema({
    runLogCode : {
        type : String
    },

    totalTestCase : {
        type : Number,
        default : 0
    },

    testCasePassed : {
        type : Number,
        default : 0
    },

    testCaseFailed : {
        type : Number,
        default : 0
    },

    testCasePending : {
        type : Number,
        default : 0
    },

    projectId : {
        type : String
    },

    projectTitle : {
        type : String
    },

    userID : {
        type : String
    },

    scenarioID : {
        type : String
    },

    testCaseList : [{
        testCaseCode : { type : String },
        title : { type : String },
        scenarioID : { type : String },
        scenario : { type : String },
        testDescriptions : { type : String },
        status : { type : String },
        testedBy : { 
            _id : { type : String},
            fName : { type : String},
            lName : { type : String}
        },
        remark : { type : String },
        imageOrAttachment : [{type : String}]
    }],

    leadBy : {
        _id : { type : String},
        fName : { type : String},
        lName : { type : String}
    },

    remark : {
        type : String
    },

    filename : {
        type : String
    },

    pdfFileName : {
        type : String
    },

    status : {
        type : String,
        default : 'created',
        enum : ['created', 'started', 'pending', 'completed']
    },

    createdBy : {
        type : String
    },

    createdOn : {
        type : Date
    },

    modifiedBy : {
        type : String
    },

    modifiedOn : {
        type : Date
    },

    condition : {
        type : String,
        default : 'Active',
        enum : ['Active', 'Inactive']
    },

    role : { type : String }
})

module.exports = mongoose.model('RunLog', runLogSchema);