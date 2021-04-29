const Feature = require('../Models/feature');
const RoleCounter = require('../Models/counter');
const { json } = require('body-parser');
const Log =require('../Models/log');
const toCreateMessageforLog = require('../Helpers/log');

//Function to auto increment the featurecode.
function getNextSequenceValue(sequenceName){
    return new Promise ( (resolve, reject) => {
             RoleCounter.findOneAndUpdate({"role" : sequenceName},{
                $set : { role : sequenceName},
                $inc : { sequenceValue: 1 }
             },{upsert: true, returnNewDocument:true}).then( (result) => {
                console.log(result);
                resolve(result ?  parseInt(result.sequenceValue)+1 : 1);
             })
             .catch( (error) => {
                console.log("error -- > ",error);
                reject(error);
        });
    });
};

//Function to post the feature details.
async function postFeature (req,res){
    let date = new Date();
    let action = "Added Feature";       
    let userID = req.user.payload.userId; 
    let actedBy = req.user.payload.user.fName;
    let { featureName,  createdBy, moduleName, decription, relevantData} = req.body; 

    try {
        getNextSequenceValue("featureCode").then(data=>{
            let featurecode = 'F'+ data;
            let featureObj = {  "featureCode" : featurecode, featureName, decription, createdBy, createdOn : date, moduleName, "createdBy" : actedBy, "createdOn" : date};
            if( featureName == "" || createdBy == "" || moduleName == null){
                return res.json({ message : "Please fill all the fields!!!"})
            }else{
                Feature.findOne({"featureName" : featureName, "moduleName" : moduleName}, async function(err, result){
                    if(err) { res.json({ message : err})}
                    if(result) {res.json({ message : "Duplicate feature and module!!" })}
                    else{
                       let data = await Feature.create(featureObj);
                       let result ={
                            status : "success",
                            data : {
                                message : "Feature created sucessfully!!"
                            }
                        }
                        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : featurecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});                        
                        res.status(200).json(result);
                        }
                    });  
                }  
            }).catch( error => {
                console.log(error);
            res.status(400).json( { message : error });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message :  error }); 
    }
}

//Function to get list of feature details.
async function getFeature (req,res) {
    try {
        let feature = await Feature.find({"condition" : "Active"});
        res.status(200).json(feature);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }

}

//Function to get feature details by id.
async function getFeatureById (req,res) {
    try {
        let featureById = await Feature.findOne({ _id : req.params.featureID});
        res.status(200).json(featureById);
    } catch (error) {
        console.log(error)
        res.status(400).json({ message : error });
    }
}

//Function to update feature details.
async function updateFeature (req,res) {
    let date = new Date();
    let action = "Updated Feature";
    let userID = req.user.payload.userId; 
    let actedBy = req.user.payload.user.fName;
    let { featureName, moduleName, decription, relevantData} = req.body;
    try {
        let feature = await Feature.updateOne(
            {_id : req.params.featureID},
            {$set : { "featureName" : featureName, "moduleName" : moduleName , "decription" : decription, "modifiedBy" : actedBy, "modifiedOn" : date} }
        );
        let featurecode = feature.featureCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : featurecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});        
        res.status(200).json({message : "Successfully updated feature"});
    } catch (error) {
        console.log(error)
        console.log(400).json({ message : error });
    }
}

//Function to delete the feature.
async function deleteFeature (req,res) {
    let date = new Date();
    let { relevantData } = req.body;
    let action = "Deleted Feature";
    let userID = req.user.payload.userId; 
    let actedBy = req.user.payload.user.fName;
    let featureID = req.params.featureID;
    try {
        let feature = await Feature.findOne({ _id : featureID });
        await Feature.deleteOne({ _id : featureID });
        let featurecode = feature.featureCode;
        let actedOn = feature.featureName;
        await Log.findOneAndUpdate({"UserID": userID, "referenceType" : action, "referenceId" : featurecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)}); 
        await Feature.remove({ _id : featureID });  
        res.status(200).json({message : "Successfully deleted feature"});
    } catch (error) {
        console.log(400).json({ message : error });
    }
};

//Function to change condition of feature.
async function changeFeatureCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let featureid = req.params.featureID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action;

    if(condition == "Active"){
        action = "The feature Activated"
    }
    if(condition == "Inactive"){
        acttion = "The feature Inactived"
    }

    try {
        let featureData = await Feature.findOne({"_id" : featureid});
        let featurecode = featureData.featureCode;
        await Feature.findOneAndUpdate({ "_id" : featureid }, {$set : { "condition" : condition}});
        let actedOn = featureData.featureName;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : featurecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed feature status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
};

module.exports = {
    postFeature : postFeature,
    getFeature : getFeature,
    getFeatureById : getFeatureById,
    updateFeature : updateFeature,
    deleteFeature : deleteFeature,
    changeFeatureCondition : changeFeatureCondition
}