import mongoose from "mongoose";

const connectToDataBase= async ()=>{
   try {
     let resultfromConnection = await mongoose.connect("mongodb+srv://dikky9424:dikky9424@cluster0.h8tbgch.mongodb.net/TODO")

     console.log(`You are Connected to Mongo-Atlas at ${resultfromConnection.connection.host}`);

   } catch (error) {
    console.log(`Connection error in Mongo-Atlas ${error}`);
    process.exit(1);
    
   }
};

export default connectToDataBase;
