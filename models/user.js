//This file will describe our user 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'userId' // specify the alias option
      },
      
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        //two different users can't have same email
        unique:true,

    },

    role:{
        type:String,
        enum: ['admin', 'public', 'reasercher','ranger'],
        required:true,

    },
    password:{
        type:String,
        required:true,

    },
},
{timestamps: true,}
);
//create a table named Users that contains all the users 
const User = mongoose.model("User",userSchema,'user');
module.exports = User ;