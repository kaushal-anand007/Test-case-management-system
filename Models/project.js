const mongoose=require('mongoose');

//Schema for Project.
const projectSchema=new mongoose.Schema({
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

    startDate : {
        type : String
    },

    endDate : {
        type : String
    },

    runLog : [{
        runLogCount : {
            type : Number
        },

        testCasePassed : {
            type : Number
        },

        testCaseFailed : {
            type : Number
        },

        comment : {
            type : String
        },

        imageOrAttactment : {
            type: String
        }
    }],

    testCase : [{
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
            type : String
        },

        assignedTo : { _id : { type : String},
            fName : { type : String},
            lName : { type : String}
        },
    
    date : {
       type : String
    },

    time : {
        type : String
    }
}); 

module.exports = mongoose.model('Project', projectSchema);