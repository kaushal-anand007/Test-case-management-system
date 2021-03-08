const { json } = require('body-parser');
const project = require('../Models/project');
const Role =require('../Models/role');
const RoleCounter = require('../Models/counter');

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
    let { roleName,  createdBy, feature} = req.body; 

    try {
        getNextSequenceValue("roleCode").then(data=>{
            let rolecode = 'R'+ data;
            let roleObj = {  roleCode: rolecode, roleName, createdBy, createdOn : date, "feature" : [feature ] };
            Role.create(roleObj).then(data=>{
                let result ={
                    status : "success",
                    data : {
                        message : "Role created sucessfully!!"
                    }
                }
                res.status(200).json(result);
            });
        
            
        }).catch(error => {
            res.status(400).json( { message : error });
        })
        
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message :  error }); 
    }
}

// var filter = {
//     "createdOn" : "01/03/2021"
// }

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
    let { roleName, modifiedBy, feature} = req.body;
    try {
        let roleUpdate = await Role.updateOne(
            {_id : req.params.roleID},
            {$set : {roleName, modifiedBy, modifiedOn : date}, $push : {feature : feature, } }
        );
        res.status(200).json(roleUpdate);
    } catch (error) {
        console.log(400).json({ message : error });
    }
}

async function deleteRoleInfo (req,res) {
    try {
        let roleDelete = await Role.remove({_id : req.params.roleID});
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