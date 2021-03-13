const { json } = require('body-parser');
const project = require('../Models/project');
const Role =require('../Models/role');
const RoleCounter = require('../Models/counter');
const Log = require('../Models/log');

//Function to generate auto increment for rolecode.
async function getNextSequenceValue(sequenceName){
    try {
        let sequenceDocument = await RoleCounter.findOneAndUpdate({"role" : sequenceName},{
            $set : { role : sequenceName},
            $inc : { sequenceValue: 1 }
            
         },{upsert: true, returnNewDocument:true});
         console.log(sequenceDocument);
         return sequenceDocument ?  parseInt(sequenceDocument.sequenceValue)+1: 1;
    } catch (error) {
        console.log(error);
    }
 }
  
//Function to post role details.
async function postRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Added role";
    let userID = req.user.payload.userId;
    let { roleName,  createdBy, featureList } = req.body;
    let roleCode;

    try { 
        if(roleName == "" || createdBy == "" || featureList == ""){
            res.json({ message : "Please fill all the fields"});
        }else{
            Role.findOne({"featureList" : featureList}, async function(err,results){
                if(err){ res.json({ message : err})};
                if(results){
                    res.json({ message : "The feature List provided already exists!!!!"});
                }else{
                    getNextSequenceValue("RoleCode").then(async data=>{
                       let roleObj = { roleCode, roleName, createdBy, createdOn : date, "featureList" : featureList};
                       let rolecode = 'R'+ data;    
                       roleObj.roleCode = rolecode;   
                       await Role.create(roleObj);
                           let result = {
                               status : "success",
                               data : "Role sucessfully Added!!"
                           }
                           await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : userID}); 
                           res.status(200).json(result);
                       }).catch(error => {
                           res.status(400).json( { message : error });
                      });    
                    }
            }).catch(error => {
                res.status(400).json( { message : error });
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message :  error }); 
    }
}

//Function to get list of all role details.
async function getRoleInfo (req,res) {
    try {
        let getRoles = await Role.find().sort({_id : -1});
        res.status(200).json(getRoles)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

//Function to get role details by id.
async function getRoleInfoById (req,res) {
    try {
        let roleInfoById = await Role.findOne({_id : req.params.roleID});
        res.status(200).json(roleInfoById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to update role detail by id.
async function updateRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let UserID = req.user.payload.userId;
    let action = "Updated role";
    let { roleName, featureList, modifiedBy} = req.body;

    try {
        let roleUpdate = await Role.findByIdAndUpdate(
            {_id : req.params.roleID},
            { $addToSet : {"featureList" : featureList }, $set : {roleName, modifiedBy, modifiedOn : date}},
            {new: true}
        );
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json({message : "Successfully updated role"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//FUnction to delete role details.
async function deleteRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted role";
    let UserID = req.user.payload.userId;
    try {
        let roleDelete = await Role.remove({_id : req.params.roleID});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json({message : "Successfully deleted role"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

module.exports = {
    postRoleInfo : postRoleInfo,
    getRoleInfo : getRoleInfo,
    getRoleInfoById : getRoleInfoById,
    updateRoleInfo : updateRoleInfo,
    deleteRoleInfo : deleteRoleInfo
}