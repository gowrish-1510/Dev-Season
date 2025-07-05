import React, { useEffect, useState, createContext, useContext } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { ProblemContext } from "../context/ProblemContext.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Play } from "lucide-react";

const ProblemSolve = () => {

  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const cppBoilerPlate= `#include<bits/stdc++.h>
    using namespace std;
    int main(){

    //Write your code here
    return 0;
   }`;

  const [code, setCode] = useState(cppBoilerPlate);

  const [language,setLanguage]= useState("cpp");
  const [activeTab, setActiveTab] = useState("description");
  const [problem, setProblem] = useState();
  const [testCases, setTestCases] = useState([]);
  const [isloading, setisLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [op,setOp]= useState("");

  const tabs = [
    { value: "description", label: "Description", path: "" },
    { value: "submissions", label: "Submissions", path: "submission" },
    { value: "discussions", label: "Discussions", path: "discussion" }
  ]

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/${id}`);

        if (result.data.success) {
          console.log("Problems recieved successfully: ", result.data.problem);
          setProblem(result.data.problem);
          setTestCases(result.data.sampleTestCases);
          setisLoading(false);
        }

        else {
          toast.error(result.data.message, {
            transition: Bounce,
            theme: "light",
          });

          setisLoading(false);
          setTimeout(() => {
            useNavigate("/problems")
          }, 3000);
        }

      } catch (err) {
        console.error("Error from server: ", err);
        setisLoading(false);
        toast.error("Server side Error loading problem!", {
          transition: Bounce,
          theme: "light",
        });
      }
    }

    fetchProblem();
  }, []);

  
  const submit = async () => {  //handling submit functionality

    setIsRunning(true);
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/problem/${id}/submit`,
        {
          code,
          language: language,
        },
        { withCredentials: true }
      );

      setIsRunning(false);
      if (result.data.success) {
        toast.success("Submission Accepted! All test cases passed.", {
          theme: "colored",
          transition: Bounce,
        });
      } else {
        const failedTest = result.data.results.find((r) => !r.passed);  //finding the failed test case
        let errorMessage = result.data.message || "Submission failed.";
        if (failedTest) {
          errorMessage = failedTest.message || `Failed on test case ${failedTest.test}.`;
        }
        toast.error(errorMessage, {
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      setIsRunning(false);
      toast.error(err.message || "Server error during submission", {
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const clickRun = async () => {  //handling normal run
    setIsRunning(true);
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problem/${id}/run`, {
        code,
        language: language,
      }, { withCredentials: true });

      if (result.data.success) {   //both example test case have passed
        setIsRunning(false);
        toast.success("Both Sample Test Cases Passed!", {
          theme: "light",
          transition: Bounce,
        })
      }
      else {
        setIsRunning(false);
        toast.error(result.data.message, {  // error in some example test case maybe
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error("Error while Running: ", err);
      toast.error(result.data.message, {  // error from server side
        theme: "light",
        transition: Bounce,
      });
    }
  }

  const customrun = async () => {
    setIsRunning(true);
    try{
    const op = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problem/${id}/custom`, {
      code,
      language: language,
      input: customInput.trim(),
    },{withCredentials:true});

    setIsRunning(false);
    if (op.data.success) {
      setOp(op.data.output.stdout);
      toast.success("Output got successfully!",{
        theme: "colored",
        transition: Bounce,
      })
    }

    else{
      setOp("");
      toast.error(op.data.message,{
        theme:"light",
        transition:Bounce,
      })
    }
  }catch(err){
    setIsRunning(false);
      toast.error("Invalid Input",{
        theme:"light",
        transition:Bounce,
      });
  }
  }

  if (isloading)
    return <div>Loading...</div>

  return (
    <ProblemContext.Provider value={{ problem, testCases, code, setCode, isRunning, clickRun, submit,language,setLanguage }}>
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-8 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to bg-slate-900">
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

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4">
          <div className="bg-purple-100/50 rounded-lg p-1 flex justify-around items-center gap-1 border-purple-200">
            {tabs.map((tab, index) => (
              <NavLink
                key={index}
                onClick={() => setActiveTab(tab.value)}
                to={tab.path}
                end={tab.path === ""}
                className={({ isActive }) => isActive ?
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-2xl" :
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-purple-700 hover:text-purple-900 hover:bg-purple-50"}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          <Outlet />  {/* The child routes are rendered here */}
        </div>

        {/* Code editor component */}
        <div className="flex flex-col gap-5">
          <div>
            <CodeEditor />
          </div>


          {/* the custom input form */}
          <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md shadow-md mb-4 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-md">
              <Play className="w-4 h-4" />
              <h3 className="text-base font-semibold">Custom Input</h3>
            </div>

            <div className="p-4 space-y-3">
              <textarea value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full min-h-[100px] font-mono text-sm bg-white/10 border border-purple-500/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-gray-100"
                placeholder="Enter your custom input here..."
              />
              <div className="flex justify-between gap-1.5">  {/* Div for the button and op text */}
                <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition 
       ${isRunning || !customInput.trim() ? "bg-purple-400/30 text-purple-200 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                 onClick={customrun}
                  disabled={isRunning || !customInput.trim()}>
                  <Play className="w-4 h-4" />
                  Run with Custom Input
                </button>

                {op.trim()? <h2 className="text-white">Output: {op}</h2>:<div></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProblemContext.Provider>
  )
}

export default ProblemSolve;