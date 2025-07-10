import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import { useProblem } from "../context/ProblemContext.js";
import { Play, Send, ChevronDown, Lightbulb } from "lucide-react";
import Modal from "react-modal";
import axios from "axios";

// Bind modal to app root for accessibility
Modal.setAppElement("#root");

const CodeEditor = () => {

  const { code, setCode, isRunning, clickRun, submit, language, setLanguage, problem, setIsRunning } = useProblem();

  const cppBoilerPlate = (problem?.displayFunctions?.["cpp"]) || `#include<bits/stdc++.h>
    using namespace std;
    int main(){

    //Write your code here
    return 0;
   }`;

  const pythonBoilerPlate = (problem?.displayFunctions?.["python"]) ||  `print("Hello World!")
   ##Write your code here`;

  const languages = [
    { value: "cpp", label: "C++", prismLang: "cpp" },
    { value: "python", label: "Python", prismLang: "python" }
  ];

  const [isHintOpen, setIsHintOpen] = useState(false);
  const [aiHintResult, setAiHintResult] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    if (language === "cpp") {
      setCode(cppBoilerPlate);
    }

    else if (language === "python") {
      setCode(pythonBoilerPlate);
    }
  }, [language, setCode]);

  const getPrismLanguage = (lang) => {
    const langMap = { cpp: "cpp", python: "python" };
    return langMap[lang] || "clike";
  };

  const giveHint = async () => {  //function for fetching the hints from AI

    setLoadingHint(true);
    setIsHintOpen(true); // Open modal immediately to show "Generating hint..."
    setIsRunning(true);
    console.log("Fetching hint for:", { problem: problem.description, code, language });

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/hints`, {
        problem: problem.description,
        code,
        language,
      }, { withCredentials: true });

      console.log("API Response:", res.data);
      if (res.data.success) {
        setAiHintResult(res.data.result);
      } else {
        setAiHintResult({ error: "Unable to get hint. Try again." });
      }
    } catch (err) {
      console.error("Error fetching AI hint:", err);
      setAiHintResult({ error: "Error fetching AI hint." });
    } finally {
      setLoadingHint(false);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-tl from-purple-600 to-indigo-600 text-white">
        <h3 className="text-lg font-bold">Code Editor</h3>
        <div className="flex gap-2.5">

          <div className="relative">
            <select value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
            className={`flex items-center gap-1 px-3 py-1 rounded-md border border-white/20 text-sm font-medium 
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

          <button  // button for AI hints
            className={`flex items-center gap-1 px-3 py-1 rounded-md border border-yellow-500 text-yellow-600 font-medium bg-yellow-50 hover:bg-yellow-100`}
            onClick={giveHint}
            disabled={isRunning}
          >
            <Lightbulb className="w-4 h-4" />
            Ai Hint
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
              return Prism.highlight(code, Prism.languages[getPrismLanguage(language)], getPrismLanguage(language));
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

      <Modal
        isOpen={isHintOpen}
        onRequestClose={() => setIsHintOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-[1000]"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6" />
                <h2 className="text-xl font-bold">AI Code Hint</h2>
              </div>
              <button
                onClick={() => setIsHintOpen(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {loadingHint ? (
              <p className="text-gray-700">Generating hint...</p>
            ) : !aiHintResult ? (
              <p className="text-gray-700">Waiting for hint...</p>
            ) : aiHintResult.error ? (
              <p className="text-red-600">{aiHintResult.error}</p>
            ) : (
              <>
                {/* if hint is returned */}
                {aiHintResult.hint && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-purple-700">Hint</h3>
                    <p className="text-gray-700 mt-2">{aiHintResult.hint}</p>
                  </div>
                )}

                {/* If mistake category */}
                {aiHintResult.Mistakecategory && (
                  <div className="bg-purple-100 border border-purple-300 rounded px-3 py-2 inline-block font-medium text-purple-700">
                    {aiHintResult.Mistakecategory}
                  </div>
                )}

                {/* Code snippet of incorrrect code*/}
                {aiHintResult.codesnippet && (
                  <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg overflow-x-auto border border-gray-700">
                    <pre className="whitespace-pre-wrap">{aiHintResult.codesnippet}</pre>
                  </div>
                )}

                {/* If optimization suggestion */}
                {aiHintResult.suggestion && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-green-700">Optimization Suggestion</h3>
                    <p className="text-gray-700 mt-2">{aiHintResult.suggestion}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end p-6 border-t border-purple-100">
            <button
              onClick={() => setIsHintOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default CodeEditor;