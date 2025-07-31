import React from 'react';

const Background = ({ children }) => {
  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-y-scroll hide-scrollbar">
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Cloud animations - Much slower */
        @keyframes float-slow {
          0%, 100% { transform: translateX(-100vw) translateY(0px); }
          50% { transform: translateX(100vw) translateY(-20px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateX(-120vw) translateY(0px); }
          50% { transform: translateX(120vw) translateY(15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateX(-110vw) translateY(0px); }
          50% { transform: translateX(110vw) translateY(-10px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateX(100vw) translateY(0px); }
          50% { transform: translateX(-100vw) translateY(25px); }
        }
        
        @keyframes float-diagonal {
          0% { transform: translateX(-100vw) translateY(100vh); }
          50% { transform: translateX(50vw) translateY(-10vh); }
          100% { transform: translateX(100vw) translateY(90vh); }
        }
        
        @keyframes float-vertical {
          0% { transform: translateX(-80vw) translateY(0vh); }
          100% { transform: translateX(120vw) translateY(0vh); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { filter: blur(8px) brightness(1); }
          50% { filter: blur(12px) brightness(1.2); }
        }
        
        .cloud-1 {
          animation: float-slow 80s infinite linear, pulse-glow 8s infinite ease-in-out;
        }
        
        .cloud-2 {
          animation: float-medium 90s infinite linear, pulse-glow 10s infinite ease-in-out;
        }
        
        .cloud-3 {
          animation: float-fast 70s infinite linear, pulse-glow 12s infinite ease-in-out;
        }
        
        .cloud-4 {
          animation: float-reverse 100s infinite linear, pulse-glow 14s infinite ease-in-out;
        }
        
        .cloud-5 {
          animation: float-diagonal 110s infinite linear, pulse-glow 16s infinite ease-in-out;
        }
        
        .cloud-6 {
          animation: float-slow 85s infinite linear reverse, pulse-glow 9s infinite ease-in-out;
        }
        
        .cloud-7 {
          animation: float-vertical 95s infinite linear, pulse-glow 11s infinite ease-in-out;
        }
        
        .cloud-8 {
          animation: float-fast 75s infinite linear, pulse-glow 13s infinite ease-in-out;
        }
        
        .cloud-9 {
          animation: float-reverse 105s infinite linear, pulse-glow 15s infinite ease-in-out;
        }
        
        .cloud-10 {
          animation: float-medium 92s infinite linear, pulse-glow 17s infinite ease-in-out;
        }
        
        .cloud-11 {
          animation: float-diagonal 115s infinite linear, pulse-glow 7s infinite ease-in-out;
        }
        
        .cloud-12 {
          animation: float-slow 88s infinite linear reverse, pulse-glow 18s infinite ease-in-out;
        }
      `}</style>
      
      {/* Animated Cloud Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large Main Cloud - 3D Ball */}
        <div className="cloud-1 absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-green-200 via-green-400 to-green-700 rounded-full opacity-30 shadow-2xl">
          <div className="absolute top-8 left-8 w-24 h-24 bg-gradient-to-br from-white/60 to-white/20 rounded-full blur-sm"></div>
        </div>
        
        {/* Medium Cloud 1 - Flat Green */}
        <div className="cloud-2 absolute top-40 left-0 w-72 h-72 bg-green-500/25 rounded-full opacity-20">
        </div>
        
        {/* Small Cloud 1 - 3D Ball */}
        <div className="cloud-3 absolute top-60 left-0 w-48 h-48 bg-gradient-to-br from-green-300 via-green-500 to-green-800 rounded-full opacity-25 shadow-lg">
          <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-white/50 to-white/15 rounded-full blur-sm"></div>
        </div>
        
        {/* Reverse Moving Cloud - 3D Ball */}
        <div className="cloud-4 absolute top-80 right-0 w-80 h-80 bg-gradient-to-br from-green-200 via-green-400 to-green-600 rounded-full opacity-28 shadow-xl">
          <div className="absolute top-6 left-6 w-20 h-20 bg-gradient-to-br from-white/55 to-white/18 rounded-full blur-sm"></div>
        </div>
        
        {/* Diagonal Moving Cloud - Flat Green */}
        <div className="cloud-5 absolute bottom-20 left-0 w-64 h-64 bg-green-400/22 rounded-full opacity-18">
        </div>
        
        {/* Additional Small Cloud - 3D Ball */}
        <div className="cloud-6 absolute top-96 left-0 w-56 h-56 bg-gradient-to-br from-green-300 via-green-500 to-green-700 rounded-full opacity-20 shadow-lg">
          <div className="absolute top-5 left-5 w-14 h-14 bg-gradient-to-br from-white/45 to-white/12 rounded-full blur-sm"></div>
        </div>
        
        {/* New Cloud 7 - Flat Green */}
        <div className="cloud-7 absolute top-10 left-0 w-40 h-40 bg-green-500/30 rounded-full opacity-25">
        </div>
        
        {/* New Cloud 8 - 3D Ball */}
        <div className="cloud-8 absolute top-1/3 left-0 w-88 h-88 bg-gradient-to-br from-green-200 via-green-400 to-green-600 rounded-full opacity-35 shadow-xl">
          <div className="absolute top-7 left-7 w-18 h-18 bg-gradient-to-br from-white/60 to-white/20 rounded-full blur-sm"></div>
        </div>
        
        {/* New Cloud 9 - Flat Green */}
        <div className="cloud-9 absolute top-1/2 right-0 w-60 h-60 bg-green-500/15 rounded-full opacity-20">
        </div>
        
        {/* New Cloud 10 - 3D Ball */}
        <div className="cloud-10 absolute bottom-32 left-0 w-44 h-44 bg-gradient-to-br from-green-300 via-green-500 to-green-800 rounded-full opacity-22 shadow-lg">
          <div className="absolute top-3 left-3 w-12 h-12 bg-gradient-to-br from-white/50 to-white/15 rounded-full blur-sm"></div>
        </div>
        
        {/* New Cloud 11 - 3D Ball */}
        <div className="cloud-11 absolute bottom-40 right-0 w-76 h-76 bg-gradient-to-br from-green-200 via-green-400 to-green-700 rounded-full opacity-30 shadow-xl">
          <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-white/55 to-white/18 rounded-full blur-sm"></div>
        </div>
        
        {/* New Cloud 12 - Flat Green */}
        <div className="cloud-12 absolute top-1/4 left-0 w-52 h-52 bg-green-400/20 rounded-full opacity-24">
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;