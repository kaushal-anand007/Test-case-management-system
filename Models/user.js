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

    address : {
        doorNumber : { type : String },
        street : { type : String  },
        area : { type : String },
        landmark : { type : String },
        city : { type : String },
        state : { type : String },
        postalCode : { type : Number}
    },

    phone : {
        type : Number,
        required : [true, "Please enter phone number"],
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
        type : String
    },

    token: 
         {
        type : String,
        unique : true,
        sparse : true 
    },

    date : { 
        type : Date
    },

    status : {
        type : String,
        default : 'Created',
        enum : ['Active', 'Created', 'Blocked']
    },

    verification : {
        emailConfirmation : {
            type : String,
            default : 'Pending',
            enum : ['Pending', 'Confirmed']
        },

        phoneConfirmation : {
            type : String,
            default : 'Pending',
            enum : ['Pending', 'Confirmed']
        }
    },

    confirmationCode: { 
        type: String, 
        unique: true 
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
    },

    otp : {
        code : {type : String},
        expires_at : {type: Number},
    },

    timeOut : {
        type : Boolean,
        default : false
    },

    createdBy : {
        type : String
    },

    createdOn : {
        type : Date
    },

    modifiedBy : {
        type : String
    },

    modifiedOn : {
        type : Date
    },

    reasonForBlock : {
        type : String
    }
 });

module.exports = mongoose.model('User',userSchema);