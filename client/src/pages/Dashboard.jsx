import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import RecentSubmissions from "../components/RecentSubmissions.jsx";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold bg-gradient-to-br from-indigo-600 via-amber-400 to-purple-600 text-center mb-3 text-transparent bg-clip-text">Welcome {user.username}!</h1>
      <div className="max-w-7xl mx-auto spaceK space-y-6 animate-fade-in">
        <ProfileCard userId={user._id} />
        <RecentSubmissions userId={user._id} />
      </div>
    </div>
  );
};

export default Dashboard;