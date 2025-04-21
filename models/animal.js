
const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'animalId' // specify the alias option
      },
      email:{
        type:String,

      },
    name:{
        type:String,

    },
    image:{
        type:String,

        default:"",

    },

    ConservationStatus:{
        type:String,

    },
    EstimatedPopulationSize:{
        type:String,

    },
    BiggestThreat:{
        type:String,

    },
    Location:{
        type:String,

    },
    Feature:{
        type:String,

    },
    Fact:{
        type:String,

    },
    
},
    {timestamps:true}
);

const Animal = mongoose.model("Animal",animalSchema,'animal');
module.exports = Animal ;