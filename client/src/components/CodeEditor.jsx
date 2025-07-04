import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism.css";
import { useProblem } from "../context/ProblemContext.js";
import {Play, Send } from "lucide-react";

const CodeEditor= ()=>{
  const {code, setCode, isRunning, clickRun}= useProblem();

    return(
        <div className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">

          <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-tl from-purple-600 to-indigo-600 text-white">
           <h3 className="text-lg font-bold">Code Editor</h3>

           <div className="flex gap-2.5">
             <button className={`flex items-center gap-1 px-3 py-1 rounded-md border border-white/20 text-sm font-medium transition 
            ${isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"}`}
              onClick={clickRun}
              disabled={isRunning}>
               <Play className="w-4 h-4" />
               Run
             </button>

             <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-white text-purple-700 font-semibold text-sm shadow hover:bg-gray-100">
               <Send className="w-4 h-4"/>
               Submit
             </button>
           </div>
          </div>

          {/*code editor from react */}
          <div className="p-2 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            <Editor value={code}
            onValueChange={setCode}
            highlight={(code)=>{ 
                try{
                return Prism.highlight(code,Prism.languages.cpp,"cpp")
                }catch(err){
                  console.error("Prism highlight error:", err);
                  return code; //return  the plain text if highlight fails
                }
            }}
            padding={16}
            style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "transparent",
            color: "white",
            }}
            className="rounded-md outline-none min-h-[300px]"
            />
          </div>
        </div>
    )
}
export default CodeEditor;