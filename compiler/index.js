import { error } from 'console';
import express from 'express'
import { createFile } from './generateFile.js';
import cppExecute from './executeCpp.js';

const app= express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post("/run",async (req,res)=>{
    const {code, language='cpp'}= req.body;
    if(code === undefined){
        return res.json({success:false,message:"Empty code! Can't be executed"});
    }

    const filepath= createFile(language,code);
    try{
        const op= await cppExecute(filepath);
        res.json({success:true,output:op})
    }
    catch(err){
        console.error(err)
        res.json({success:false,output:err});
    }
})

app.listen("5000",()=>{
    console.log("Compiler server running on port 5000!");
})