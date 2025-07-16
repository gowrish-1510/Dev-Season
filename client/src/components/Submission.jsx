import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Eye, Clipboard } from "lucide-react";
import { useProblem } from "../context/ProblemContext.js";

const Submission = () => {
  const { problem } = useProblem();
  const [submissions, setSubmission] = useState([]);
  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const submissionHandle = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/submission/${problem._id}`,
          {
            withCredentials: true,
          }
        );

        if (result.data.success) {
          setSubmission(result.data.submissions);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Some error fetching submission:", err);
      }
    };

    submissionHandle();
  }, [problem]);

  const handleViewCode = (id) => {
    const specSubmission = submissions.find((sub) => sub._id.toString() === id.toString());

    if (specSubmission) {
      const specCode = specSubmission.code;
      setCode(specCode);
      setIsModalOpen(true);
      setCopied(false); // Reset copied state when opening modal
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch((err) => {
      console.error("Failed to copy code:", err);
    });
  };

  return (
    <div className="space-y-8 pt-5">
      <div className="space-y-2">
        <h2 className="text-2xl text-shadow-xs text-shadow-indigo-400 font-bold text-purple-300">
          Recent Submissions
        </h2>
      </div>
      <div className="border border-purple-500/20 bg-amber/5 backdrop-blur-md rounded-lg shadow-md">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="border-b border-purple-500/20 bg-white/5 rounded-md p-4 hover:bg-fuchsia-500/5 transition mb-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    submission.verdict === "Accepted"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {submission.verdict}
                </span>
                <p className="text-sm text-purple-400 mt-1">
                  {submission.language}
                </p>
              </div>
              <div className="text-right text-sm text-gray-200">
                <p>Runtime: {submission.executionTime}ms</p>
                <p>{new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => handleViewCode(submission._id)}
              className={`flex items-center gap-2 px-4 py-2 mt-3 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium ${
                loading ? "cursor-not-allowed bg-purple-200" : ""
              }`}
              disabled={loading}
            >
              <Eye className="w-4 h-4" />
              View Code
            </button>
          </div>
        ))}
        {submissions.length === 0 && (
          <h1 className="text-center text-purple-300 py-4">
            No submissions yet.
          </h1>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-200">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <h2 className="text-xl font-bold">Submitted Code</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6 bg-gray-900/90 backdrop-blur-md rounded-lg border border-purple-500/30 shadow-md">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
              >
                <Clipboard className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              <code className="text-gray-200 bg-purple-900/20 border border-purple-500/20 p-4 rounded-md block">
                {code}
              </code>
            </pre>
          </div>
          <div className="flex justify-end p-6 border-t border-purple-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Submission;