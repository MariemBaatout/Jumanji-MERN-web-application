

const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
let MONGO_URL=process.env.MONGO_DB_URL;

const connection = require('../utils/connection');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const checkToken = require('../utils/checkToken');
const path = require('path');
const multer = require('multer');
const Animal = require('../models/animal');
const routes = express.Router();

//multer configuration
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        //uploads is the file where pictures will be stored
        cb(null,"./uploads")
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage:storage,
});




//add animal image 
routes.put('/AddAnimalImage/:animalId', checkToken.checkToken, upload.single("images"), async (req, res) => {
    try {
        const animal = await Animal.findOneAndUpdate(
            { _id: req.params.animalId },
            { $set: { image: req.file.path } },
            { new: true } // Return the updated document
        );

        if (!animal) {
            return res.status(404).send({ message: "animal not found" });
        }

        const response = {
            message: "Image updated successfully",
            data: animal,
        };
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//add animal route
routes.post('/AddAnimal',checkToken.checkToken, async (req,res)=>{

    const animal =  new Animal({
        email:req.decoded.email,
        name:req.body.name,
        image:req.body.image,
        ConservationStatus:req.body.ConservationStatus,
        EstimatedPopulationSize:req.body.EstimatedPopulationSize,
        BiggestThreat:req.body.BiggestThreat,
        Location:req.body.Location,
        Feature:req.body.Feature,
        Fact:req.body.Fact,
    });
    await animal.save();
    res.json({
        animal_details:animal
    });
});




//get all animals route 
routes.get('/getAllAnimal' , async (req,res)=>{

    const animal = await Animal.find({},{
        _id: 0,
        animalId: '$_id',
        email:1,
        name: 1,
        image: 1,
        ConservationStatus:1,
        EstimatedPopulationSize:1,
        BiggestThreat : 1 ,
        Location:1,
        Feature:1,
        Fact:1,
        createdAt:1,
        updatedAt:1,
    });
    res.json(animal);
});

//get specific animal
routes.get('/api/auth/getOneanimal/:animalId' ,async (req,res)=>{
    const animal = await Animal.findById(req.params.animalId);
    res.send(animal);
});

//search specific animal
routes.get('/api/auth/searchanimal/:key' , async (req,res)=>{

    const animal = await Animal.find(
        {
            "$or":[
                {name:{$regex:req.params.key}},
                
            ]
        }
    );
   res.send(animal);
});


//update specific animal
routes.put('/api/auth/Updateanimal/:animalId' ,checkToken.checkToken, async (req,res)=>{
    Animal.findOneAndUpdate({_id:req.params.animalId},{
        email:req.decoded.email,
        name:req.body.name,
        image:req.body.image,
        ConservationStatus:req.body.ConservationStatus,
        EstimatedPopulationSize:req.body.EstimatedPopulationSize,
        BiggestThreat:req.body.BiggestThreat,
        Location:req.body.Location,
        Feature:req.body.Feature,
        Fact:req.body.Fact,
    }).then(async()=>{
        console.log('animal updated successfully');
        res.json(await Animal.find())
    });
});



//delete specific animal
routes.delete('/api/auth/deleteAnimal/:animalId' , async (req,res)=>{

    Animal.findOneAndDelete({_id:req.params.animalId}).then(async()=>{
        console.log('animal deleted successfully');
        res.json(await Animal.find())
    });
});


module.exports = routes;