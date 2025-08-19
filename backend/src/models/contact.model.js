import mongoose,{Schema} from "mongoose";


const contactSchema=new Schema({
contactImage:{
    type:String
},
whatsappNumber:{
    type:String
},
fields:[
        {
            label:{type:String},
            inputType:{type:String}
        }
    ],
 contactInfo: {
    address: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  openTime:{
    type:String
  },

socialLinks: [
    {
      platform: { type: String },
      url: { type: String }
    }
  ],

},{
    timestamps:true
});

export const Contact=mongoose.model('Contact',contactSchema);