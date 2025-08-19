import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js'
// import { uploadOnCloudinary } from '../utils/cloudinary.js';
// import jwt from "jsonwebtoken";
// import mongoose from 'mongoose';



const generateAccessTokenandRefreshToken = async(userId) => {
 try{
     const user=await User.findById(userId);
     const refreshToken=user.generateRefreshToken();
     const accessToken=user.generateAccessToken();
     user.refreshToken=refreshToken;
     await user.save({validateBeforeSave:false});
     return {accessToken,refreshToken};
 }catch(error){
    throw new ApiError(500, "Server Error generating tokens");
}
};
 

const registerUser=asyncHandler(async(req,res)=>{
   
    const {username,email,password}=req.body;
    if(
        [username,email,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser=await User.findOne({
        $or:[{ username }, { email }]
    });
    if(existedUser){
        throw new ApiError(409,"Username or email already exists");
    }
    

    const user=await User.create({
        email,
        password,
        username:username.toLowerCase()
    });

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new ApiError(500,"User not created");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully"))


});

const loginUser=asyncHandler(async(req,res)=>{

   const {email,password}=req.body;
  
   if(!(email)){
    throw new ApiError(400,"Username or email is required");
   }



   const user=await User.findOne({
    $or:[{email}]
   });

   if(!user){
    throw new ApiError(404,"User not found");
   }

   const isPasswordValid=await user.isPasswordCorrect(password);

   if(!isPasswordValid){
    throw new ApiError(404,"Invalid user credentials");
   }

   const {accessToken,refreshToken}=await generateAccessTokenandRefreshToken(user._id);
   
   const loggedInUser=await User.findById(user._id).select(
    "-password -refreshToken"
   );
// token cant be modified by frontend
   const options={
     httpOnly:true,
   }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new  ApiResponse(
            200,
            {
              user:loggedInUser,accessToken,refreshToken
            },
            "User loggedIn successfully"
));

});

const logoutUser=asyncHandler(async(req,res)=>{
    console.log("req",req.user)
   await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },{
        new:true
    }
   );

   const options={
    httpOnly:true,
   }

   return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
   .json(
    new ApiResponse(200,{},"User logged out")
   )
});

export {registerUser,loginUser,logoutUser}

