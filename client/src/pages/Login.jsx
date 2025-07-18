import React, { useEffect, useState } from "react";
import { Code, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { NavLink} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  let navigate= useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { loginUser, loading, isAuthenticated } = useAuth();

  useEffect(()=>{
    if(!loading && isAuthenticated){
       navigate("/dashboard", { replace: true });
    }

    toast.info("Please Login to continue",{
      transition:Bounce,
      theme:'dark'
    })

  const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 200);
    return () => clearTimeout(timer);
  },[isAuthenticated, loading, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try{
    const result= await loginUser(email,password);

    if(result.success){
       setIsLoading(false);
       const userid= result.user._id; 
       setEmail("");
       setPassword("");

       toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
       
      setTimeout(() => {
        navigate(`/dashboard/`);
      }, 3000);
  

    }

    else{
     setIsLoading(false);   
     toast.error(result.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
     });
    }}
    catch(err){
          setIsLoading(false);
          toast.error(err.response?.data?.message || "Login failed(catch)");
    }

  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-10 flex items-center justify-center p-4 b">
      {/* Background pattern */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `linear-gradient(
            to bottom right,
            rgba(15, 23, 42, 0.6),
            rgba(88, 28, 120, 0.7),
            rgba(15, 23, 42, 0.7)
          ), url('/code_bg.jpg')`
        }}
      ></div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
       />

      <div className="relative z-10 w-full max-w-md">
        {/* Header with logo */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ease-out ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-amber-400 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-400">Sign in to your <span className="text-xl p-0 text-cyan-400 hover:shadow-lg hover:shadow-blue-400">CodeJudge</span> account</p>
        </div>
        </div>

        {/* Login Card */}
        <div className=
        {`bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-lg p-6 hover:shadow-cyan-100/90 transition-all duration-300 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
         >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-white text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">Don't have an account? </span>
            <NavLink to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200">
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;