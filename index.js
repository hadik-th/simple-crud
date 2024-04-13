
import connectToDataBase from './database/db.js';
import { app } from './src/app.js';



connectToDataBase().then((response)=>{
   
    app.listen(4001,()=>{
        console.log(`Connection to the Server and Listening at port ${4001}`);
    })
    app.on("error",(error)=>{
        console.log(("ERR: ",error));
    })
    
   
}).catch((error)=>{
    console.log(`Error connecting to Mongo-Atlas ${error}`);
});



