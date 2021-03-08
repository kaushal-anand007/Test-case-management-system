const mongoose=require('mongoose');

//Schema for Project.
const projectSchema=new mongoose.Schema({
    nameOfProject : {
        type : String
    },

    handledBy : {
        type : String
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

        assignedToId : {
            type : String
        },

        assignedToName : {
            type : String
        }
    }],
    
    date : {
       type : Date
    },

    time : {
        type : String
    }
}); 

module.exports = mongoose.model('Project', projectSchema);