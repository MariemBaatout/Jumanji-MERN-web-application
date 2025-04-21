const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
let MONGO_URL=process.env.MONGO_DB_URL;
const connection = require('../utils/connection');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const checkToken = require('../utils/checkToken');
const Report = require('../models/report');
const routes = express.Router();



//add animal route
routes.post('/AddReport',checkToken.checkToken, async (req,res)=>{

    const report =  new Report({
        email:req.decoded.email,
        name:req.body.name,
        description:req.body.description,
        Location:req.body.Location,
        phone:req.body.phone,
    });
    await report.save();
    res.json({
        report_details:report
    });
});




//get all reports route 
routes.get('/getAllReports' , async (req,res)=>{

    const report = await Report.find({},{
        _id: 0,
        reportId: '$_id',
        email:1,
        name: 1,
        description:1,
        Location:1,
        phone:1,
        createdAt:1,
        updatedAt:1,
    });
    res.json(report);
});

//get specific report
routes.get('/getOneReport/:reportId' ,async (req,res)=>{
    const report = await Report.findById(req.params.reportId);
    res.send(report);
});


//get all reports of pecific user 
routes.get('/getUserReports', checkToken.checkToken, async (req, res) => {
    try {
      const userEmail = req.decoded.email;
  
      if (!userEmail) {
        return res.status(400).json({ message: "Invalid token or email not found." });
      }
  
      const userReports = await Report.find({ email: userEmail });
  
      res.json(userReports); // ✅ return array only
    } catch (err) {
      console.error("Error fetching user reports:", err);
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });
  

//search specific report
routes.get('/searchReport/:key' , async (req,res)=>{

    const report = await Report.find(
        {
            "$or":[
                {Location:{$regex:req.params.key , $options: "i"}},
                
            ]
        }
    );
   res.send(report);
});


//delete specific report
routes.delete('/deleteReport/:reportId' , async (req,res)=>{

    Report.findOneAndDelete({_id:req.params.reportId}).then(async()=>{
        console.log('report deleted successfully');
        res.json(await Report.find())
    });
});


module.exports = routes;