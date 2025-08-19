import { Schema } from "mongoose";
import mongoose from "mongoose";



const bannerSchema = new Schema({
  imageUrl: { type: String, required: true },
  heading: { type: String },
  description: { type: String },
  smallText: { type: String }
});

const footerSchema = new Schema({
  logoUrl: { type: String },
  footerDescription: { type: String },
  usefulLinks: [
    {
      label: { type: String },
    }
  ],

  contactInfo: {
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },

  services: [String],

  socialLinks: [
    {
      platform: { type: String },
      url: { type: String }
    }
  ],
  companyMotto:{
    type:String
  }
});
const headerSchema=new Schema({
    logo:{type:String},
   navItems:[
        {
            type:String,
        }
    ],
    rightBtn:{
        type:String
    },
    title:{
        type:String,

    },
    favicon:{
        type:String,//cloudinary link
    },
});
const directorSchema=new Schema({
    directorText:{
        type:String
    },
    directorName:{
        type:String
    },
    directorQuote:{
        type:String
    }
    ,
    directorImage:{
        type:String
    },
    directorSignature:{
      type:String
    },
    directorPosition:{
      type:String
    }
})

const homeSchema=new Schema({

    banner:[bannerSchema],
    footer:footerSchema,
    header:headerSchema,
    director:directorSchema
},{
    timestamps:true
})

export const Home=mongoose.model('Home',homeSchema);