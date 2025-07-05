import React, { useState } from "react";
import { Code, User, LogOut, LayoutDashboard } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast,ToastContainer } from "react-toastify"; // No need to import ToastContainer here

export default function Navbar() {
  const { isAuthenticated, logoutUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const no_auth_items = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "Problems", path: "/problems" },
  ];

  const auth_items = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    { name: "Contests", path: "/contests" },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Successfully Logged Out! Redirecting to Home..", {
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error while logout!: ", err);
    }
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-white/15 top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-4 ml-5">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide hover:scale-110 transition-all duration-300 ease-in-out">
              CodeJudge
            </span>
          </NavLink>

          <div className="flex items-center justify-around gap-9 mr-10">
            {isAuthenticated ? (
              <>
                {auth_items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? `text-cyan-400 cursor-pointer`
                        : `text-gray-300 hover:text-orange-300 hover:scale-105 transition-all duration-300`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-gray-300 hover:text-orange-300 hover:scale-105 transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-md shadow-lg py-2">
                      <NavLink
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 transition"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-400 hover:bg-white/20 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              no_auth_items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? `text-cyan-400 cursor-pointer`
                      : `text-gray-300 hover:text-orange-300 hover:scale-105 transition-all duration-300`
                  }
                >
                  {item.name}
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
