import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { NavLink } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confPassword) {
      return toast.error("Passwords do not match!", { transition: Bounce });
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        username,
        email,
        password
      }, {
        withCredentials: true
      });

      if (res.data.user) {
        setEmail("");
        setPassword("");
        toast.success("Registration successful! Please Login to continue", { transition: Bounce });
        setTimeout(() => {   //toast should be visible for atleast 2 seconds after success
           navigate("/login");  
        }, 2000);

      } else {
        toast.error(res.data.message, { transition: Bounce });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error during registration", { transition: Bounce });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <ToastContainer position="bottom-right" autoClose={5000} pauseOnHover theme="light" />
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Create an Account</h2>
        <p className="text-gray-400 text-center mb-6">Join Online Judge and start solving problems!</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2.5 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300">Sign In</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
