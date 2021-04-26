const mongoose = require('mongoose');

const featureSchema =new mongoose.Schema({
   featureCode : {
       type : String
   },

   featureName : {
       type : String
   },

   moduleName : {
       type : String
   },

   decription : {
       type : String
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
})


module.exports = mongoose.model('Feature', featureSchema); 