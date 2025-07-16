import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code, Trophy, Users, ArrowRight, Sparkles, Target, Clock, Star, Plus } from "lucide-react";
import Loader from "../components/Loader.jsx";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setAnimationComplete(true), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if(isLoading){
    return <Loader isLoading={true} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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

      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse animate-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse animate-delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-16">
        <div className={`text-center mb-12 transform transition-all duration-1000 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/25 hover:scale-105 transition ease-in-out hover:shadow hover:shadow-cyan-300">
                <Code className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl p-2.5 font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            CodeJudge
          </h1>
          
          <div className="relative mb-8">
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
              Master your coding skills with our{" "}
              <span className="text-cyan-400 font-semibold">advanced online judge platform</span>.
              <br />
              Solve challenges, compete with others, and{" "}
              <span className="text-purple-400 font-semibold">level up your programming expertise</span>.
            </p>
          </div>

          {/* Stats Preview */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 hover:shadow-lg hover:shadow-cyan-100/20 transition-all duration-300">
              <div className="text-2xl font-bold text-cyan-400">50+</div>
              <div className="text-sm text-gray-400">Problems</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 hover:shadow-lg hover:shadow-purple-100/20 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-400">100+</div>
              <div className="text-sm text-gray-400">Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300">
              <div className="text-2xl font-bold text-blue-400">1M+</div>
              <div className="text-sm text-gray-400">Submissions</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl transform transition-all duration-1000 delay-300 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Code className="relative h-8 w-8 text-cyan-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Code & Compile</h3>
            <p className="text-gray-400 text-sm">Write and test solutions in multiple programming languages with real-time feedback</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/10">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Trophy className="relative h-8 w-8 text-yellow-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Compete & Win</h3>
            <p className="text-gray-400 text-sm">Join contests, climb leaderboards, and showcase your programming prowess</p>
          </div>

          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Users className="relative h-8 w-8 text-purple-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Learn Together</h3>
            <p className="text-gray-400 text-sm">Connect with fellow coders, share knowledge, and grow your skills</p>
          </div>

          <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Target className="relative h-8 w-8 text-green-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">Monitor your growth with detailed analytics and personalized insights</p>
          </div>
        </div>

        {/* Contribution Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 delay-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-2xl hover:shadow-lg hover:shadow-cyan-100/20 transition-all duration-300">
            <p className="text-lg text-gray-300 mb-6">
              Want to contribute? Help us grow our problem database and make CodeJudge even better for the community.
            </p>
            <Link to="/problems/submission">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 rounded-md flex items-center justify-center gap-2 mx-auto">
                <Plus className="h-5 w-5" />
                Submit Problems Here
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transform transition-all duration-1000 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="relative group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 rounded-md">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-md opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              </button>
            </Link>
            
            <Link to="/login">
              <button className="border-2 border-gray-600 text-white hover:bg-white/10 hover:border-white/20 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm rounded-md">
                Sign In
              </button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-lg">Join thousands of developers already improving their skills</span>
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </div>
  );
};

export default Home;