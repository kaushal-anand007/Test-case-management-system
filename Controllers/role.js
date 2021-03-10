const { json } = require('body-parser');
const project = require('../Models/project');
const Role =require('../Models/role');
const RoleCounter = require('../Models/counter');
const Log = require('../Models/log');

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

async function postRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Added role";
    let UserID = req.user.payload.userID;
    let { roleName,  createdBy, featureList} = req.body; 

    try {
        getNextSequenceValue("roleCode").then(data=>{
            let rolecode = 'R'+ data;
            let roleObj = {  roleCode: rolecode, roleName, createdBy, createdOn : date, "featureList" : [featureList] };
            if( roleName == "" || createdBy == "" || featureList == ""){
                res.json({ message : "Please fill all the fields!!"})
            }else{
                Role.findOne({"featureList" : featureList}, async function (err,result){
                    if(err){ res.json({ message : err}) };
                    if(result) {
                        res.json({ message : "The feature List provided already exists!!!!"})
                    }else{
                        let data = await Role.create(roleObj); 
                        let result ={
                            status : "success",
                            data : {
                                message : "Role created sucessfully!!"
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

async function getRoleInfo (req,res) {
    try {
        let getRoles = await Role.find().sort({_id : -1});
        res.status(200).json(getRoles)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error});
    }
}

async function getRoleInfoById (req,res) {
    try {
        let roleInfoById = await Role.findOne({_id : req.params.roleID});
        res.status(200).json(roleInfoById);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

async function updateRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let UserID = req.user.payload.userID;
    let action = "Updated role";
    let { roleName, modifiedBy, featureList} = req.body;
    try {
        let roleUpdate = await Role.updateOne(
            {_id : req.params.roleID},
            {$set : {roleName, modifiedBy, modifiedOn : date}, $push : {featureList : featureList } }
        );
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json(roleUpdate);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

async function deleteRoleInfo (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Update deleted";
    let UserID = req.user.payload.userID;
    try {
        let roleDelete = await Role.remove({_id : req.params.roleID});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.status(200).json(roleDelete);
    } catch (error) {
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