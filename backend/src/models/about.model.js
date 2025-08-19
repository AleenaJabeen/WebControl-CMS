import { Schema } from "mongoose";
import mongoose from "mongoose";

const aboutSchema=new Schema({
     innovativeSmallText:{
        type:String
    },
    innovativeHeader:
    {
        type:String
    },
     innovativeDescription:
    {
        type:String
    },
    innovativeIdeas:[
        {
            ideaImage:{
                type:String
            },
            idea:{
                type:String
            },
            ideaDescription:{
                type:String
            }
        }
    ],
    aboutBannerImage:{
        type:String
    },
     experienceYears:{
        type:Number
    },
    awards:{
        type:Number
    },
    projectsNumber:{
        type:Number
    },
    aboutAuthor:{
        type:String
    },
    authorPosition:{
        type:String
    },
    aboutImage:{
        type:String
    },
    partnerHeader:{
        type:String
    },
    partnerDescription:{
        type:String
    },
    partnerImages:[
        {
            type:String
        }
    ]
},{
    timestamps:true
});

export const About=mongoose.model('About',aboutSchema);