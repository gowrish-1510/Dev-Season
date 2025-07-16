import { HashLoader } from "react-spinners";
import { Code } from "lucide-react";

const Loader = ({ isLoading, message = "Loading CodeJudge...", color = "#4f46e5", size = 60 }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950/95 via-indigo-950/95 to-gray-950/95 backdrop-blur-md flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse [animation-duration:4s]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse [animation-duration:4s] [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-duration:4s] [animation-delay:0.5s]"></div>
      </div>

      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 flex flex-col items-center shadow-2xl shadow-indigo-500/20">

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative p-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-2xl shadow-indigo-500/30">
            <Code className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>
          <HashLoader
            color={color}
            loading={isLoading}
            size={size}
            speedMultiplier={1.3}
            cssOverride={{
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Message with refined typography */}
        <p className="text-white text-xl font-semibold mb-3 tracking-wide">{message}</p>
        <p className="text-gray-300 text-sm leading-relaxed">Preparing your coding journey</p>

        {/* Enhanced animated dots */}
        <div className="flex space-x-2 mt-6">
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:400ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;