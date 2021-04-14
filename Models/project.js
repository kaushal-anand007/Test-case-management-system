const mongoose=require('mongoose');

//Schema for Project.
const projectSchema=new mongoose.Schema({
    projectCode : {
        type : String
    },

    nameOfProject : {
        type : String
    },

    handledBy : {
        _id : { type : String},
        fName : { type : String},
        lName : { type : String}
    },

    projectDescription : {
        type : String
    },

    members : [{
        _id : { type : String },
        fName : { type : String },
        lName : { type : String }
    }],

    startDate : {
        type : Date
    },

    endDate : {
        type : Date
    },

    userID : {
        type : String
    },

    scenario : [{
        title : {
            type : String
        },

        createdBy : {
            type : String
        },
    
        createdOn : {
            type : Date
        }
    }],

    testCase : [{
        testCaseCode : {
            type : String 
        },
        
        title : {
            type : String
        },

        testDescriptions : {
            type : String
        },

        attachment : {
            type : String
        },

        status : {
            type : String,
            enum : ['Active', 'Inactive']
        },

        assignedTo : { 
            _id : { type : String},
            fName : { type : String},
            lName : { type : String}
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
    }],

    runLog : [{
        runLogCode : {
            type : String
        },

        runLogCount : {
            type : Number
        },

        testCasePassed : {
            type : Number
        },

        testCaseFailed : {
            type : Number
        },

        testCaseList : {
            type : String
        },

        comment : {
            type : String
        },

        imageOrAttachment : {
            type: String
        },

        filename : {
            type : String
        },

        pdfFileName : {
            type : String
        },

        status : {
            type : String,
            enum : ['pending', 'progress', 'complete', 'rejected']
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
    }],

    status : {
        type : String,
        enum : ['Active', 'Inactive']
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
}); 

module.exports = mongoose.model('Project', projectSchema);