//CREATING Reference
const express=require('express');
const bodyParser=require('body-parser');
const connectDB = require('./config/db');
const cors =require("cors");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
//const ejs = require('ejs');
const Report =require('./Models/report');

//INSTANCE of express
const app=express();

//REFERENCE for .env
require('dotenv/config');

app.use(cors());

//IMPORT Parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use( bodyParser.json());

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

//How we start listening the server(port).
app.listen(3000, () => {console.log("Listening on port 3000...")});