import { Schema } from "mongoose";
import mongoose from "mongoose";

const lifeSchema=new Schema({
     lifeImage:{
        type:String
    },
    
    memories:[
        {
            name:{type:String},
            images:[{
                type:String
            }]
        }
    ]

},{timestamps:true});

export const Life=mongoose.model('Life',lifeSchema);