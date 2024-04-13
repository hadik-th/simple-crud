import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const verifyTokensOfLoggedInUser=async(req,res,next)=>{

try {
    const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","")
    
    if(!token){
        res.status(400).json({
        error:"unauthorize"
    }) 
       }
       const decodedToken = jwt.verify(token,"dikky");
       console.log("the decoded token is",decodedToken);
       //decoded token will contain user object with all entries filled
       const user=await User.findById(decodedToken?.id).select("-password -refreshToken");

       if(!user){
        return res.status(401).json({
            error:"invalid access token"
        })
    }
    req.user=user
    next();
} catch (error) {
    console.log("middleware error",error);
    
}



}
