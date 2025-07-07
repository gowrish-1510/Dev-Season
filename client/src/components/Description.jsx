import React from "react";
import { useProblem } from "../context/ProblemContext";
import { BadgeCheck, FileText, Book, Sparkles } from "lucide-react";
import axios from "axios";
import Modal from "react-modal";
import { useState } from "react";

const Description = () => {
  const { problem, testCases, isRunning, setIsRunning } = useProblem();
  const [isAiExplanationOpen, setIsAiExplanationOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

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

  const onExplanation = async () => {  //function for fetching ai explanation of problem
    setIsRunning(true);
    setLoadingExplanation(true);
    setIsAiExplanationOpen(true);
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/testcases`, {
        input1: testCases[0].input,
        output1: testCases[0].output,
        input2: testCases[1].input,
        output2: testCases[1].output,
        problem: problem.description,
      }, { withCredentials: true });

      if (result.data.success) {
        setAiExplanation(
          `Description: ${result.data.answer.description}\n\n` +
          `Test Case 1: ${result.data.answer.explanation1}\n\n` +
          `Test Case 2: ${result.data.answer.explanation2}`
        );
      }

      else {
        setAiExplanation("Unable to fetch explanation. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setAiExplanation("Error fetching AI explanation.");
    }

    finally {
      setIsRunning(false);
      setLoadingExplanation(false);
    }
  }

  return (
    <div className="space-y-8 pt-5">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl text-shadow-xs text-shadow-indigo-400 font-bold text-purple-300">{problem.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-md font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            <p className="text-sm text-purple-400">Contributed by: {problem.author.username}</p>
          </div>

          <button
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600  to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium
          ${isRunning ? `cursor-not-allowed bg-purple-200` : ``}`
            }
            disabled={isRunning}
            onClick={onExplanation}
          >
            <Sparkles className="w-4 h-4" />
            AI Explanation
          </button>
        </div>
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
        {testCases.slice(0, 2).map((testcase, index) => (
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

      {/* Modal for the AI Explanation */}
      <Modal
        isOpen={isAiExplanationOpen}
        onRequestClose={() => setIsAiExplanationOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold">AI Explanation</h2>
              </div>
              <button
                onClick={() => setIsAiExplanationOpen(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            {loadingExplanation ? (
              <p className="text-gray-700">Generating explanation...</p>
            ) : (
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-purple-700">AI Description</h3>
                  <p className="text-gray-700 mt-2">{aiExplanation.split("Test Case 1:")[0].replace("Description: ", "").trim()}</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <h4 className="text-md font-medium text-purple-700 mb-1">Test Case 1 Explanation</h4>
                  <code className="block whitespace-pre-wrap text-gray-800">{aiExplanation.match(/Test Case 1:(.*?)Test Case 2:/s)?.[1]?.trim() || "Not available"}</code>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <h4 className="text-md font-medium text-purple-700 mb-1">Test Case 2 Explanation</h4>
                  <code className="block whitespace-pre-wrap text-gray-800">{aiExplanation.split("Test Case 2:")[1]?.trim() || "Not available"}</code>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end p-6 border-t border-purple-100">
            <button
              onClick={() => setIsAiExplanationOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Description;