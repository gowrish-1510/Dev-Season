import React from "react";
import { useProblem } from "../context/ProblemContext";
import { BadgeCheck, FileText, Book } from "lucide-react";

const Description= ()=>{
    const { problem, testCases }= useProblem();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return(
    <div className="space-y-8 pt-5">
     <div className="space-y-2">

        <div className="flex items-center gap-3">
          <h1 className="text-2xl text-shadow-xs text-shadow-indigo-400 font-bold text-purple-300">{problem.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-md font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-sm text-purple-400">Contributed by: {problem.author.username}</p>
     </div>

    {/*  Description of the problem */}
     <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md rounded-lg shadow-md ">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-md text-white">
        <FileText className="w-4 h-4" />
        <h2 className="text-base font-semibold">Problem Description</h2>
      </div>
      <div className="px-4 py-3 text-gray-200 leading-relaxed">
        {problem.description}
      </div>  
     </div>

     {/* Test cases for the problem */}
     <div>
       {testCases.slice(0,2).map((testcase,index)=>(
        <div key={index} className="border border-purple-500/20 bg-white/5 backdrop-blur-md shadow-md rounded-lg mb-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-md text-white">
            <Book className="w-4 h-4" />
            <h3 className="text-base font-semibold">Example {index + 1}</h3>
           </div>
           <div className="px-4 py-3 space-y-2">
              <div>
              <span className="font-semibold text-purple-300">Input: </span>
              <br></br>
              <code className="bg-purple-900/30 px-1 py-1 rounded text-purple-200 whitespace-pre-wrap">{testcase.input}</code>
              </div>

              <div>
              <span className="font-semibold text-purple-300">Output: </span>
              <br></br>
              <code className="bg-purple-900/30 px-1 py-1 rounded text-purple-200 whitespace-pre-wrap">{testcase.output}</code>
              </div>
           </div>
        </div>
       ))}
     </div>
    </div>
  )
}

export default Description;