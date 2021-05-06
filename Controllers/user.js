var express = require('express');
const User=require('../Models/user');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Log =require('../Models/log');
const Report = require('../Models/report');
const Project = require('../Models/project');
const TestCase = require('../Models/testcase');
const RunLog = require('../Models/runlog');
const moment = require('moment');
const RoleCounter = require('../Models/counter');
const nodemailer = require('nodemailer');
const { Mongoose } = require('mongoose');
const { getMailThroughNodeMailer } = require('../Helpers/nodeMailer');
const Role = require('../Models/role');
const toCreateMessageforLog = require('../Helpers/log');

//Importig .env here.
require('dotenv').config();

//using moment to fetch date related info.
moment().format();

//Secret key.
const secretKey=process.env.SECRET_KET;

//Creating Token for jwt.
const createToken = (user) => {
    const maxToken = 30*24*60*60;
    let userObj = {
        "userId":user["_id"],
        "user":user
    }
  return jwt.sign(userObj, secretKey , {expiresIn: maxToken});
}

//Function to auto increment the usercode.
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

//Adding Users
async function registerUser (req,res) {
    let date = new Date();
    let action = "Added new user";
    let { fName, lName, address, phone, email, role,  filename, path, relevantData } =req.body;

    //Generating conformation code.
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let token = '';

    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    let confirmationCode = token;
    let passWord = '';
    for (let i = 0; i < 5; i++) {
        passWord += characters[Math.floor(Math.random() * characters.length )];
    }
   
    let newUserPassword = "SK" + passWord;
    try{
     //Encrypted the password created 
     const salt = await bcrypt.genSalt(5);
     let password = await bcrypt.hash(newUserPassword, salt);

     let userObj = { fName, lName, address, phone, email, "password" : password, "role" : role, "date" : date, "confirmationCode" : confirmationCode, filename, path, "createdBy" : fName, "createdOn" : date };
     if(fName == "" || lName == "" || email == "" || role == "" || address == "" || phone == ""){
         res.json({ message : "Please fill all the fields!!"})
     }else{
        await User.findOne({"email" : email}, async function(err,results){
             if(err){ res.json({ message : err})};
             if(results){
                 res.json({ message : "The email provided already exists!!!"});
             }else{
                getNextSequenceValue("userCode").then(async data=>{
                let usercode = 'U'+ data;    
                userObj.userCode = usercode;   
                let user = await User.create(userObj);
                    let result = {
                        status : "success",
                        data : "User successfully Added!!"
                    }

                    let fName = req.body.fName;
                    let email = req.body.email;
                    let html = "allowed";
                    let filename= "";
                    let path = "";
                    let password = newUserPassword;
                    console.log("password -- > ", password);
                    let otp = "";

                    getMailThroughNodeMailer(fName, email, confirmationCode  = user.confirmationCode, html, filename, path, otp, password);
                    let actedBy = req.user.payload.user.fName;
                    let actedOn = fName;
                    let userID = user && user._id;
                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)}); 

                    res.status(200).json(result);
                }).catch(error => {
                    console.log(error);
                    res.status(400).json( { message : error });
               });    
            }
        });
    }              
    }catch (err){
        console.log(err);
        await res.status(400).json({ errors });
    }
};

//Verify user
async function verifyuser (req,res) {
    try {
        let user = await User.findOne({ "confirmationCode" : req.params.confirmationCode});
        if(user.status == "Active"){
            res.sendFile("/home/kaushal/Desktop/workspace-storeking/test-case-api-service/index1.html");
        }else{
            let fName = "";
            let email = user.email;
            let html = "";
            let filename = user.filename;
            let path =user.path;
            let password = ""

            await User.updateOne({"confirmationCode" : req.params.confirmationCode}, {$set : { "status" : "Active" , "verification.emailConfirmation" : "Confirmed"}});

            getMailThroughNodeMailer( fName, email, confirmationCode = "", html, filename, path, password );
            res.sendFile("/home/kaushal/Desktop/workspace-storeking/test-case-api-service/index.html");
        }
    } catch (error) {
        console.log("error --- > ",error)
        return res.status(400).json({ message: "UnAuthorized! please contact admin." });
    }   
}

