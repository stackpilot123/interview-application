import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Loader = ({ isLoading = true }) => {
  const loadingTexts = useSelector(
    (state) => state.loader.loading.loadingTexts
  );
  const [loadingText, setLoadingText] = useState("");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingTexts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 1000);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    // Animated dots effect
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 300);

    return () => {
      clearInterval(dotsInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto p-8">
        {/* GIF placeholder - In a real app, you'd replace this with your actual GIF */}
        <div className="mb-6 w-48 h-32 md:w-[500px] md:h-[350px] bg-gradient-to-r from-green-800/30 to-green-600/30 rounded-lg border border-green-500/30 flex items-center justify-center overflow-hidden">
          {/* Animated placeholder for GIF */}
          <div className="relative w-full h-full bg-gradient-to-br from-green-900/50 to-black/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse"></div>
            <img
              src="https://media1.tenor.com/m/M_ug5nD_68kAAAAC/doctor-doom-marvel-comics.gif"
              alt="gif"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2 font-mono">
            {loadingText}
            {dots}
          </h2>
          <p className="text-green-300/70 text-sm">
            Doom's systems are processing your request...
          </p>
        </div>

        {/* Green circular loader */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            {/* Main spinning ring */}
            <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-400 rounded-full animate-spin"></div>

            {/* Inner spinning ring (opposite direction) */}
            <div
              className="absolute inset-2 border-2 border-green-400/30 border-b-green-500 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading messages */}
        <div className="text-center">
          <p className="text-green-300/60 text-xs font-mono animate-pulse">
            Doom's systems are processing your request...
          </p>
        </div>

        {/* Hexagonal decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 border border-green-500/20 transform rotate-45 animate-spin-slow"></div>
        <div
          className="absolute -bottom-10 -right-10 w-16 h-16 border border-green-500/20 transform rotate-45 animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>

      {/* Custom CSS for slow spin animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Demo component to show the loader in action
// const loadingTexts = [
//   "Entering BattleWorld...",
//   "Doom requires your presence...",
//   "Accessing multiversal database...",
//   "Preparing for battle...",
//   "Summoning heroes and villains..."
// ];

export default Loader;
