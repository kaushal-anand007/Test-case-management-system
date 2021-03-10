const express=require('express');
const router =express.Router();
const UserController = require("../Controllers/user");
const paginationResults = require('../Helpers/pagination');
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const User = require('../Models/user');

//Login user
router.post('/add-login', UserController.login);

router.get('/logout', verifyAccessTokenForUserId, UserController.logout);

//Submiting a user.
router.post('/add-user', verifyAccessTokenForUserId, UserController.grantAccess('createAny', 'profile'), UserController.registerUser);

//Getting dashboad
router.get('/dashboard', verifyAccessTokenForUserId, UserController.dashboad);

//Get log by Id
router.get('/log/:logID', verifyAccessTokenForUserId, UserController.logDetails);

//Get All logs
router.get('/logs', verifyAccessTokenForUserId, UserController.grantAccess('readAny', 'profile'), UserController.logAllDetails);

//Change password
router.post('/change-password', verifyAccessTokenForUserId, UserController.updatePassword);

//Getting all registered user.
router.get('/list', verifyAccessTokenForUserId, UserController.grantAccess('readAny', 'profile'), paginationResults(User), UserController.getRegisteredUser);

//Getting specific user.
router.get('/get/:userID', verifyAccessTokenForUserId, UserController.getUserById);

//updating user.
router.put('/update/:userID', verifyAccessTokenForUserId, UserController.grantAccess('updateAny', 'profile'), UserController.updateUserById);

//deleting specific post.
router.delete('/remove/:userID', verifyAccessTokenForUserId, UserController.grantAccess('deleteAny', 'profile'), UserController.removeUserById);

module.exports =router;