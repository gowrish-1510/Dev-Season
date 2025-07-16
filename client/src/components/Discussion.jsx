import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from 'lucide-react';
import axios from "axios";
import Modal from "react-modal";
import { useProblem } from "../context/ProblemContext.js";

const Discussion = () => {
  const { problem } = useProblem();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        if (!problem?._id) {
          setError("No problem selected");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/discussion/problem/${problem._id}`,
          { withCredentials: true }
        );
        setThreads(res.data.threads || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError("Failed to fetch threads. Please try again.");
      }
    };

    fetchThreads();
  }, [problem]);

  const handleCreateThread = async () => {
    try {
      if (!newThreadTitle.trim() || !newThreadContent.trim()) {
        setError("Thread title and content are required");
        return;
      }

      setIsSubmittingReply(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/discussion/thread`,
        {
          problemid: problem._id,
          title: newThreadTitle.trim(),
          content: newThreadContent.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/discussion/problem/${problem._id}`,
          { withCredentials: true }
        );
        setThreads(result.data.threads || []);
        setIsModalOpen(false);
        setNewThreadTitle('');
        setNewThreadContent('');
        setError(null);
      } else {
        setError("Failed to create thread");
      }
    } catch (err) {
      console.error('Error creating thread:', err);
      setError("Failed to create thread. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplies = async (e) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      setError("Reply content is required");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/discussion/reply/${selectedThread.PK}`,
        {
          problemid: problem._id,
          content: replyContent.trim(),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/discussion/problem/${problem._id}`,
          { withCredentials: true }
        );

        const updatedThreads = result.data.threads || [];
        setThreads(updatedThreads);

        const updatedSelectedThread = updatedThreads.find(thread => thread.PK === selectedThread.PK);
        if (updatedSelectedThread) {
          setSelectedThread(updatedSelectedThread);
        }

        setReplyContent('');
        setError(null);
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError("Failed to submit reply. Please try again.");
    }
  };

  const openThread = (thread) => {
    setSelectedThread(thread);
    setError(null);
  };

  const closeThread = () => {
    setSelectedThread(null);
    setError(null);
  };

  return (
    <div className="space-y-8 pt-5">
      {error && (
        <div className="text-red-400 bg-red-500/20 border border-red-500/30 rounded-md p-3">
          {error}
        </div>
      )}
      {!selectedThread ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-shadow-xs text-shadow-indigo-400 font-bold text-purple-300">
              Discussions
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
            >
              <Plus className="w-4 h-4" />
              New Thread
            </button>
          </div>

          <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md rounded-lg shadow-md">
            {threads.length === 0 ? (
              <p className="text-gray-200 p-4 text-center">No threads available. Start a discussion!</p>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.PK}
                  className="border-b border-purple-500/20 p-4 hover:bg-purple-500/10 transition cursor-pointer"
                  onClick={() => openThread(thread)}
                >
                  <h3 className="font-semibold text-purple-300">{thread.title}</h3>
                  <p className="text-gray-200 text-sm mt-1">
                    by {thread.username} • {new Date(thread.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={closeThread}
            className="flex items-center gap-2 text-purple-400 mb-4 hover:text-purple-300"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md rounded-lg shadow-md mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-md text-white">
              <h3 className="text-base font-semibold">{selectedThread.title}</h3>
            </div>
            <div className="p-4 bg-gray-900/90 backdrop-blur-md rounded-b-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                <code className="text-gray-200 bg-purple-900/20 border border-purple-500/20 p-4 rounded-md block">
                  {selectedThread.content}
                </code>
              </pre>
              <p className="text-gray-200 text-sm mt-2">
                by {selectedThread.username} • {new Date(selectedThread.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md rounded-lg shadow-md mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-md text-white">
              <h4 className="text-base font-semibold">Add a Reply</h4>
            </div>
            <form onSubmit={handleReplies} className="p-4">
              <textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="w-full border border-purple-500/20 bg-gray-900/90 text-gray-200 rounded p-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmittingReply}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="px-4 py-2 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReply ? 'Submitting...' : 'Submit Reply'}
                </button>
              </div>
            </form>
          </div>

          <div className="border border-purple-500/20 bg-white/5 backdrop-blur-md rounded-lg shadow-md">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-md text-white">
              <h4 className="text-base font-semibold">Replies</h4>
            </div>
            <div className="p-4 space-y-3">
              {selectedThread.replies?.length === 0 ? (
                <p className="text-gray-200">No replies yet.</p>
              ) : (
                selectedThread.replies.map((reply) => (
                  <div
                    key={reply.SK}
                    className="border border-purple-500/20 bg-purple-900/20 rounded-md p-3"
                  >
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      <code className="text-gray-200 bg-transparent border-none p-0 block">
                        {reply.content}
                      </code>
                    </pre>
                    <p className="text-gray-200 text-sm mt-1">
                      by {reply.username} • {new Date(reply.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

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
                <Plus className="w-6 h-6" />
                <h2 className="text-xl font-bold">Create New Thread</h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            {error && <div className="text-red-400 bg-red-500/20 border border-red-500/30 rounded-md p-3 mb-3">{error}</div>}
            <input
              type="text"
              placeholder="Thread Title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              required
              className="w-full border border-purple-500/20 bg-gray-900/90 text-gray-200 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Write your question or content..."
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              required
              rows={5}
              className="w-full border border-purple-500/20 bg-gray-900/90 text-gray-200 rounded p-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}
                className="px-4 py-2 border border-purple-500/20 bg-gray-900/90 text-gray-200 rounded hover:bg-purple-500/10"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="px-4 py-2 bg-gradient-to-r text-sm rounded-md border border-white/20 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
                disabled={isSubmittingReply}
              >
                {isSubmittingReply ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Discussion;