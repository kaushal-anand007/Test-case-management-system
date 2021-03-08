//CREATING Reference
const express=require('express');
const bodyParser=require('body-parser');
const connectDB = require('./config/db');
const cors =require("cors");

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

//ROUTES
app.get('/', (req,res) => {
  res.send("Hello World");
});

//How we start listening the server(port).
app.listen(3000, () => {console.log("Listening on port 3000...")});