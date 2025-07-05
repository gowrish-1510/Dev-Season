import React, { useEffect, useState } from "react";
import { Search,ArrowLeft, ArrowRight,Trash2 } from "lucide-react";
import SelectDiff from "../components/SelectDiff.jsx";
import { Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const Problem = () => {
  
  const { isAuthenticated, user }= useAuth();

  const categories = ["All", "Dynamic Programming", "Array", "Graphs", "Stack", "Queue", "String", "Linked List"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [problems, setProblems] = useState([]);
  const [displayProblems, setDisplayProblems] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  //for pagination
  const problemsPerPage = 6;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problem/all`);

        if (res.data.success) {
          setProblems(res.data.problems);
          setDisplayProblems(res.data.problems);
          console.log(problems)
        }

        else {
          toast.error(res.data.message, {
            transition: Bounce,
            theme: "light",
          });
        }
      } catch (err) {
        console.error("Server error: ", err);
      }
    }

    fetchProblems();
  }, []);

  useEffect(() => {
    let filtered = problems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(problem => problem.category === selectedCategory);
    }

    if (difficultyFilter !== "All") {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    if (searchString != "") {
      filtered = filtered.filter(problem => problem.title.toLowerCase().includes(searchString.toLowerCase()) === true)

    }
    const startIndex = (currentPage - 1) * problemsPerPage; //start index calc for pagination
    const endIndex = startIndex + problemsPerPage;

    setDisplayProblems(filtered.slice(startIndex, endIndex));
  }, [selectedCategory, difficultyFilter, problems, searchString, currentPage]);

  useEffect(() => {  //make the page no as 1 when search/query is made
    setCurrentPage(1);
  }, [selectedCategory, difficultyFilter, searchString]);


  const returnTotalPages = () => {  //function for handling pagination with query included. Here I calculate total no of pages with filtered problems
    const filteredProblems = problems.filter(problem => {
      return (problem.category === selectedCategory || selectedCategory === "All") &&
        (difficultyFilter === "All" || problem.difficulty === difficultyFilter) &&
        (searchString === "" || problem.title.toLowerCase().includes(searchString.toLowerCase()))
    })

    return Math.ceil(filteredProblems.length / problemsPerPage);
  }

  const deleteProblem= async (id)=>{  //
     try{

       const outcome= await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/problem/delete/${id}`,
        {withCredentials:true});

        if(outcome.data.success){
          toast.success(outcome.data.message,{
            theme:"dark",
            transition:Bounce,
          });

          setProblems((prev) => (prev.filter((problem)=> problem._id !== id)));
          setDisplayProblems((prev) => prev.filter((problem) => problem._id !== id));
        }else{
          toast.error(outcome.data.message,{
            theme:"dark",
            transition:Bounce, 
          });
        }
     }catch(err){
       console.error("Some error from server side: ",err);
          toast.error("Failed to delete Problem",{
            theme:"dark",
            transition:Bounce, 
          });   
     }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
      <div className="container mx-auto px-4 py-8 relative z-10 ">
        {/* header and para centered here */}
        <div className="flex-1 flex flex-col items-center md:items-center text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-amber-400 bg-clip-text text-transparent ">
            Practice Problems
          </h1>
          <p className="text-amber-500 text-lg max-w-md">
            Solve challenges and improve your coding skills
          </p>
        </div>
      </div>
      <div className="mb-6 relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search problems..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="w-full pl-10 px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-200 transition-all duration-200"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-12 mb-6 relative mt-10">
        {categories.map((category, index) => (
          <button key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-blue-300
                ${category === selectedCategory ? "bg-gray-800/80 border border-cyan-400/40 text-cyan-200 hover:bg-gray-700/80 hover:border-cyan-500 hover:text-cyan-100"
                : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-cyan-600 hover:text-rose-400 hover:shadow-indigo-600/40"
              } `

            }>{category}</button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-8 relative mt-12">
        <SelectDiff
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
        />
      </div>

      <div className=" space-y-2 max-w-4xl mx-auto">
        {displayProblems.map((problem, index) => (
          <div key={problem._id}
            className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-lg p-6 hover:shadow-cyan-100/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors duration-200">
                    {problem.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-purple-400 text-sm font-medium rounded-3xl border px-2 py-1 text-center">{problem.category}</span>
                </div>
              </div>
              <div className="ml-4 flex gap-2.5">
                <Link to={`/problems/${problem._id}`}>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02]">
                    Solve
                  </button>
                </Link>
                {isAuthenticated && user.role==='admin'?   //if user is admin then only he can see the delete button
                  <div className="flex justify-center items-center">
                  <button
                    type="button"
                    className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 transform hover:scale-[1.02]"
                    onClick={()=> deleteProblem(problem._id)}
                  >
                        <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
                   : <></>}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Buttons for Prev and Next*/}
      <div className="flex justify-center items-center gap-4 mt-8 z-50 relative">
        <div className="flex justify-between gap-2">
          <ArrowLeft color="white" className="mt-2.5 relative left-8 "/>
          <button className={`px-6 py-2 rounded-md text-white text-right ${currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"}`}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}   // ensuring current page doesnt fall below 1
          disabled={currentPage === 1} //ensuring button is disabled after current page is set to 1
        >
           Prev
          </button>
         </div>

        <span className="text-amber-700 font-medium">Page {currentPage} of {returnTotalPages()}</span>

        <div className="flex justify-between gap-2">
          <button className={`px-6 py-2 rounded-md text-white text-left ${currentPage === returnTotalPages() ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"}`}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, returnTotalPages()))} // ensuring current page doesnt increase above totalPages
          disabled={currentPage === returnTotalPages()}
          >
          Next
          </button>
          <ArrowRight color="white" className="mt-2.5 relative right-8"/>
        </div>

      </div>

    </div>
  );
};

export default Problem;