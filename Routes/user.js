const express=require('express');
const router =express.Router();
const UserController = require("../Controllers/user");
const  paginationResults  = require('../Helpers/pagination');
const User = require ('../Models/user');
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Login user
router.post('/login', UserController.login);

//Logout user.
router.get('/logout', verifyAccessTokenForUserId, UserController.logout);

//Submiting a user.
router.post('/add/', verifyAccessTokenForUserId , getFeatureAccess, UserController.registerUser);

//Email confirmation.
router.get('/confirm/:confirmationCode', UserController.verifyuser);

//Email confirmation.
router.post('/mail-confirm', UserController.mailConfirm);

//Password creation for new user.
router.post('/password-create/:userID', UserController.passwordCreate);

//Forget password.
router.post('/forget-password/:userID', UserController.forgetPassword);

//Get dashboad.
router.get('/dashboard/', verifyAccessTokenForUserId, getFeatureAccess, UserController.dashboad);

//Get log by Id.
router.get('/log/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.logDetails);

//Get All logs.
router.get('/logs/', verifyAccessTokenForUserId, getFeatureAccess, UserController.logAllDetails);

//Change password.
router.post('/change-password/', verifyAccessTokenForUserId, getFeatureAccess, UserController.updatePassword);

//Get all registered user.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, paginationResults(User), UserController.getRegisteredUser);

//Get filtered data.
router.get('/filtered-list', verifyAccessTokenForUserId, UserController.getFilterdUser);

//Getting specific user.
router.get('/get/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.getUserById);

//Updating user.
router.put('/update/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.updateUserById);

//Update user to make it Block.
router.put('/block/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.updateStatusBlock);

//Update user to make it Active.
router.put('/unblock/:userID', verifyAccessTokenForUserId, UserController.updateStatusActive);

//Deleting specific post.
router.delete('/remove/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.removeUserById);

module.exports =router;