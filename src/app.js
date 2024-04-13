import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';





const app =express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes import -

import userRouter from '../routes/user.routes.js'
app.use("/api/v2/users",userRouter);

export {app};