import React from 'react';
import { MessageSquareOff, Zap, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyChatState = ({ message }) => {

    const navigate = useNavigate();

    return (
        <div className="min-h-[89vh] bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center p-8 relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(76, 255, 0, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(76, 255, 0, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    animation: 'grid-move 20s linear infinite'
                }}></div>
            </div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-400/10 rounded-full blur-3xl animate-float-delayed"></div>

            <div className="relative max-w-3xl w-full">
                {/* Energy field effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/0 via-green-400/20 to-green-500/0 blur-2xl opacity-50 animate-pulse"
                    style={{ animationDuration: '3s' }}></div>

                {/* Main container with hexagonal influence */}
                <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-green-500/30 overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-[1.01]">
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>

                    {/* Hexagonal pattern overlay */}
                    <div className="absolute inset-0 opacity-5">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse">
                                    <polygon points="25,0 50,14.5 50,43.4 25,43.4 0,43.4 0,14.5" fill="none" stroke="#4cff00" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hexagons)" />
                        </svg>
                    </div>

                    <div className="relative p-16">
                        {/* Icon with energy effect */}
                        <div className="flex justify-center mb-10">
                            <div className="relative group cursor-pointer">
                                {/* Rotating ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-spin-slow"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-green-400/20 animate-spin-reverse"></div>

                                {/* Core icon */}
                                <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 rounded-2xl transform rotate-12 transition-all duration-500 group-hover:rotate-0 shadow-inner">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-xl"></div>
                                    <MessageSquareOff className="w-20 h-20 text-green-400 relative z-10" />
                                    <div className="absolute -top-2 -right-2">
                                        <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title with glitch effect */}
                        <div className="text-center mb-8 relative">
                            <h2 className="md:text-3xl text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300 mb-2 tracking-wider animate-fade-in-up relative">
                                COMMUNICATIONS LOCKED

                            </h2>
                            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
                        </div>

                        {/* Message with typewriter border */}
                        <div className="relative mb-12">
                            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-green-500/20 relative overflow-hidden animate-fade-in-up animation-delay-200">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan"></div>
                                <Shield className="absolute top-4 right-4 w-6 h-6 text-green-500/20" />
                                <p className="text-gray-300 text-lg leading-relaxed font-light">
                                    {message}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons with cyber styling */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
                            <button className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-1 uppercase tracking-wider" onClick={() => navigate("/candidate/job-board")}>
                                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <p className='text-white'>Access Job Board</p>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                                </span>
                            </button>

                            <button className="group relative overflow-hidden bg-black/60 backdrop-blur-xl text-green-400 font-bold py-4 px-8 rounded-xl border-2 border-green-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 hover:border-green-400 uppercase tracking-wider" onClick={() => navigate("/candidate/my-applications")}>
                                <span className="absolute inset-0 bg-green-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    My Applications
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>

                        {/* Status indicators */}
                        <div className="flex justify-center gap-8 mt-12 animate-fade-in-up animation-delay-600">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="uppercase tracking-wider">Access Denied</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="uppercase tracking-wider">Awaiting Clearance</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                </div>

                {/* Corner accents */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-green-500/50 rounded-tl-lg"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-green-500/50 rounded-tr-lg"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-green-500/50 rounded-bl-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-green-500/50 rounded-br-lg"></div>
            </div>

            <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-scan {
          animation: scan 3s linear infinite;
        }


        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
        </div>
    );
};

export default EmptyChatState;