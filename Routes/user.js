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
router.post('/add/' , verifyAccessTokenForUserId, UserController.registerUser);

//Email confirmation.
router.get('/confirm/:confirmationCode', UserController.verifyuser);

//Email confirmation.
router.post('/mail-confirm', UserController.mailConfirm);

//Forget password.
router.post('/forget-password', UserController.forgetPassword);

//Otp validation.
router.post('/otp-validation', UserController.otpValidation);

//Reset password after otp generation.
router.post('/reset-password/:email',UserController.resetPasswordAfterOtpGeneration);

//Get dashboad.
router.get('/dashboard/', verifyAccessTokenForUserId, getFeatureAccess, UserController.dashboad);

//Get log by Id.
router.get('/log/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.logDetails);

//Get All logs.
router.get('/logs/', verifyAccessTokenForUserId, getFeatureAccess, UserController.logAllDetails);

//Change password.
router.post('/change-password/:userID', verifyAccessTokenForUserId, UserController.updatePassword);

//Change password by role.
router.post('/role-change-password/:userID', verifyAccessTokenForUserId, UserController.resetPasswordByRole);

//Get all registered user.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, paginationResults(User), UserController.getRegisteredUser);

//Get filtered data.
router.get('/filtered-list', verifyAccessTokenForUserId, UserController.getFilterdUser);

//Getting specific user.
router.get('/get/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.getUserById);

//Getting user.
router.get('/get/', verifyAccessTokenForUserId, UserController.getUser);

//Updating user.
router.put('/update/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.updateUserById);

//Update user to make it Block/Unblock.
router.put('/status/:userID', verifyAccessTokenForUserId, getFeatureAccess, UserController.updateStatus);

//Deleting specific post.
router.delete('/delete/:userID', verifyAccessTokenForUserId, UserController.deleteUserById);

//Change user condition.
router.put('/remove/:userID', verifyAccessTokenForUserId, UserController.changeUserCondition);

module.exports =router;