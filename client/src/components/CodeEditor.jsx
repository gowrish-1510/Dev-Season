import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useProblem } from "../context/ProblemContext.js";
import { Play, Send, ChevronDown, Lightbulb } from "lucide-react";
import Modal from "react-modal";
import axios from "axios";
import { useLocation } from "react-router-dom";

Modal.setAppElement("#root");

const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
};

const CodeEditor = () => {
  const { code, setCode, isRunning, clickRun, submit, language, setLanguage, problem, setIsRunning } = useProblem();
  const location= useLocation();

  const cppBoilerPlate = problem?.displayFunctions?.["cpp"] || `#include <bits/stdc++.h>
using namespace std;

int main() {
  // Write your code here
  return 0;
}
`;

  const pythonBoilerPlate = problem?.displayFunctions?.["python"] || `print("Hello World!")\n## Write your code here`;

  const languages = [
    { value: "cpp", label: "C++", monacoLang: "cpp" },
    { value: "python", label: "Python", monacoLang: "python" }
  ];

  const [isHintOpen, setIsHintOpen] = useState(false);
  const [aiHintResult, setAiHintResult] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [codeCache, setCodeCache] = useState({});
  const editorRef = useRef();

  //  Load code from Redis or fallback
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cache/code/${problem._id}`,
          {
            params: { language },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setCode(res.data.code);
          setCodeCache((prev) => ({ ...prev, [language]: res.data.code }));
        } else if (codeCache[language]) {
          setCode(codeCache[language]);
        } else {
          setCode(language === "cpp" ? cppBoilerPlate : pythonBoilerPlate);
        }
      } catch (err) {
        console.error("Error fetching cached code!");
        if (codeCache[language]) {
          setCode(codeCache[language]);
        } else {
          setCode(language === "cpp" ? cppBoilerPlate : pythonBoilerPlate);
        }
      }
    };

    if (problem?._id && language) fetchCode();
  }, [language]);

  const lastSavedCodeRef = useRef("");

 // Debounced auto-save code
  useEffect(() => {
    if (!problem?._id || !language) return;

    const saveCode = async () => {
      const currentCode = editorRef.current?.getValue?.() || code;
      if (currentCode && currentCode !== lastSavedCodeRef.current) {
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/cache/code/${problem._id}`,
            {
              code: currentCode,
              language,
            },
            { withCredentials: true }
          );
          lastSavedCodeRef.current = currentCode;
          setCodeCache((prev) => ({ ...prev, [language]: currentCode }));
        } catch (err) {
          console.error("Error saving code to cache:", err);
        }
      }
    };

    const debouncedSaveCode = debounce(saveCode, 3000); // Save 2 seconds after typing stops

    debouncedSaveCode();

    return () => {
      debouncedSaveCode.cancel(); // Cancel pending debounced calls on cleanup
    };
  }, [code, problem?._id, language]);


    //  Handle language switch and save old code
  const onLangChange = async (e) => {
    const newLang = e.target.value;
    const currentCode = editorRef.current?.getValue?.() || code;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cache/code/${problem._id}`,
        {
          code: currentCode,
          language,
        },
        { withCredentials: true }
      );
      setCodeCache((prev) => ({ ...prev, [language]: currentCode }));
    } catch (err) {
      console.error("Error saving code to cache!");
    }

    setLanguage(newLang);
  };


  const giveHint = async () => {
    setLoadingHint(true);
    setIsHintOpen(true);
    setIsRunning(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/hints`, {
        problem: problem.description,
        code,
        language,
      }, { withCredentials: true });
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
            <select
              value={language}
              onChange={onLangChange}
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
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition 
            ${isRunning ? "bg-purple-100/30 text-purple-400 cursor-not-allowed border border-purple-300/30" : "bg-white text-purple-700 hover:bg-gray-100 shadow"}`}
            disabled={isRunning}
            onClick={submit}
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
          <button
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
        className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
        style={{ height: "400px", overflowY: "auto", position: "relative" }}
      >
        <style>
          {`
            .monaco-editor,
            .monaco-editor-background,
            .monaco-editor .margin {
              background: transparent !important;
            }
          `}
        </style>
        <Editor
          height="100%"
          language={languages.find((lang) => lang.value === language)?.monacoLang || "cpp"}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            lineNumbers: "on",
            fontSize: 14,
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderLineHighlight: "none",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
            },
          }}
          onMount={(editor, monaco) => {
            const editorElement = editor.getDomNode();
            if (editorElement) {
              editorElement.style.background = "transparent";
              const computedStyle = window.getComputedStyle(editorElement);
            }
          }}
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
                {aiHintResult.hint && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-purple-700">Hint</h3>
                    <p className="text-gray-700 mt-2">{aiHintResult.hint}</p>
                  </div>
                )}
                {aiHintResult.Mistakecategory && (
                  <div className="bg-purple-100 border border-purple-300 rounded px-3 py-2 inline-block font-medium text-purple-700">
                    {aiHintResult.Mistakecategory}
                  </div>
                )}
                {aiHintResult.codesnippet && (
                  <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg overflow-x-auto border border-gray-700">
                    <pre className="whitespace-pre-wrap">{aiHintResult.codesnippet}</pre>
                  </div>
                )}
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