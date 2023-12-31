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
                resolve(result ?  parseInt(result.sequenceValue)+1 : 1);
             })
             .catch( (error) => {
                console.log("error -- > ",error);
                reject(error);
        });
    });
};
  
//Function to post role details.
async function postRole (req,res) {
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
                let roleObj = { roleCode, roleName, createdBy, createdOn : date, "featureList" : featureList, "userID" : userID, "createdBy" : actedBy, "createdOn" : date};
                let rolecode = 'R'+ data;
                switch (roleName) {
                    case "Admin":
                        getNextSequenceValue("Admin").then(async data1 =>{
                            roleObj["roleName"] = roleName + " " + data1; 
                            roleObj["roleCode"] = rolecode; 
                            await Role.create(roleObj);
                        });
                        break;
                    case "QA Manager":
                        getNextSequenceValue("QA Manager").then(async data2 =>{
                            roleObj["roleName"] = roleName + " " + data2; 
                            roleObj["roleCode"] = rolecode; 
                            await Role.create(roleObj);
                        });
                        break;
                    case "QA Lead":
                        getNextSequenceValue("QA Lead").then(async data3 =>{
                            roleObj["roleName"] = roleName + " " + data3; 
                            roleObj["roleCode"] = rolecode; 
                            await Role.create(roleObj);
                        });
                        break;
                    case "Tester":
                        getNextSequenceValue("Tester").then(async data4 =>{
                            roleObj["roleName"] = roleName + " " + data4; 
                            roleObj["roleCode"] = rolecode; 
                            await Role.create(roleObj);
                        });
                        break;          
                    default:
                        console.log("The required choice is not available!");
                        break;
                };
                await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                let result = {
                    status : "success",
                    data : "Role sucessfully Added!!"
                }                                
                res.status(200).json(result);
            });
        }    
    } catch (error) {
        console.log(error);
        res.status(400).json({ message :  error }); 
    }
}

//Function to get list of all role details.
async function getRole (req,res) {
    try {
        let getRoles = await Role.find({"condition" : "Active"}).sort({_id : -1});
        res.status(200).json(getRoles)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

//Function to get role details by id.
async function getRoleById (req,res) {
    try {
        let roleInfoById = await Role.findOne({_id : req.params.roleID});
        res.status(200).json(roleInfoById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Function to update role detail by id.
async function updateRole (req,res) {
    let date = new Date();
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action = "Updated role";
    let { roleName, featureList, relevantData} = req.body;
    try {
        let setQuery = {};

        if(featureList){
            setQuery["featureList"] = featureList;
        }
        if(roleName){
            setQuery["roleName"] = roleName;
        }
        if(actedBy){
            setQuery["modifiedBy"] = actedBy;
        }
        if(date){
            setQuery["modifiedOn"] = date;
        }

        console.log("setQuery --- > ",setQuery);
        console.log("req.params.roleID --- > ",req.params.roleID);
        let role = Role.findOne({"_id" : req.params.roleID});
        await Role.findOneAndUpdate(
            {"_id" : req.params.roleID},
            {$set : setQuery}
        );
        let rolecode = role.roleCode;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});       
        res.status(200).json({message : "Successfully updated role"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//FUnction to delete role details.
async function deleteRole (req,res) {
    let date = new Date();
    let action = "Deleted role";
    let { relevantData } = req.body;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let roleID = req.params.roleID
    try { 
        let role = await Role.findOne({"_id" : roleID});
        await Role.deleteOne({"_id" : roleID});
        let rolecode = role.roleCode;
        let actedOn = role.roleName;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});  
        await Role.remove({_id : roleID});
        res.status(200).json({message : "Successfully deleted role"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

async function changeRoleCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let roleid = req.params.roleID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action;

    if(condition == "Active"){
        action = "The role Activated"
    }
    if(condition == "Inactive"){
        acttion = "The role Deactivated"
    }

    try {
        let roleData = await Role.findOne({"_id" : roleid});
        let rolecode = roleData.roleCode;
        await Role.findOneAndUpdate({"_id" : roleid}, {$set : { "condition" : condition }});
        let actedOn = roleData.roleName;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : rolecode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Changed role status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
}

module.exports = {
    postRole : postRole,
    getRole : getRole,
    getRoleById : getRoleById,
    updateRole : updateRole,
    deleteRole : deleteRole,
    changeRoleCondition : changeRoleCondition
}

