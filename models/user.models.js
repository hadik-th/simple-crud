import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const newuserRegisterModel = new Schema({
    username: {
        type:String,
        require:[true,"Username cannot be empty"],
        unique:[true,"Username must be unique"]

    },
    email:{
        type:String,
        require:[true,"Username cannot be empty"],
    },
    password:{
        type:String,
        require:[true,"Username cannot be empty"],
        min:[6, "password length is too short , min-6"]
    },
    accessToken:{
        type:String
    },
    refreshToken:{
        type:String
    },
    Sex:{
        type:String,
        enum:["Male","Female","Others"]
    }

},{timestamps:true});


// MONGOOSE HOOK
newuserRegisterModel.pre("save", function(next) {
    try {
        //agar user password modify kiya toh bar bar re-encrypt nhi karna hai 
        if(!this.isModified("password")) return next() 
       this.password = bcrypt.hashSync(this.password, 10);
       next();
    } catch (error) {
       console.log("password hashing error ", error);
       next(error); // Pass the error to the next middleware
    }
 });

newuserRegisterModel.methods.verifyPassword = async function (password){
    return await bcrypt.compare(password,this.password);
}


newuserRegisterModel.methods.generateAccessToken = async function (){
    return jwt.sign({
        id:this.id,
        username:this.username,
        
    },"dikky",{ //SECRET-KET IS DIKKY
        expiresIn:"1d"
    })
};

newuserRegisterModel.methods.generateRefreshToken = async function (){
    return jwt.sign({
        id:this.id,
        username:this.username,
        
    },"dikky",{ //SECRET-KEY FOR REFRESH AND ACCESS  CAN BE SAME OR DIFFERENT
        expiresIn:"10d"
    })
}

export const User = mongoose.model("User",newuserRegisterModel);
