import React from "react";
import { Code } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { isAuthenticated } = useAuth();

    const no_auth_items = [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Problems', path: '/problems' },
    ]

    const auth_items = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Problems', path: '/problems' },
        { name: 'Contests', path: '/contests' },
    ]

    return (
        <nav className="bg-slate-900/80 backdrop-blur-lg border-white/15 top-0 sticky z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* This is logo */}
                    <NavLink to='/' className="flex items-center space-x-4 ml-5">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 ease-in-out">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide hover:scale-110 transition-all duration-300 ease-in-out">
                            CodeJudge
                        </span>
                    </NavLink>
                    <div className="flex items-center justify-around gap-9 mr-10">
                        {isAuthenticated ?
                            auth_items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => {
                                        return isActive ? `text-cyan-400 cursor-pointer ` : `text-gray-300 hover:text-orange-300 hover:scale-105 transition-all duration-300 `
                                    }}
                                >
                                    {item.name}
                                </NavLink>
                            ))
                            :
                            no_auth_items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => {
                                        return isActive ? `text-cyan-400 cursor-pointer ` : `text-gray-300 hover:text-orange-300 hover:scale-105 transition-all duration-300 `
                                    }}
                                >
                                    {item.name}
                                </NavLink>
                            ))
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}