const express=require('express');
const router =express.Router();
const RoleController = require("../Controllers/role");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

//Post role related info's.
router.post('/add', verifyAccessTokenForUserId, RoleController.postRoleInfo);

//Get role related info's.
router.get('/get-all', verifyAccessTokenForUserId, RoleController.getRoleInfo);

//Get role related info's by id.
router.get('/get/:roleID', verifyAccessTokenForUserId, RoleController.getRoleInfoById);

//update role related info's.
router.put('/update/:roleID', verifyAccessTokenForUserId, RoleController.updateRoleInfo);

//Delete role related info's.
router.delete('/remove/:roleID', verifyAccessTokenForUserId, RoleController.deleteRoleInfo);

module.exports =router;