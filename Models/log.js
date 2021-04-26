const mongoose=require('mongoose');

//Schema for log.
const logSchema = new mongoose.Schema({
    UserID : { 
        type : String 
    },
    
    referenceType : { 
            type : String 
        },

    referenceId : { 
        type : String 
         },

    data : { 
        type : String
        },

    loggedOn : { 
        type : Date
        },

    loggedBy : {
        type : String
    },

    message : { 
        type : String
        }    
});

module.exports =mongoose.model('Log', logSchema);