import { User } from "../models/user.models.js";
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

//Option to use in cookie-
const options = {
    httpOnly:true,
    secure:true
}
//Methods-
const generateAccessandRefreshToken = async (userId)=>{
  try {
      const user = await User.findById(userId)
      if(!user){
          
          throw new ApiError(400,"there was some error in gereating tokens")        
      }
      const accesToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({validateBeforeSave:false});
      return {accesToken,refreshToken};
  } catch (error) {
    console.log("token error ",error);
    
  }

}

const newUserRegister = asyncHandler(async(req,res)=>{
    // what to do-
    // Extract user filled data from body
    // Check if username,email already exists
    // check if any field is empty or not 
    // save the newly created user to DB
    // send response to front-end
    const {username,password,email,Sex}=req.body;
    console.log(req.body);
    // console.log(username,password,email,sex);
   if(username===""){
    throw new ApiError(401,"username cannot be empty")
   }
   else if(password===""){
    throw new ApiError(401,"Password cannot be empty")
   }
   else if(email===""){
    throw new ApiError(401,"Email cannot be empty")
   }
 //can also use email verification, by string.included("@")
   const alreadyUser=  await User.findOne({
        $or:[{username},{email}]
    })
  
    if(alreadyUser){
        throw new ApiError(409,"User with email or Username already exists")
    }

   const newlyCreatedUser= await User.create({
        username,
        password,
        email,
        Sex
    });

    if(!newlyCreatedUser){
        throw new ApiError(401,"User does not exists")
    }

   return res.status(201).json(
        new ApiResponse(200,newlyCreatedUser,"User created successfully"),
        
    )

});

const loginNewUser = asyncHandler(async(req,res)=>{
//what to do-
//extract data from body
//check if user exists or not
//check for the password verification
//generate access and refresh token
//
const {username,password,email}= req.body;
if(!username || !password){
    throw new ApiError(400,"username or password field cannot be empty ");
}
 const user = await  User.findOne({
    $or: [{username},{email}]
  })
  if(!user){
    throw new ApiError(400,"User does not exists")
  }
  const isPasswordVerified = await user.verifyPassword(password);
  //console.log(isPasswordVerified); result as TRUE or FALSE
  if(!isPasswordVerified){
    throw new ApiError(400,"Password is Incorrect");
  }

  //method is called here to generate tokens -
  const {accesToken,refreshToken}= await generateAccessandRefreshToken(user._id);
  console.log(accesToken,refreshToken);

 const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(201). cookie("accessToken",accesToken,options).  cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,loggedinUser,"user logged-in")
    
  )
});


const logoutUser= asyncHandler(async(req,res)=>{
    try {
        User.findByIdAndUpdate(req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {new:true}
            //new:true will return new updated values, since by default it returns the obj wich is not updated
            )
            return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken").json({
                message:"user loggout "
              })
        
    } catch (error) {
        console.log("logout error",error);
        
    }
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken
   
    if(!incomingToken){
        throw new ApiError(401,"unauthorize token ")
    }
 try {
       const decodedToken = jwt.verify(incomingToken,"dikky");
      
      const user= await User.findById(decodedToken.id)
      console.log("the user is",user);
      if(!user){
       throw new ApiError(401,"No user found By Token")
      }
      if(incomingToken!==user?.refreshToken){
       throw new ApiError(401,"inavlid token")
      }
      const {accessToken,newrefreshToken}= generateAccessandRefreshToken(user._id)
   
      res.status(201).cookie('accessToken',accessToken,options).cookie('refreshToken',newrefreshToken,options).json(
       new ApiResponse(
           200,
           {accessToken,
           newrefreshToken},
           "Access token is refreshed"
       )
      )
 } catch (error) {
    console.log("there is error",error);
    
 }

})
  



export {newUserRegister,
loginNewUser,logoutUser,refreshAccessToken};