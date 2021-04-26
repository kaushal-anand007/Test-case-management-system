const express=require('express');
const router =express.Router();
const RoleController = require("../Controllers/role");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post role related info's.
router.post('/add/', verifyAccessTokenForUserId, RoleController.postRole);

//Get role related info's.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, RoleController.getRole);

//Get role related info's by id.
router.get('/get/:roleID', verifyAccessTokenForUserId, getFeatureAccess, RoleController.getRoleById);

//update role related info's.
router.put('/update/:roleID', verifyAccessTokenForUserId, RoleController.updateRole);

//Delete role related info's.
router.delete('/delete/:roleID', verifyAccessTokenForUserId, RoleController.deleteRole);

//Change role condition.
router.put('/remove/:roleID', verifyAccessTokenForUserId, RoleController.changeRoleCondition);

module.exports =router;