import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const RecentSubmissions = ({ userId }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/submission/${userId}`,{
            withCredentials:true
        });
        if (res.data.success) {
          setSubmissions(res.data.submissions);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "Attempted":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="border border-purple-500/20 bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-md px-4 py-2">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Recent Submissions</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-300 text-purple-300">
            <th className="py-2 text-left">Problem</th>
            <th className="py-2 text-left">Verdict</th>
            <th className="py-2 text-left">Language</th>
            <th className="py-2 text-left">Runtime</th>
            <th className="py-2 text-left">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr
              key={sub._id}
              className="border-b border-purple-500/10 hover:bg-purple-900/10 transition"
            >
              <td className="py-2 text-purple-100">{sub.problem?.title || "Unknown"}</td>
              <td className="py-2 flex items-center gap-2 text-purple-200">
                {getVerdictIcon(sub.verdict)}
                <span>{sub.verdict}</span>
              </td>
              <td className="py-2 text-purple-200">{sub.language}</td>
              <td className="py-2 text-purple-200">{sub.executionTime ? `${sub.executionTime}ms` : "-"}</td>
              <td className="py-2 text-purple-400 text-xs">
                <div>{new Date(sub.createdAt).toLocaleDateString()}</div>
                <div className="text-gray-400">{new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {submissions.length === 0 && (
        <p className="text-center text-purple-300 py-4">No submissions yet.</p>
      )}
    </div>
  );
};

export default RecentSubmissions;
