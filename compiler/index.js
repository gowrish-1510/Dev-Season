import express from 'express'
import { createFile } from './generateFile.js';
import cppExecute from './executeCpp.js';
import pythonExecute from './executePython.js';
import fs from 'fs'

const app= express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const formatCompilerError = (errorString) => {
    if (!errorString || typeof errorString !== 'string') {
        return "Unknown compilation error occurred";
    }
    // Replace UUID filenames with generic names
    let cleanError = errorString.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.cpp/g, 'main.cpp');
    cleanError = cleanError.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.py/g, 'main.py');
    cleanError = cleanError.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(out|txt)/g, 'main.$1');
    cleanError = cleanError.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, '[id]');
    
    // Removing full file paths
    cleanError = cleanError.replace(/.*[\\\/]([^\\\/]+\.(cpp|py|out|txt))/g, '$1');
    
    // For C++ errors, extracting line number and error description
    const cppErrorMatch = cleanError.match(/main\.cpp:(\d+):(\d+):\s*error:\s*(.+)/);
    if (cppErrorMatch) {
        const [, line, column, description] = cppErrorMatch;
        return `SyntaxError: Line ${line}, Column ${column}: ${description.trim()}`;
    }
    
    // For Python errors
    const pythonErrorMatch = cleanError.match(/File "main\.py", line (\d+).*\n.*\n(.+Error.+)/);
    if (pythonErrorMatch) {
        const [, line, description] = pythonErrorMatch;
        return `SyntaxError : Line ${line}: ${description.trim()}`;
    }
    
    // Handle runtime errors
    if (cleanError.includes('Command failed') || cleanError.includes('main.out') || cleanError.includes('main.txt')) {
        return "ExecutionError: Failed to run the program. Please check for runtime issues (e.g., invalid input, segmentation faults, or unhandled exceptions).";
    }
    
    return cleanError.trim();
};

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
        console.error("Compilation/Execution Error:", err);
        
        // Clean up files even on error
        try {
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            if (fs.existsSync(inputstringPath)) fs.unlinkSync(inputstringPath);
        } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
        }
        
        const rawError = err.stderr || err.error || "Unknown error during execution!";
        const cleanError = formatCompilerError(rawError.toString());
        
        res.json({success: false, error: cleanError});
    }
})

app.listen("5000",()=>{
    console.log("Compiler server running on port 5000!");
})