//Mail conformation
async function mailConfirm (req, res){
    let { email } = req.body;
    try {
        let mailconfirm = await User.findOne({ "email" : email});
        if(mailconfirm.status == 'Created'){
            res.status(400).json({ message : "mail is not been verified!!"})
        }else{
            if(mailconfirm.password == ''){
                let result = {
                    message : "Please create password first to login!!",
                    userId : mailconfirm._id,
                }
                res.status(200).json(result);
            }else{
                res.status(200).json({ message : "Please login!!"});
            }
        }
    } catch (error) {
        res.status(400).json({ message : "You are Unauthorized!!"});
    }
}

//Forget password.
async function forgetPassword (req,res) {
    let { email } = req.body;
    let timeAtWhichOtpCreated = new Date();
    let timeAtWhichOtpExpires = new Date();
    timeAtWhichOtpExpires = timeAtWhichOtpExpires.setMinutes( timeAtWhichOtpCreated.getMinutes() + 5 );

    //Generating otp.
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += characters[Math.floor(Math.random() * characters.length )];
    }

    try {
        let result = await User.findOne({ "email" : email});
        let getEmail =result.email;
        if (result == null) {
            res.status(400).json({message : "The email you have entered is wrong!!!"})
        } else {
            let fName = result.fName;
            email = ""; 
            let confirmationCode = "";
            let html = "forget password";
            let filename= "";
            let path = "";

            getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, otp);
            await User.findOneAndUpdate({ "email" : getEmail }, { $set : { "otp" : {"code" : otp, "expires_at" : timeAtWhichOtpExpires} }});

            res.status(200).json({ message : "Otp have been send to your registered mail!! please check it."}); 
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
};

//Otp validation
async function otpValidation (req,res){
    let { code } = req.body;
    let timeAtWhichOptVerify = new Date();
    timeAtWhichOptVerify = timeAtWhichOptVerify.setMinutes( timeAtWhichOptVerify.getMinutes() );
        
    try {
        let checkOtp = await User.findOne({"otp.code" : code})
        if(checkOtp == null){
            res.status(400).json({ message : "You entered wrong otp!! please try again"}); 
        }else{
            if( timeAtWhichOptVerify >  checkOtp.otp.expires_at ){
                res.status(400).json({ message : "Otp expires!! please resend the otp again!!"}); 
            }else{
                res.status(200).json({ message : "Otp sucessfully matched!!"}); 
            }
        }
    } catch (error) {  
        console.log(error);
        res.status(400).json(error);
    }
}

//Change password after otp generation.
async function resetPasswordAfterOtpGeneration (req,res) {
    let { password } = req.body;
    try {
        let getEmail = await User.findOne({"email" : req.params.email});
        if(getEmail == null){
            res.status(400).json({ message : "This user is not present"});
        }else{
            const salt = await bcrypt.genSalt(5);
            let Password = await bcrypt.hash(password, salt);
            await User.findOneAndUpdate({"email" : req.params.email}, {$set : {"password" : Password}});
            res.status(200).json({ message : "Sucessfully changed the password!!!"});
        }
    } catch (error) {
       console.log("error --- > ",error);
       res.status(400).json({ message : "Please contact admin!!!"});
    }
}

//Change password by role.
async function resetPasswordByRole (req, res) {
    let date = new Date();
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let action = "password sucessfully changed!"
    let usercode = req.user.payload.user.userCode;
    let { userid, password, relevantData } = req.body;
    try {
        let getActedBy = await User.findOne({ "_id" : userID });
        let getActedOn = await User.findOne({ "_id" : userid })
        let actedOn = getActedOn.fName;
        if(getActedOn ==null){
            res.status(400).json({message : "The user is not present"});   
        }else{
            const salt = await bcrypt.genSalt(5);
            let Password = await bcrypt.hash(password, salt);
            let fName = getActedOn.fName;
                let email = getActedOn.email;
                let html = "roleGeneratedPassword";
                let filename= "";
                let path = "";
                let otp = "";

                getMailThroughNodeMailer(fName, email, confirmationCode  = getActedBy.confirmationCode, html, filename, path, otp, password);
            await User.findOneAndUpdate({ "_id" : userid }, { $set : {"password" : Password} });
            await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
            res.status(200).json({ message : "Sucessfully changed the password!!!"});
        }
    } catch (error) {
       console.log("error --- > ",error);
       res.status(400).json({ message : error});
    }
};

