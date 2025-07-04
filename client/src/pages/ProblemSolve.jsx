import React, { useEffect, useState, createContext, useContext } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { ProblemContext } from "../context/ProblemContext.js";
import { useAuth } from "../context/AuthContext.jsx";

const ProblemSolve = () => {

  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState(`#include<bits/stdc++>
    using namespace std;
    int main(){
    //write your code here
   }`)

  const [activeTab, setActiveTab] = useState("description");
  const [problem, setProblem] = useState();
  const [testCases, setTestCases] = useState([]);
  const [isloading, setisLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

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
  }, [])

  const clickRun = async () => {
    setIsRunning(true);
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problem/${id}/run`, {
        code,
        language: 'cpp',
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
      console.error("Error while Running: ",err);
      toast.error(result.data.message, {  // error from server side
          theme: "light",
          transition: Bounce,
        });
    }
  }

  if (isloading)
    return <div>Loading...</div>

  return (
    <ProblemContext.Provider value={{ problem, testCases, code, setCode, isRunning,clickRun }}>
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
        <div>
          <CodeEditor />
        </div>
      </div>
    </ProblemContext.Provider>
  )
}

export default ProblemSolve;