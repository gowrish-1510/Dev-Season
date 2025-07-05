import React, { useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import { useProblem } from "../context/ProblemContext.js";
import { Play, Send, ChevronDown } from "lucide-react";

const CodeEditor = () => {
  const cppBoilerPlate= `#include<bits/stdc++.h>
    using namespace std;
    int main(){

    //Write your code here
    return 0;
   }`;

  const pythonBoilerPlate= `print("Hello World!")
   ##Write your code here`;

  const languages = [
    { value: "cpp", label: "C++", prismLang: "cpp" },
    { value: "python", label: "Python", prismLang: "python" }
  ];
  
  const { code, setCode, isRunning, clickRun, submit, language, setLanguage } = useProblem();

  useEffect(()=>{
    if(language==="cpp"){
      setCode(cppBoilerPlate);
    }

    else if(language==="python"){
      setCode(pythonBoilerPlate);
    }
  },[language,setCode])

  return (
    <div className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-tl from-purple-600 to-indigo-600 text-white">
        <h3 className="text-lg font-bold">Code Editor</h3>
        <div className="flex gap-2.5">

          <div className="relative">
           <select value={language}
           onChange={(e)=>setLanguage(e.target.value)}
           className="appearance-none bg-white/20 border border-white/30 rounded-md px-3 py-1 pr-8 text-sm font-medium text-white cursor-pointer hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-black text-white">
                  {lang.label}
                </option>
              ))}
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none z-10" />
            </select>
          </div>

          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md border border-white/20 text-sm font-medium transition 
            ${isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"}`}
            onClick={clickRun}
            disabled={isRunning}
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition 
            ${isRunning ? "bg-purple-100/30 text-purple-400 cursor-not-allowed border border-purple-300/30" : "bg-white text-purple-700 hover:bg-gray-100 shadow"}`}
          disabled={isRunning}
          onClick={submit}>
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      <div
        className="p-2 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
        style={{ height: "400px", overflowY: "auto" }} 
      >
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => {
            try {
              return Prism.highlight(code, Prism.languages[language],language);
            } catch (err) {
              console.error("Prism highlight error:", err);
              return code; // Return plain text if highlight fails
            }
          }}
          padding={16}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "transparent",
            color: "white",
            minHeight: "100%", // Ensure editor fills container height
          }}
          className="rounded-md outline-none"
        />
      </div>
    </div>
  );
};

export default CodeEditor;