//Get all user details.
async function getRegisteredUser (req,res) {
    try{
        res.json(res.paginationResults);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
};

//Get filtered user.
async function getFilterdUser (req,res) {
    let filter = {
        "role" : req.body.role,
        "status" : req.body.status,
        "date" : req.body.date,
        "condition" : "Active"
    };

    try{
        let filteredUser = await User.find(filter);
        res.json(filteredUser);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
}

//Get user
async function getUser (req,res){
    let userID = req.user.payload.userId;
    try {
        let getUser = await User.findOne({"_id" : userID});
        res.status(200).json(getUser);
    } catch (error) {
        console.log("error --- > ", error);
        res.status(400).json(error);
    }
}

//Get user by id.
async function getUserById (req,res) {
    let user = req.params.userID;
    try{
        let uniqueUser = await User.findOne({ _id : user});
        let projectOutput = [];
        let testOutput = [];
        let runOutput = [];
        let getProjectDetails = await Project.find({ $or : [{"members._id" : user}, {"handledBy._id" : user}]});
        let getTestCaseDetails = await TestCase.find({"userID" : user});
        let getRunlogDetails = await RunLog.find({"userID" : user});

        getProjectDetails.forEach(function(r,i){
            let projectObj = Object.assign({},{_id:r._id,projectCode:r.projectCode,nameOfProject:r.nameOfProject,status:r.status,startDate:r.startDate,endDate:r.endDate});
            projectOutput.push(projectObj);
        });

        getTestCaseDetails.forEach(function(r,i){
            let testcaseobj = Object.assign({},{_id:r._id,testCaseCode:r.testCaseCode,title:r.title,testDescriptions:r.testDescriptions,scenario:r.scenario,status:r.status,testedBy:r.testedBy,remark:r.remark});
            testOutput.push(testcaseobj);
        });

        getRunlogDetails.forEach(function(r,i){
            let runlogobj = Object.assign({},{_id:r._id,runLogCode:r.runLogCode,runLogCount:r.runLogCount,totalTestCase:r.totalTestCase,testCasePassed:r.testCasePassed,testCaseFailed:r.testCaseFailed,testCasePending:r.testCasePending,leadBy:r.leadBy,remark:r.remark,status:r.status});
            runOutput.push(runlogobj);
        });

        let result = {
            userData: {
                "userCode" : uniqueUser.userCode,
                "fName" : uniqueUser.fName,
                "lName" : uniqueUser.lName,
                "email" : uniqueUser.email,
                "role" : uniqueUser.role,
                "date" : uniqueUser.date,
                "status" : uniqueUser.status,
                "address" : uniqueUser.address,
                "phone" : uniqueUser.phone
            },
            projectData : projectOutput,
            testData : testOutput,
            runData : runOutput   
        }
        res.json(result);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
};

//Update user status.
async function updateStatus (req,res) {
    let { status, relevantData, reasonForBlock } = req.body;
    let userID = req.user.payload.userId;
    let date = new Date();
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let userid = req.params.userID;
    let action;
    let actedOn;

    try {
        let user = await User.findOne({"_id" : userid})
        if (status == "Active"){
            action = "User has been unblocked!!";
            await User.updateOne(
                {_id : userid},
                {$set : {"status" : "Active", "reasonForBlock" : null}});
            actedOn =user.fName;    
            res.json({ message : "User sucessfully active!!"});    
        }
        if (status == "Blocked"){
            action = "User has been blocked!!";
            await User.updateOne(
                {_id : userid},
                {$set : {"status" : "Blocked", "reasonForBlock" : reasonForBlock}});
            actedOn =user.fName;    
            res.json({ message : "User have been blocked!!!"});  
        }
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});           
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Update user by id.
async function updateUserById (req,res) {
    let user = req.body;
    let date = new Date();
    let action1 = "Updated user itself";
    let action2 = "Updated user";
    let { relevantData } = req.body;
    let userID = req.user.payload.userId;
    let usercode = req.user.payload.user.userCode;
    let actedBy = req.user.payload.user.fName; 
    let userid = req.params.userID

    try{ 
    let users = await User.findOne({_id : userID});
      if(userid == "" || userid == userID){
        modifiedBy = actedBy;
        modifiedOn = date;  
        await User.findOneAndUpdate(
            {_id : userID},
            {$set : user, modifiedBy, modifiedOn}
          );
          await Log.create({"UserID": userID, "referenceType" : action1, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action1)});      
        }else{
        await User.findOneAndUpdate(
            {_id : userid},
            {$set : user}
          );
          let actedOn = users.fName;
          users["modifiedBy"] = actedBy;
          users["modifiedOn"] = date;
          await Log.create({"UserID": userID, "referenceType" : action2, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action2, actedOn)});      
        }  
     
     res.json({ message : "Updated user!!!"});
    }catch (err) {
       console.log(err);
       res.json({ message : err });
    }
};

//Remove user by id.
async function deleteUserById (req,res) {
    let date = new Date();
    let { relevantData } = req.body;
    let action = "Deleted user";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let userid = req.params.userID
    try{
        let findUser = await User.findOne({ "_id" : userid});
        await User.deleteOne({ "_id" : userid});
        let actedOn = findUser.fName;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});        
        res.json({ message : "Deleted user!!!"});
        await User.remove({"_id" : userid});
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
};


