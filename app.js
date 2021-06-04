//CREATING Reference
const express=require('express');
const bodyParser=require('body-parser');
const connectDB = require('./config/db');
const cors =require("cors");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const Report = require('./Models/report');
const RunLog = require('./Models/runlog');

//INSTANCE of express
const app=express();

//REFERENCE for .env
require('dotenv/config');

app.use(cors());

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.setHeader('Access-Control-Allow-Methods', 'POST','PUT');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
//   });

  app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Special-Request-Header");
        next();
    });  

//IMPORT Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use( bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//DB Connection.
connectDB();

// Render static files
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

//IMPORTS ROUTES
const userRoute=require('./Routes/user');
app.use('/user', userRoute);

const roleRoute=require('./Routes/role');
app.use('/role', roleRoute);

const featureRoute=require('./Routes/feature');
app.use('/feature', featureRoute);

const projectRoute=require('./Routes/project');
app.use('/project', projectRoute);

const reportRoute=require('./Routes/report');
app.use('/report', reportRoute);

app.get('/getPDF', (req,res) => {
    let getpdf = req.query;
    let result = Object.values(getpdf);
    res.sendFile(`/home/kaushal/Pictures/${result}`, (error, data) => {
    if (error) {
        console.error(error);
    return;
        }
      console.log("sucessfully fetched pdf file");
    });
})

//Start listening the server(port).
app.listen(3000, () => {console.log("Listening on port 3000...")});