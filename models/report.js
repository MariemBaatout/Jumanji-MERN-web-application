
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'reportId' 
    },

    email:{
        type:String,

    },

    name:{
        type:String,

    },

    description:{
        type:String,

        default:"",

    },

    Location:{
        type:String,

    },
    
    phone:{
        type:String,

    },
    
    
},
    {timestamps:true}
);

const Report = mongoose.model("Report",reportSchema,'report');
module.exports = Report ;