//Logout route
async function logout (req,res) {
    //Current date and time.
    let date = new Date();
    let action = "Logout";
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let { relevantData } = req.body;

    try {
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});        
        res.status(200).json({ message : "Logout Sucessfull"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : "Logout failed.."});
    }
};

//Get log details by it. 
async function logDetails (req,res) {
    try {
        let logDetails = await Log.find({ UserID : req.params.userID});
        res.status(200).json(logDetails);
    } catch (error) {
       console.log(error);
       res.status(400).json({ message : "The given log details are not available."});
    }
};

//Get all the log details.
async function logAllDetails (req,res) {
    try {
        let logDetails = await Log.find().sort({_id : -1});
        res.status(200).json(logDetails);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : "request cannot be completed"});
    }
};

// Login method for user.
async function login (req,res) {
    let { email, password, relevantData } = req.body;
    const action = "Login";
    //validate given inputs, check email and password. 
    try{
        if(!Validation.isValidEmail(email))
        {
            return res.status(400).json({errorCode:"10001",message:"Invalid email format, please try again."})
        }else if(!Validation.validatePassword(password)) {
            return res.status(400).json({errorCode:"10002",message:"Invalid Password format, please try again"});
        }else {
        let user = await User.findOne({email: email});
        if(user != null){
            let usercode = user.userCode;
            let actedBy = user.fName;    
            //Current date and time.
            let date = new Date();
            
            //Check status.
            if (user.status == "Active") {
            //Getting UserID.
            let userID = user && user._id; 
    
            if(user){
                let getRole = user.role;
                console.log("getRole --- > ",getRole);
                let role = await Role.findOne({ "roleName" :  getRole});
                console.log("role --- > ",role);
                //Password Authentication.
                let auth = await bcrypt.compare(password, user.password);
                    if(auth) {
                        //Creating token.
                        let token = createToken(user);
                        const result = {
                            status : "success",
                            data: {
                                token : token,
                                userId : user._id,
                                role : user.role,
                                userStatus : user.status,
                                featureList : role.featureList
                            } 
                        }
                    await Log.create({ "UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                    res.status(200).json(result);
                }else {
                    res.status(400).json({ message : "Password incorrect"});
                }
            }else{
                res.status(400).json({ message : "Email incorrect"});
            }
            }else if(user.status == "Pending"){
                    res.status(400).json({message : "Pending Account. Please Verify Your Email!"});
            }else if(user.status == "Blocked"){
                    res.status(400).json({message : "Your Account is Blocked. Please contact admin!"});
            }else{
                    res.status(400).json({message : "Unauthorized. Please contact admin!"});
            }
        }else{
            res.status(400).json({ message : "user is not present!!"});
        }
      }
    }catch (err) {
        console.log(err);
    }
};

//Adding Dashboard
async function dashboad (req,res) {
 try {
     let obj = {};
     //Test cases done yesterday. 
     let pendingProjectYesterday = await Project.find({ "endDate" : moment().add(-1,'days').format("YYYY/MM/DD")});
     //Test cases doning or done today. 
     let projectToBeDoneToday = await Project.find( {"endDate": moment().format("YYYY/MM/DD")} );
     //Test cases doing tommorow. 
     let projectToBeDoneTommorow = await Project.find( {"endDate" : moment().add(1,'days').format("YYYY/MM/DD")} );
     //Recent added 10 projects generated.
     let recentAdded10Project = await Project.find().sort({_id : -1}).limit(10);
     //Recent 10 user activities.
     let recentProject10Report = await Report.find().sort({_id : -1}).limit(10);

     obj['pendingProjectYesterday'] = pendingProjectYesterday;
     obj['projectToBeDoneToday'] = projectToBeDoneToday;
     obj['projectToBeDoneTommorow'] = projectToBeDoneTommorow;
     obj['recentAdded10Project'] = recentAdded10Project;
     obj['recentProject10Report'] = recentProject10Report;

     res.status(200).json(obj);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : "The required dashboard details is not available"});
    }
};

