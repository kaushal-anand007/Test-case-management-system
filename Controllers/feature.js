const Feature = require('../Models/feature');
const RoleCounter = require('../Models/counter');
const { json } = require('body-parser');
const Log =require('../Models/log');

async function getNextSequenceValue(sequenceName){
    try {
        let sequenceDocument = await RoleCounter.findOneAndUpdate({"role" : sequenceName},{
            $set : { role : sequenceName},
            $inc : { sequenceValue: 1 }
            
         },{upsert: true, returnNewDocument:true});
         console.log(sequenceDocument);
         return sequenceDocument ?  sequenceDocument.sequenceValue: 1;
    } catch (error) {
        console.log(error);
    }
 }

async function postFeature (req,res){
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Added Feature";
    let UserID = req.user.payload.userID;  
    let { featureName,  createdBy, moduleName} = req.body; 

    try {
        getNextSequenceValue("featureCode").then(data=>{
            let featurecode = 'F'+ data;
            let featureObj = {  featureCode: featurecode, featureName, createdBy, createdOn : date, moduleName};
            if( featureName == "" || createdBy == "" || moduleName == ""){
                return res.json({ message : "Please fill all the fields!!!"})
            }else{
                Feature.findOne({"featureName" : featureName}, async function(err, result){
                    if(err) { res.json({ message : err})}
                    if(result) {res.json({ message : "The feature name provided already exists!!!" })}
                    else{
                       let data = await Feature.create(featureObj);
                       let result ={
                            status : "success",
                            data : {
                                message : "Feature created sucessfully!!"
                            }
                        }
                        let responseResult = await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
                        res.status(200).json(result);

                    }
                })  
            }  
        }).catch(error => {
            res.status(400).json( { message : error });
        })
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message :  error }); 
    }
}

async function getFeature (req,res) {
    let filter = (req.query.filter)?JSON.parse(req.query.filter):{}
    

    try {
        let feature = await Feature.find(filter);
        res.status(200).json(feature);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }

}

async function getFeatureById (req,res) {
    try {
        let featureById = await Feature.findOne({ _id : req.params.featureID});
        res.status(200).json(featureById);
    } catch (error) {
        res.status(400).json({ message : error });
    }
}

async function updateFeature (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Updated Feature";
    let UserID = req.user.payload.userID;  
    let { featureName, moduleName, modifiedBy} = req.body;
    try {
        let featureUpdate = await Feature.updateOne(
            {_id : req.params.featureID},
            {$set : { "featureName" : featureName, "moduleName" : moduleName ,"modifiedBy" : modifiedBy, modifiedOn : date} }
        );
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json(featureUpdate);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

async function deleteFeature (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted Feature";
    let UserID = req.user.payload.userID; 
    try {
        let featureDelete = await Feature.remove({ _id : req.params.featureID });
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json(featureDelete);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

module.exports = {
    postFeature : postFeature,
    getFeature : getFeature,
    getFeatureById : getFeatureById,
    updateFeature : updateFeature,
    deleteFeature : deleteFeature
}