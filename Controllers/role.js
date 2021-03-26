const { json } = require('body-parser');
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
    let user_ID = req.user.payload.userId;
    let { roleName,  createdBy, featureList } = req.body;
    let roleCode;

    try {
        if(roleName == "" || createdBy == "" || featureList == ""){
            res.json({ message : "Please fill all the fields"});
        }else{
            getNextSequenceValue("RoleCode").then(async data=>{
            Role.findOne({"roleName" : roleName}, async function(err, result){ 
                if(err) { res.json({ message : err})}
                   if(result) {res.json({ message : "Duplicate Role!!" })}
                   else{ 
                    let roleObj = { roleCode, roleName, createdBy, createdOn : date, "featureList" : featureList, "userID" : user_ID};
                    let rolecode = 'R'+ data;    
                    roleObj.roleCode = rolecode;   
                    await Role.create(roleObj);
                        let result = {
                            status : "success",
                                data : "Role sucessfully Added!!"
                                  }
                                  await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}});
                                res.status(200).json(result);
                           }
                        });   
                    }).catch(error => {
                res.status(400).json( { message : error });
            });    
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
    let user_ID = req.user.payload.userId;
    let action = "Updated role";
    let { roleName, featureList, modifiedBy} = req.body;
    try {
        await Role.findByIdAndUpdate(
            {_id : req.params.roleID},
            {$set : {roleName, modifiedBy, "modifiedOn" : date, "featureList" : ""}},
            {new: true}
        );
        await Role.findOneAndUpdate(
            {_id : req.params.roleID},
            {$addToSet : {"featureList" : featureList }},
            { upsert: true,new: true}
        )
        await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}});
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
    let user_ID = req.user.payload.userId;
    try {
        await Role.remove({_id : req.params.roleID});
        await Log.findOneAndUpdate({"UserID": user_ID}, { $push : {user_activities: [{"Action" : action, "date" : date, "time" : time}]}});
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

