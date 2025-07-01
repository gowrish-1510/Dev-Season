import React, { useEffect, useState } from "react";
import ProblemDiff from "../components/ProblemDiff.jsx";
import ProblemCategory from "../components/ProblemCategory.jsx";
import { Heading1, Plus, Trash2 } from 'lucide-react';
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProblemSubmission= ()=>{
    const categories = ["Tree", "Dynamic Programming", "Array", "Graphs", "Stack", "Queue", "String", "Linked List"];
    const navigate= useNavigate();
    const { isAuthenticated, loading }= useAuth();

    console.log("status of isAutenticated:",isAuthenticated);

    const [newProblem,setNewProblem]= useState({
      title: "",
      description: "",
      difficulty:"",
      category:"",
      testcases:[{input:"",output:""}]
    });

    const [contributors,setContributors]= useState([]);

    useEffect(() => {
        if (loading) return;
        
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    useEffect(()=>{
      const fetchContributors= async()=>{
        try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/contributors`);

        if(res.data.success){
          setContributors(res.data.contributors);
        }

        else{
          console.log("No contributors found!");
        }

      }catch(err){
        console.error(err);
      }
      }

      fetchContributors();
    },[])


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/problem/create`,
      newProblem,
      { withCredentials: true }
    );

    if (res.data.success) {
      setNewProblem({
        title: '',
        description: '',
        difficulty: '',
        category: '',
        testcases: [{ input: '', output: '' }],
      });
      toast.success('Problem successfully submitted! Thanks for your contribution ❤️', {
        theme: 'light',
        transition: Bounce,
      });
    } else {
      toast.error(res.data.message || 'Failed to submit problem.', {
        theme: 'light',
        transition: Bounce,
      });
    }
  } catch (error) {
    console.error('Error submitting problem:', error);
    toast.error(
      error.response?.data?.message || 'An error occurred while submitting the problem.',
      {
        theme: 'light',
        transition: Bounce,
      }
    );
  }
};


  const addTestCase = () => {  //push new item of {input,output} into the newProblem 
    setNewProblem(prev => ({
      ...prev,
      testcases: [...prev.testcases, { input: '', output: '' }]
    }));
  };


  const removeTestCase = (index) => {
    setNewProblem(prev => ({
      ...prev,
      testcases: prev.testcases.filter((_, i) => i !== index)
    }));
  };

  const updateTestCase = (index, field, value) => {
    setNewProblem(prev => ({
      ...prev,
      testcases: prev.testcases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      )
    }));
  };

  if(loading)
    return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative flex justify-center">
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `linear-gradient(
            to bottom right,
            rgba(15, 23, 42, 0.6),
            rgba(88, 28, 120, 0.7),
            rgba(15, 23, 42, 0.7)
          ), url('/code_bg.jpg')`,
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Form for submission */}
        <div className="flex-1 bg-white/10 backdrop-blur-sm border border-sky-500 rounded-lg shadow-xl hover:shadow-sky-50/20 p-6">
        <h2 className="text-3xl font-serif bg-gradient-to-r rounded-2xl text-black from-cyan-300 to-amber-400 mb-4 text-center">
                        Share Your Challenge, Inspire the Community!
         </h2>
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Create New Problem
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Title</label>
              <input
                type="text"
                value={newProblem.title}
                onChange={(e) =>
                  setNewProblem((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter problem title"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Description</label>
              <textarea
                value={newProblem.description}
                onChange={(e) =>
                  setNewProblem((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter problem description"
                rows={5}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-vertical"
                required
              />
            </div>

            {/* Category selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Difficulty</label>
                <ProblemDiff
                  difficultyFilter={newProblem.difficulty}
                  setDifficultyFilter={(value) =>
                    setNewProblem((prev) => ({ ...prev, difficulty: value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Category</label>
                <ProblemCategory
                  categoryFilter={newProblem.category}
                  setCategoryFilter={(value) =>
                    setNewProblem((prev) => ({ ...prev, category: value }))
                  }
                  categories={categories}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg">Test Cases</h3>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-md transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Test Case
                </button>
              </div>

              {newProblem.testcases.map((tc, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">Test Case {index + 1}</h4>
                  {newProblem.testcases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(index, "input", e.target.value)}
                        placeholder="Enter input"
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-vertical"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Expected Output</label>
                      <textarea
                        value={tc.output}
                        onChange={(e) => updateTestCase(index, "output", e.target.value)}
                        placeholder="Enter expected output"
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-vertical"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-md transition-all duration-200"
            >
              Submit Problem
            </button>
          </form>
        </div>
      </div>
        {contributors.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl p-6 flex-shrink-0 w-full lg:w-80">
           <h1 className="text-2xl font-bold text-white mb-4 text-center">🌟 Top Contributors</h1>
          <ul className="space-y-3 ">
            {contributors.map((contributor, index) => (
              <li key={index} className="flex justify-between text-white bg-white/10 px-3 py-2 rounded-md hover:scale-105  hover-shadow-lg hover:shadow-sky-500/50 transition-all duration-300 cursor-pointer">
                <span className="font-medium hover:">{contributor.username}</span>
                <span className="text-amber-400">+{contributor.problemCount}</span>
              </li>
            ))}
          </ul>
           <p className="mt-4 text-2xl text-gray-300 text-center hover:scale-105 transition-all duration-300">Thanks for making our problem set better ❤️</p>
          </div>
        ):(<h1>No contribution yet</h1>)}
    </div>
  );
};

export default ProblemSubmission;