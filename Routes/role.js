const express=require('express');
const router =express.Router();
const RoleController = require("../Controllers/role");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post role related info's.
router.post('/add/', verifyAccessTokenForUserId, RoleController.postRoleInfo);

//Get role related info's.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, RoleController.getRoleInfo);

//Get role related info's by id.
router.get('/get/:roleID', verifyAccessTokenForUserId, getFeatureAccess, RoleController.getRoleInfoById);

//update role related info's.
router.put('/update/:roleID', verifyAccessTokenForUserId, getFeatureAccess, RoleController.updateRoleInfo);

//Delete role related info's.
router.delete('/remove/:roleID', verifyAccessTokenForUserId, getFeatureAccess, RoleController.deleteRoleInfo);

module.exports =router;