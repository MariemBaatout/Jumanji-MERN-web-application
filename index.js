const express = require('express');
const mongoose = require('mongoose');
const connection = require('./utils/connection');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');


dotenv.config();

//initialiser application
let app = null ;
//port for app connection
let port = null ;


//initialiser les variables 
const initVar = async()=>{
    port = process.env.PORT;
    app = express();
}

//function to listen to the port 
const ListenToPort = async ()=>{
    app.listen(port , async() =>{
        console.log("Rest Api Port Connected " +port);
    });
}


//trigger the function
initVar().then(()=>{
    ListenToPort().then(()=>{
        middleware().then(()=>{
            connection();
        })
    }) 
});


const User = require("./models/user");
const Animal = require("./models/animal");
const Report = require("./models/report");

const userController = require('./controllers/userController');
const chatController = require('./controllers/chatController');
const animalController = require('./controllers/animalController');
const reportController = require('./controllers/reportController');

//create a MiddleWare function to help us listen to the routes 
middleware = async()=>{
    //this will help us to get json response
    app.use(express.urlencoded({extended: false}));
    app.use(express.json({extended: false}));
    app.use(cors({
        origin: "http://localhost:3000", // frontend URL
        credentials: true,
      }));
      
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use('/',userController);
    app.use('/',chatController);
    app.use('/',animalController);
    app.use('/',reportController);


    //user json response
    app.use('/api/auth',userController);
    //chat json response
    app.use('/api/auth', chatController);
    //animal json response 
    app.use('/api/auth',animalController);
    //report json response 
    app.use('/api/auth',reportController);
    
    





   
}