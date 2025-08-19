import { Schema } from "mongoose";
import mongoose from "mongoose";

const careerSchema=new Schema({
     careerImage:{
        type:String
    },
    jobs:[
        {type:String}
    ],
    fields:[
        {
            label:{type:String},
            inputType:{type:String}
        }
    ]
},{
    timestamps:true
});

export const Career=mongoose.model('Career',careerSchema);