//Adding update password    
async function updatePassword (req, res) {
    let { Password, newPassword, relevantData} = req.body;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;

    //Current date and time.
    let date = new Date();
    let action = "Password updated";

    try {
        let users = await User.findOne({_id : userID});
        let auth = await bcrypt.compare(Password, users.password);
            if(auth){
                if( Password != newPassword){
                    //Salting and Hashing password.
                    let salt = await bcrypt.genSalt(5);
                    newPassword = await bcrypt.hash(newPassword, salt);

                    //Updating new password.
                    await users.updateOne({ password : newPassword});

                    await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action)});
                    res.status(200).json({ message : "Sucessfully Changed the password"}); 
                }else{
                    res.status(400).json({ message : "Please enter another password"});
                }    
            }else{
                res.status(400).json({ message : "Password do not matched"});
            }  
        } catch (error) {
            console.log(error);
            res.status(400).json({ message : "Please enter valid password!!"});
    }
};

async function changeUserCondition (req,res) {
    let date = new Date();
    let { condition, relevantData } = req.body;
    let userid = req.params.userID;
    let userID = req.user.payload.userId;
    let actedBy = req.user.payload.user.fName;
    let usercode = req.user.payload.user.userCode;
    let action;

    if(condition == "Active"){
        action = "The user Activated"
    }
    if(condition == "Inactive"){
        acttion = "The user Deactivated"
    }

    try {
        let userData = await User.findOne({"_id" : userid});
        await User.findOneAndUpdate({"_id" : userid}, {$set : { "condition" : condition}});
        let actedOn = userData.fName;
        await Log.create({"UserID": userID, "referenceType" : action, "referenceId" : usercode, "data" : relevantData, "loggedOn" : date, "loggedBy" : actedBy, "message" : toCreateMessageforLog(actedBy, action, actedOn)});
        res.status(200).json({message : "Change user status!"});
    } catch (error) {
        console.log("error --- > ",error);
        res.status(400).json({message : error});
    }
}

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    mailConfirm : mailConfirm,
    forgetPassword : forgetPassword,
    otpValidation : otpValidation,
    resetPasswordByRole : resetPasswordByRole,
    resetPasswordAfterOtpGeneration : resetPasswordAfterOtpGeneration,
    verifyuser : verifyuser,
    getFilterdUser : getFilterdUser,
    getUser : getUser,
    getUserById : getUserById,  
    updateStatus : updateStatus,
    updateUserById : updateUserById,
    deleteUserById : deleteUserById,
    login : login,
    createToken : createToken,
    logout : logout,
    logDetails : logDetails,
    logAllDetails : logAllDetails,
    dashboad : dashboad,
    updatePassword : updatePassword,
    changeUserCondition : changeUserCondition
};