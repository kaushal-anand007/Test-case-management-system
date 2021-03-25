const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleCode : {
        type : String
    },
 
    roleName : {
        type : String
    },
    
    featureList : [{ 
        _id : { type : String},
        featureCode : { type : String},
        featureName : { type : String},
        moduleName : {type : String},
        status : { type : Boolean, default : true}
    }],

    userID : {
        type : String
    },

    createdBy : {
        type : String
    },

    createdOn : {
        type : String
    },

    modifiedBy : {
        type : String
    },

    modifiedOn : {
        type : String
    }
});

module.exports = mongoose.model('Role', roleSchema);