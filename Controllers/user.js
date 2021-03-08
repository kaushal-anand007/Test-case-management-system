const {roles} = require('../Helpers/roles');
const User=require('../Models/user');
const Validation=require('../Helpers/validate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Log =require('../Models/log');
const Report = require('../Models/report');
const Project = require('../Models/project');
const moment = require('moment');

//using moment to fetch date related info.
moment().format();

require('dotenv').config();

//Secret key.
const secretKey=process.env.SECRET_KET;

//handling registration errors.
let handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email : '', password : ''};
    
    //incorrect email
    if(err.message === 'Incorrect Email'){
        errors.email = "That Email is not registered";
    }

    //incorrect password
    if(err.message === 'Incorrect Password'){
        errors.password = "That Password is not registered";
        return errors;
    }

    //duplicate error code
    if(err.code ===11000){
        errors.email ='that email is already registered';
    }

    //validate errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Creating Token for jwt.
const createToken = (user) => {
    const maxToken = 3*24*60*60;
    let userObj = {
        "userId":user["_id"],
        "user":user
    }
  return jwt.sign(userObj, secretKey , {expiresIn: maxToken});
}

//Validating Roles.
let grantAccess = function(action, resource) {
 return async (req, res, next) => {
        try {
        let permission = roles.can(req.user.payload.user.role)[action](resource);
        
        if (!permission.granted) {
            return res.status(401).json({
            error: "You don't have enough permission to perform this action"
            });
        }
        next()
        } catch (error) {
        next(error)
        }
    }
}

//Generating registration.
async function registerUser (req,res) {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    let {fName,lName, email, password, role, status} =req.body;
    let userId;
    
    try{
        let userObj = {fName, lName, email, password, role : role || 'User', date : date, status, time : time};
        let user = await User.create(userObj);
                    let result = {
                        status : "success",
                        data: {
                            message : "Registration is sucessfull",
                            userId : user._id
                        }
                    }
        res.status(200).json(result);
    }catch (err){
        console.log(err);
        const errors = handleErrors(err);
        await res.status(400).json({ errors });
    }
};

//Get all registered user details.
async function getRegisteredUser (req,res) {
    try{
        res.json(res.paginationResults);
    }catch (err) {
        res.json({ message : err});
    }
};

//Adding filter.
var filter = {
    "status" : "Active",
    "role" : "Admin"
}

//Get all registered user by id.
async function getUserById (req,res) {
    try{
        let uniqueUser = await User.findOne( filter, { _id : req.params.userID});
        res.json(uniqueUser);
    }catch (err) {
        res.json({ message : err});
    }
};

//Update user by id.
async function updateUserById (req,res) {
    let user = req.body;
       try{
        let updateUser= await User.updateOne(
            {_id : req.params.userID},
            {$set : user}
        );
        res.json(updateUser);
    }catch (err) {
        res.json({ message : err });
    }
};

//Remove user by id.
async function removeUserById (req,res) {
    try{
        let removeUser = await User.remove({_id: req.params.userID});
        res.json(removeUser);
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
    const UserID = req.user.payload.userID;
    try {
        let logs = await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], UserID: UserID});  

        console.log("logs --- > ",logs);
        res.status(200).json({ message : "Logout Sucessfull"});
    } catch (error) {
        res.status(400).json({ message : "Logout failed.."});
    }
 
}

//Get log details by it. 
async function logDetails (req,res) {
    try {
        let logDetails = await Log.find({ UserID : req.params.logID});
        res.status(200).json(logDetails);
    } catch (error) {
        res.status(400).json({ message : "The given log details are not available."});
    }
}



//Get all the log details.
async function logAllDetails (req,res) {
    try {
        let logDetails = await Log.find().sort({_id : -1});
        res.status(200).json(logDetails);
    } catch (error) {
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
        } else if(!Validation.validatePassword(password)) {
            return res.status(400).json({errorCode:"10002",message:"Invalid Password format, please try again"});
        }else {
        let user = await User.findOne({email: email});

        //Current date and time.
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();

        //Getting UserID.
        let user_ID = user && user._id;
          
        await Log.create({ user_activities: [{"Action" : action, "date" : date, "time" : time}], UserID: user_ID});    
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
                    res.status(200).json(result);
                }else {
                    res.status(400).json({ message : "Password incorrect"});
                }
            }else{
                res.status(400).json({ message : "Email incorrect"});
            }
        }
    }catch (err) {
        const errors = handleErrors(err);
        console.log(errors);
    }
};

//Adding Dashboard
async function dashboad (req,res) {
 try {
     let obj = {};
     //Test cases done yesterday. 
     let totalTestCasesDoneYesterday = await Project.find({ "endDate" : moment().add(-1)} );
     //Test cases done today. 
     let totalTestCasesDoingToday = await Project.find( {"endDate": moment()} );
     //Test cases doing tommorow. 
     let totalTestCasesDoingTommorow = await Project.find( {"endDate" : moment().add(1)} );
     //Recent added 10 projects generated.
     let recentAdded10Project = await Project.find().sort({_id : -1}).limit(10);
     //Recent 10 user activities.
     let allProjectReport = await Report.find().sort({_id : -1});

     obj['totalTestCasesDoneYesterday'] = totalTestCasesDoneYesterday;
     obj['totalTestCasesDoingToday'] = totalTestCasesDoingToday;
     obj['totalTestCasesDoingTommorow'] = totalTestCasesDoingTommorow;
     obj['recentAdded10Project'] = recentAdded10Project;
     obj['allProjectReport'] = allProjectReport;

     res.status(200).json(obj);
 } catch (error) {
     console.log(error);
     res.status(400).json({ message : "The required dashboard details in not available"});
 }
}

//Adding update password
async function updatePassword (req, res){
    let { Password, newPassword } = req.body;
    let UserID = req.user.payload.userID;

    try {
            let users = await User.findOne({_id : UserID});
            let auth = await bcrypt.compare(Password, users.password);
            if(auth){
                if( Password != newPassword){
                    //Salting and Hashing password.
                    let salt = await bcrypt.genSalt(5);
                    newPassword = await bcrypt.hash(newPassword, salt);

                    //Updating new password.
                    await users.updateOne({ password : newPassword});

                    res.status(200).json({ message : "Sucessfully Changed the password"}); 
                }else{
                    res.status(400).json({ message : "Please enter another password your new password matched with old one"});
                }    
            }else{
                res.status(400).json({ message : "Password do not matched"});
            }  
        } catch (error) {
            res.status(400).json({ message : "Please enter valid UserID"});
    }
}

module.exports = {
    registerUser : registerUser,
    getRegisteredUser : getRegisteredUser,
    getUserById : getUserById,  
    updateUserById : updateUserById,
    removeUserById : removeUserById,
    login : login,
    grantAccess : grantAccess,
    createToken : createToken,
    logout : logout,
    logDetails : logDetails,
    logAllDetails : logAllDetails,
    dashboad : dashboad,
    updatePassword : updatePassword
}