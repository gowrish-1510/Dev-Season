import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Target, Award, TrendingUp, UserCircle2Icon } from "lucide-react";

const ProfileCard = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(userId);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/${userId}`,{withCredentials:true});
        if (res.data.success) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return <p className="text-purple-300">Loading...</p>;

  const { user, rank, totalUsers } = profile;

  return (
    <div className="border  border-purple-500/20 bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-md mx-auto text-white">
      <div className="flex items-center gap-4 mb-4 bg-linear-to-br from-indigo-700 to-purple-600 rounded-lg">
        <UserCircle2Icon className="h-8 w-8"/>
        <div>
          <h2 className="text-2xl font-bold text-purple-200">{user.username}</h2>
          <p className="text-amber-300">Rank #{rank} / {totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 bg-gradient-to-tr from-green-900 to-emerald-900/30 rounded-lg border border-green-500/20">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-5 h-5 text-green-400 mr-1" />
            <span className="text-sm text-green-300">Solved</span>
          </div>
          <p className="text-xl font-bold text-green-200">{user.solvedCount}</p>
        </div>

        <div className="text-center p-3 bg-gradient-to-tr from-blue-900 to-indigo-900/30 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-5 h-5 text-blue-300 mr-1" />
            <span className="text-sm text-blue-300">Submissions</span>
          </div>
          <p className="text-xl font-bold text-blue-200">{user.submissionCount}</p>
        </div>

        <div className="text-center p-3 bg-gradient-to-br from-purple-900 to-indigo-900/30 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-center mb-1">
            <Award className="w-5 h-5 text-purple-300 mr-1" />
            <span className="text-sm text-purple-300">AC Rate</span>
          </div>
          <p className="text-xl font-bold text-purple-200">{user.acRate}%</p>
        </div>

        <div className="text-center p-3 bg-gradient-to-br from-orange-900 to-red-900/30 rounded-lg border border-orange-500/20">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-5 h-5 text-orange-300 mr-1" />
            <span className="text-sm text-orange-300">Score</span>
          </div>
          <p className="text-xl font-bold text-orange-200">{user.score}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
