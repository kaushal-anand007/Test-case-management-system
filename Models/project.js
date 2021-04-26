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

    status : {
        type : String,
        default : 'created',
        enum : ['created','pending', 'progress', 'complete', 'rejected']
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
    }
}); 

module.exports = mongoose.model('Project', projectSchema);