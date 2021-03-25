var express = require('express');
const User=require('../Models/user');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Log =require('../Models/log');
const Report = require('../Models/report');
const Project = require('../Models/project');
const moment = require('moment');
const RoleCounter = require('../Models/counter');
const nodemailer = require('nodemailer');
const { Mongoose } = require('mongoose');
const { getMailThroughNodeMailer } = require('../Helpers/nodeMailer');


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

//Function to auto increment the user code.
async function getNextSequenceValue(sequenceName){
    try {
        let sequenceDocument = await RoleCounter.findOneAndUpdate({"role" : sequenceName},{
            $set : { role : sequenceName},
            $inc : { sequenceValue: 1 } 
         },{returnNewDocument:true, upsert: true});
         console.log(sequenceDocument);
         return sequenceDocument ?  parseInt(sequenceDocument.sequenceValue)+1: 1;
    } catch (error) {
        console.log(error);
    }
 }

//Adding Users
async function registerUser (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Added new user";
    let {fName, lName, email, role, status, filename, path} =req.body;
    let userCode;
    let UserID = req.user.payload.userId;

    //Generating conformation code.
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    let confirmationCode = token;

    try{
     let userObj ={userCode, fName, lName, email, "role" : role, status, "date" : date, "time" : time, "confirmationCode" : confirmationCode, filename, path };
     if(fName == "" || lName == "" || email == "" || role == ""){
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
                        data : "User sucessfully Added!!"
                    }

                    let fName = req.body.fName;
                    let email = "";
                    let html = "allowed";
                    let filename= "";
                    let path = "";
                    let password = "";

                    getMailThroughNodeMailer(fName, email, confirmationCode  = user.confirmationCode, html, filename, path), password;

                    let userID = user && user._id;
                    await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID});

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

            await User.updateOne({"confirmationCode" : req.params.confirmationCode}, {$set : { "status" : "Active" }});

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
        if(mailconfirm.status == 'Pending'){
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

//Create password for new user
async function passwordCreate (req,res){
    let { password } = req.body;
    let action = "Created Password";

    //Current date and time.
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    try {
        //Encrypted the password created 
        const salt = await bcrypt.genSalt(5);
        password = await bcrypt.hash(password, salt);
        let user =  await User.findOneAndUpdate({_id : req.params.userID},{
            $set : { "password" : password}
        });

        //Creating token.
        let token = createToken(user);
            const result = {
            status : "success",
                data: {
                    token : token,
                    userId : user._id,
                    role : user.role,
                    userStatus : user.status
                } 
            }
            await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID": user._id}); 
        res.status(200).json(result);   
    }catch (error) {
        console.log(error);
        res.status(400).json({ message : "Password is not created please contact admin."});
    }

}

//Forget password.
async function forgetPassword (req,res) {
    let fname = req.user.payload.user.fName;
    //Generating password for the user.
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 7; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    let password = 'X'+token;
    let { email } = req.body;
    try {
        let result = await User.findOne({ "email" : email});
        const salt = await bcrypt.genSalt(5);
        let Password = await bcrypt.hash(password, salt);
        if (result == null) {
            res.status(400).json({message : "The email you have enter is wrong!!!"})
        } else {
            await User.findOneAndUpdate({_id : req.params.userID}, {$set : {"password" : Password}});
            let fName = fname;
            email = "";
            let confirmationCode = "";
            let html = "forget password";
            let filename= "";
            let path = "";

            getMailThroughNodeMailer(fName, email, confirmationCode, html, filename, path, password);
            res.status(200).json({ message : "You have sucessfully changed you password! check your registered email."});  
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

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
        "date" : req.body.date
    };

    try{
        let filteredUser = await User.find(filter);
        res.json(filteredUser);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
}

//Get all registered user by id.
async function getUserById (req,res) {
    try{
        let uniqueUser = await User.findOne({ _id : req.params.userID});
        res.json(uniqueUser);
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
};

//Update user status blocked.
async function updateStatusBlock (req,res) {
    let { status } = req.body;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let UserID = req.user.payload.userId;
    let action = "User has been Blocked!!!";
    try {
        let updatestatus = await User.updateOne(
            {_id : req.params.userID},
            {$set : {"status" : status}});
            res.json({ message : "User sucessfully blocked!!!"});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID});     
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Update user status Active.
async function updateStatusActive (req,res) {
    let { status } = req.body;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let UserID = req.user.payload.userId;
    let action = "User Active!!!";
    try {
        let updatestatus = await User.updateOne(
            {_id : req.params.userID},
            {$set : {"status" : status}});
            res.json({ message : "User sucessfully unblocked!!!"});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID});     
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : error });
    }
}

