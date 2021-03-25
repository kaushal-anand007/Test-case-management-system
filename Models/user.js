const mongoose=require('mongoose');
const { isEmail }=require('validator');

//Schema for User.
const userSchema=new mongoose.Schema({
    userCode : {
        type : String
    },

    fName: {  
        type : String, 
    },

    lName: {
        type : String, 
    },

    email: {
        type : String,
        unique : true,
        required : [true, "Please enter an email"],
        validate : [isEmail, 'Please enter a valid email']
    },

    password: {
        type : String,
        default : ""
    },

    role: {
        type : String,
        unique: true
    },

    token: 
         {
        type : String,
        unique : true,
        sparse : true 
    },

    date : { 
        type : String
    },

    status : {
        type : String,
        default : 'Pending',
        enum : ['Active', 'Pending', 'Blocked']
    },

    confirmationCode: { 
        type: String, 
        unique: true 
    },

    time : {
        type :String 
    },

    company : {
        type :String ,
        default : 'StoreKing'
    },

    filename : {
        type : String
    },

    path : {
        type : String
    }
 });

module.exports = mongoose.model('User',userSchema);