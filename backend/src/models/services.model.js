import { Schema } from "mongoose";
import mongoose from "mongoose";

const serviceSchema= new Schema({
    serviceImage:{
        type:String
    },
    serviceHeader:{
        type:String
    },
    servicesDescription:{
        type:String
    },
    services:[
        {
            image:{
                type:String
            },
            service:{
                type:String
            },
            serviceDescription:{
                type:String
            }
        }
    ],
    toolHeading:{
        type:String

    },

    tools:[

         {
            toolImage:{
                type:String
            },
            tool:{
                type:String
            },
            toolDescription:{
                type:String
            }
        }

    ]
},{
    timestamps:true
});


export const Service=mongoose.model('Service',serviceSchema)