import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const EmptySearchState = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Scan different sectors...";
  
  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Reset after a pause
        setTimeout(() => {
          currentIndex = 0;
          setDisplayedText("");
        }, 2000);
      }
    }, 100);
    
    return () => clearInterval(typeInterval);
  }, []);

  const styles = `
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes slideRight {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(200%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    
    @keyframes glitchText {
      0%, 100% {
        transform: translateX(0);
        opacity: 0.5;
      }
      20% {
        transform: translateX(-2px);
        opacity: 0.7;
      }
      40% {
        transform: translateX(2px);
        opacity: 0.5;
      }
      60% {
        transform: translateX(-1px);
        opacity: 0.6;
      }
      80% {
        transform: translateX(1px);
        opacity: 0.5;
      }
    }
    
    @keyframes blink {
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0;
      }
    }
    
    @keyframes cursorBlink {
      0%, 49% {
        opacity: 1;
      }
      50%, 100% {
        opacity: 0;
      }
    }
    
    @keyframes shimmerBar {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    
    @keyframes fadeInScale {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="flex flex-col items-center justify-center h-64 text-center animate-fadeInUp relative">
        
        {/* Glowing search icon with shield effect */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse"></div>
          <div className="relative bg-gray-800/60 p-4 rounded-full border border-gray-700 backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
            <Search className="w-12 h-12 text-gray-500" />
            {/* Rotating shield ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-dashed animate-spin"
              style={{ animationDuration: "10s" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-2 border-gray-600/20 border-dotted animate-spin"
              style={{
                animationDuration: "15s",
                animationDirection: "reverse",
              }}
            ></div>
          </div>
        </div>

        {/* Main text with glitch effect */}
        <div className="relative">
          <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase mb-1 transition-all duration-300 hover:text-gray-300">
            No warriors detected
          </p>
          {/* Glitch overlay with animation */}
          <p
            className="absolute inset-0 text-emerald-400/50 text-sm font-semibold tracking-wider uppercase mb-1"
            style={{ 
              clipPath: "inset(0 0 50% 0)",
              animation: "glitchText 3s infinite"
            }}
          >
            No warriors detected
          </p>
        </div>

        {/* Typewriter effect */}
        <div className="text-gray-500 text-xs mt-2 font-mono h-5 flex items-center">
          <span className="inline-block mr-1" style={{
            animation: "blink 1s infinite"
          }}>►</span>
          <span>{displayedText}</span>
          <span 
            className="inline-block w-2 h-4 bg-emerald-500/50 ml-0.5"
            style={{
              animation: "cursorBlink 1s infinite",
              display: displayedText.length < fullText.length ? "inline-block" : "none"
            }}
          ></span>
        </div>

        {/* Energy bar animation */}
        <div className="mt-6 w-32 h-1 bg-gray-800 rounded-full overflow-hidden relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
            style={{
              animation: "shimmerBar 2s infinite"
            }}
          ></div>
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            style={{
              width: "30%",
              animation: "slideRight 2s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Combat-style hint text with fade in */}
        <div 
          className="mt-4 flex items-center gap-2 text-gray-600 text-xs"
          style={{
            animation: "fadeInScale 0.5s ease-out 0.5s both"
          }}
        >
          <span className="font-mono bg-gray-800/40 px-2 py-1 rounded border border-gray-700/50 transition-all duration-300 hover:border-emerald-500/30 hover:text-gray-500">
            HINT: Try codenames or abilities
          </span>
        </div>
      </div>
    </>
  );
};

export default EmptySearchState;