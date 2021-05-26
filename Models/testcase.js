const mongoose=require('mongoose');

//Schema for Project.
const testCaseSchema=new mongoose.Schema({
    testCaseCode : {
        type : String 
    },
    
    title : {
        type : String
    },

    projectID : {   
        type : String
    },

    userID : {
        type : String
    },
 
    testDescriptions : {
        type : String
    },

    scenarioID : {
        type : String
    },

    scenario : { 
        type : String 
    },

    runLogId : {
        type : String
    },

    status : {
        type : String,
        default : 'pending',
        enum : ['pending', 'passed', 'failed']
    },

    testedBy : { 
        _id : { type : String},
        fName : { type : String},
        lName : { type : String}
    },
        
    remark : { 
        type : String 
    },

    imageOrAttachment : [{
        type : String
    }],

    additionalImageOrAttachment : [{
        type : String
    }],

    videoAttachment : [{
        type : String
    }],

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
});

module.exports = mongoose.model('TestCase',testCaseSchema);