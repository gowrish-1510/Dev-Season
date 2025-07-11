
import express from 'express'
import { createFile } from './generateFile.js';
import cppExecute from './executeCpp.js';
import pythonExecute from './executePython.js';
import fs from 'fs'

const app= express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post("/run",async (req,res)=>{
    const {code, language,input=""}= req.body;
    if(code === undefined){
        return res.json({success:false,message:"Empty code! Can't be executed"});
    }

    const {filepath,inputstringPath}= createFile(language,code,input);
    try{
        
        let op
        switch(language){
        case "cpp":
            op= await cppExecute(filepath,inputstringPath);
            break;

        case "python":
            op= await pythonExecute(filepath,inputstringPath);
            break;

        default:
           op= await cppExecute(filepath,inputstringPath); 
        }

        fs.unlinkSync(filepath);   //delete output file after use
        fs.unlinkSync(inputstringPath);   //delete input file after use

        res.json({success:true,output:{stdout: op.stdout, executionTime: op.estTime}})
    }
    catch(err){
        console.error(err)
        let cleanError= err.stderr || "Unknown error during execution!";
        cleanError= cleanError.replace(/.*[\\\/]([a-zA-Z0-9_-]+\.cpp)/g, '$1');// to remove the filepath for c++ related errors
        cleanError = cleanError.replace(/File ".*[\\\/]([a-zA-Z0-9_-]+\.py)"/g, 'File "$1"');// to remove the filepath for python related errors
        res.json({success:false,error: cleanError});
    }
})

app.listen("5000",()=>{
    console.log("Compiler server running on port 5000!");
})