//Update user by id.
async function updateUserById (req,res) {
    let user = req.body;
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Updated user";
    let UserID = req.user.payload.userId;

    try{
      await User.updateOne(
        {_id : req.params.userID},
        {$set : user}
         );
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
     res.json({ message : "Updated user!!!"});
    }catch (err) {
       console.log(err);
       res.json({ message : err });
    }
};

//Remove user by id.
async function removeUserById (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Deleted user";
    let UserID = req.user.payload.userId;
    try{
        await User.remove({_id: req.params.userID});
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], "UserID" : UserID}); 
        res.json({ message : "Deleted user!!!"});
    }catch (err) {
        console.log(err);
        res.json({ message : err});
    }
};


//Logout route
async function logout (req,res) {
    //Current date and time.
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let action = "Logout";
    const UserID = req.user.payload.userId;
    try {
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], UserID: UserID});  
        res.status(200).json({ message : "Logout Sucessfull"});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : "Logout failed.."});
    }
}

//Get log details by it. 
async function logDetails (req,res) {
    try {
        let logDetails = await Log.findOne({ UserID : req.params.userID});
        console.log("logDetails --- > ",logDetails);
        res.status(200).json(logDetails);
    } catch (error) {
       console.log(error);
       res.status(400).json({ message : "The given log details are not available."});
    }
}



//Get all the log details.
async function logAllDetails (req,res) {
    try {
        let logDetails = await Log.find().sort({_id : -1});
        res.status(200).json(logDetails);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message : "request cannot be completed"});
    }
}

// Login method for user.
async function login (req,res) {
    let { email, password } = req.body;
    const action = "Login";
    // validate given inputs , check email and password. 
    try{
        if(!Validation.isValidEmail(email))
        {
            return res.status(400).json({errorCode:"10001",message:"Invalid email format, please try again."})
        }else if(!Validation.validatePassword(password)) {
            return res.status(400).json({errorCode:"10002",message:"Invalid Password format, please try again"});
        }else {
        let user = await User.findOne({email: email});

        //Current date and time.
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();
        
        //Check status.
        if (user.status == "Active") {

        //Getting UserID.
        let user_ID = user && user._id;

        if(user){
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
                        userStatus : user.status
                    } 
                }
                await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], UserID: user_ID}); 
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
}

//Adding update password
async function updatePassword (req, res){
    let { Password, newPassword } = req.body;
    let userID = req.user.payload.userId;

    //Current date and time.
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
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

                    await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], UserID: userID}); 

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
}

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    mailConfirm : mailConfirm,
    passwordCreate : passwordCreate,
    forgetPassword : forgetPassword,
    verifyuser : verifyuser,
    getFilterdUser : getFilterdUser,
    getUserById : getUserById,  
    updateStatusBlock : updateStatusBlock,
    updateStatusActive : updateStatusActive,
    updateUserById : updateUserById,
    removeUserById : removeUserById,
    login : login,
    createToken : createToken,
    logout : logout,
    logDetails : logDetails,
    logAllDetails : logAllDetails,
    dashboad : dashboad,
    updatePassword : updatePassword
};