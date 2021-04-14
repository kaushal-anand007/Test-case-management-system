const { json } = require('body-parser');
const Role =require('../Models/role');
const RoleCounter = require('../Models/counter');
const Log = require('../Models/log');
const User = require("../Models/user");
const toCreateMessageforLog = require('../Helpers/log');

//Function to auto increment the rolecode.
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
  
//Function to post role details.
async function postRoleInfo (req,res) {
    let date = new Date();
    let action = "Added role";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let { roleName,  createdBy, featureList, relevantData } = req.body;
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
                    let roleObj = { roleCode, roleName, createdBy, createdOn : date, "featureList" : featureList, "userID" : userID, "createdBy" : actedBy, "createdOn" : date};
                    let rolecode = 'R'+ data;
                    console.log("rolecode --- >", rolecode);    
                    roleObj.roleCode = rolecode;  
                    await Role.create(roleObj);
                        let result = {
                            status : "success",
                                data : "Role sucessfully Added!!"
                                  }
                                  await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});                                
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
    let date = new Date();
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    console.log("actedBy --- > ",actedBy);
    let action = "Updated role";
    let { roleName, featureList, relevantData} = req.body;
    try {
        let role = await Role.findByIdAndUpdate(
            {_id : req.params.roleID},
            {$set : {roleName, "modifiedBy" : actedBy, "modifiedOn" : date}, $addToSet : {"featureList" : featureList }}
           // { upsert: true,new: true}
        );
        // let role = await Role.findOneAndUpdate(
        //     {_id : req.params.roleID},
        //     {$addToSet : {"featureList" : featureList }},
        //     { upsert: true,new: true}
        // )
        let rolecode = role.roleCode;
        console.log("rolecode --- > ",rolecode);
        console.log("userID --- > ",userID);
        let test = await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});  
        console.log("test --- > ", test);      
        res.status(200).json({message : "Successfully updated role"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//FUnction to delete role details.
async function deleteRoleInfo (req,res) {
    let date = new Date();
    let action = "Deleted role";
    let { relevantData } = req.body;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let roleID = req.params.roleID
    try { 
        let role = await Role.findOne({"_id" : roleID});
        let rolecode = role.roleCode;
        await Log.findOneAndUpdate({"UserID": userID}, { $push : {user_activities: [{"referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)}]}});  
        await Role.remove({_id : roleID});
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

