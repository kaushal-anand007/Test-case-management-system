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
})


module.exports = mongoose.model('Feature', featureSchema); 