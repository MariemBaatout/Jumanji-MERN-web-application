//handle all the routes that we are going to use to send register and login

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const checkToken = require('../utils/checkToken');

const User = require('../models/user');
const Token = require('../models/token');



const routes = express.Router();


//signup route
routes.post('/signup' , async (req,res)=>{
  console.log("🚀 Signup route hit!");

    //generate hashed password 
        //1 generate salt 
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    const user = await new User({
        _id : req.body.userId,
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
        password:hashPassword,
    });
    await user.save();
    // convert the ObjectId to string and rename the _id field to userId
  const newUser = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $addFields: {
        userId: { $toString: "$_id" },
      },
    },
    { $project: { _id: 0 } },
  ]);

  res.json(newUser[0]);
});

//get specific user route 
routes.get('/api/auth/getUser/:userId' , checkToken.checkToken,  async (req,res)=>{
    console.log("Token is valid. Decoded token:", req.decoded);
    try {
        const user = await User.findOne({_id: req.params.userId}, {
          _id: 0,
          userId: '$_id',
          name: 1,
          email: 1,
          role: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
        });
        res.json(user);
      } catch (err) {
        console.log("An error occurred while fetching user data:", err);
        res.json({
          status: false,
          msg: "An error occurred while fetching user data",
        });
      }
});
//check unique email 

routes.get('/api/auth/checkEmail/:email' , async (req,res)=>{

        const user = await User.findOne({email: req.params.email}, {
          _id: 0,
          userId: '$_id',
          name: 1,
          email: 1,
          role: 1,
          password: 1,
          createdAt: 1,
          updatedAt: 1,
        });
        if(user !== null){
            res.json({
                status: true ,
                user});
        }else{
            res.json({
                status: false ,
                user});
        }
      
});

//get all users route 
routes.get('/api/auth/getUser' ,  async (req,res)=>{
    const user = await User.find({},{
        _id: 0,
        userId: '$_id',
        name: 1,
        email: 1,
        role: 1,
        password: 1,
        createdAt: 1,
        updatedAt: 1,
      });
    res.json(user);
});

//login route
routes.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'User does not exist, please sign up' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials, check login details' });
    }

    const token = jwt.sign({ email: user.email }, config.key, { expiresIn: '24h' });

    await Token.create({ user: user.email, token });

    res.json({ token, user, message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//logout
routes.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.key);

    await Token.deleteOne({ user: decodedToken.email });

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//update password 
routes.put('/api/auth/UpdatePassword/:email' ,checkToken.checkToken, async (req,res)=>{
    User.findOneAndUpdate({email:req.params.email},{
        password:req.body.password,
    }).then(async()=>{
        console.log('user password updated successfully');
        res.json(await User.find())
    });
});



//get specific profile
routes.get('/getOneProfil', checkToken.checkToken, async (req, res) => {
  function getEmailFromToken(req) {
    if (req.decoded && req.decoded.email) {
      return req.decoded.email;
    } else {
      throw new Error('User email not found in token');
    }
  }
  
  const currentUserEmail = getEmailFromToken(req);

  const user = await User.find({ email: currentUserEmail }, {
    _id: 0,
        userId: '$_id',
        email:1,
        name: 1,
        role:1,
        createdAt:1,
        updatedAt:1,
  });

  res.json(user);
});


//delete specific profile
routes.delete('/deleteSingleProfile/:userId' , async (req,res)=>{

  User.findOneAndDelete({_id:req.params.userId}).then(async()=>{
      console.log('user profile deleted successfully');
      res.json(await User.find())
  });
});



//update specific profile 
routes.put('/UpdateUserProfile/:userId' ,checkToken.checkToken, async (req,res)=>{
  User.findOneAndUpdate({_id:req.params.userId},{
    name: req.body.name,
    role:req.body.role,    
  }).then(async()=>{
      console.log('profile updated successfully');
      res.json(await User.find())
  });
});


module.exports = routes;