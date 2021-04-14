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
        type : Date
   },

   modifiedBy : {
        type : String
   },

   modifiedOn : {
       type : Date
   },

   status : {
    type : String,
    enum : ['Active', 'Inactive']
}
})


module.exports = mongoose.model('Feature', featureSchema); 