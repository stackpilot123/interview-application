import { useState, useEffect } from "react";
import { MessageCircle, Zap, Shield, Swords } from "lucide-react";
import { useSelector } from "react-redux";

const EmptyContainer = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    setIsLoaded(true);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(1deg); }
    }
    
    @keyframes floatReverse {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(20px) rotate(-1deg); }
    }
    
    @keyframes heroFloat {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-30px) scale(1.02); }
    }
    
    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; filter: blur(20px); }
      50% { opacity: 0.8; filter: blur(30px); }
    }
    
    @keyframes energyFlow {
      0% { transform: translateX(-100%) translateY(100%); }
      100% { transform: translateX(100%) translateY(-100%); }
    }
    
    @keyframes particleFloat {
      0% {
        transform: translate(0, 0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(var(--end-x), var(--end-y)) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    
    @keyframes hexagonRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
      0% { 
        opacity: 0; 
        transform: translateY(30px);
      }
      100% { 
        opacity: 1; 
        transform: translateY(0);
      }
    }
    
    @keyframes slideInLeft {
      0% { 
        opacity: 0; 
        transform: translateX(-100px) rotate(-10deg);
      }
      100% { 
        opacity: 0.7; 
        transform: translateX(0) rotate(-5deg);
      }
    }
    
    @keyframes slideInRight {
      0% { 
        opacity: 0; 
        transform: translateX(100px) rotate(10deg);
      }
      100% { 
        opacity: 0.7; 
        transform: translateX(0) rotate(5deg);
      }
    }
    
    @keyframes slideInCenter {
      0% { 
        opacity: 0; 
        transform: scale(0.8) translateY(50px);
      }
      100% { 
        opacity: 0.9; 
        transform: scale(1) translateY(0);
      }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-floatReverse {
      animation: floatReverse 6s ease-in-out infinite;
    }
    
    .animate-heroFloat {
      animation: heroFloat 4s ease-in-out infinite;
    }
    
    .animate-glowPulse {
      animation: glowPulse 3s ease-in-out infinite;
    }
    
    .animate-energyFlow {
      animation: energyFlow 3s linear infinite;
    }
    
    .animate-scanline {
      animation: scanline 8s linear infinite;
    }
    
    .animate-hexagonRotate {
      animation: hexagonRotate 20s linear infinite;
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 1s ease-out forwards;
    }
    
    .animate-slideInLeft {
      animation: slideInLeft 1.2s ease-out forwards;
    }
    
    .animate-slideInRight {
      animation: slideInRight 1.2s ease-out forwards;
    }
    
    .animate-slideInCenter {
      animation: slideInCenter 1s ease-out forwards;
    }
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #34d399;
      border-radius: 50%;
      --end-x: ${Math.random() * 200 - 100}px;
      --end-y: ${Math.random() * -200 - 50}px;
      animation: particleFloat 4s ease-out infinite;
    }
  `;

  return (
    <div className="hidden md:flex flex-1 bg-black items-center justify-center relative overflow-hidden h-[88vh]">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-65">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(52, 211, 153, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(52, 211, 153, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        />
      </div>

      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-emerald-500/50 to-transparent animate-scanline z-100" />

      {/* Energy orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-floatReverse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-glowPulse" />
      </div>

      {/* Dynamic particles */}
      {isLoaded &&
        Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: "50%",
              bottom: "20%",
              animationDelay: `${i * 0.3}s`,
              "--end-x": `${(Math.random() - 0.5) * 400}px`,
              "--end-y": `${Math.random() * -300 - 100}px`,
            }}
          />
        ))}

      {/* Hero Images Section */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Left Doom */}
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${
            isLoaded ? "animate-slideInLeft" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent blur-2xl animate-glowPulse" />
            <img
              src="/images/doom/doom1.png"
              alt="Dr. Doom"
              className="w-64 lg:w-80 opacity-70 transform -rotate-12 hover:opacity-90 transition-all duration-500 hover:scale-105"
              style={{
                filter: "drop-shadow(0 0 30px rgba(52, 211, 153, 0.3))",
                maskImage: "linear-gradient(to right, transparent, black 20%)",
              }}
            />
          </div>
        </div>

        {/* Center Doom - Larger and more prominent */}
        <div
          className={`relative z-10 ${
            isLoaded ? "animate-slideInCenter" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 via-transparent to-transparent blur-3xl animate-glowPulse" />
            <img
              src="/images/doom/doom2.png"
              alt="Dr. Doom"
              className="w-96 lg:w-[32rem] opacity-70 transform hover:scale-105 transition-all duration-500"
              style={{
                filter: "drop-shadow(0 0 50px rgba(52, 211, 153, 0.4))",
              }}
            />
            {/* Energy effects around center image */}
            <div className="absolute -inset-10">
              <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent animate-energyFlow" />
              <div
                className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent animate-energyFlow"
                style={{ animationDelay: "1.5s" }}
              />
            </div>
          </div>
        </div>

        {/* Right Doom */}
        <div
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
            isLoaded ? "animate-slideInRight" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent blur-2xl animate-glowPulse" />
            <img
              src="/images/doom/doom1.png"
              alt="Dr. Doom"
              className="w-64 lg:w-80 opacity-70 transform rotate-12 hover:opacity-90 transition-all duration-500 hover:scale-105"
              style={{
                filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))",
                maskImage: "linear-gradient(to left, transparent, black 20%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="text-center animate-fadeInUp">
          {/* Status indicators */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 opacity-60">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500">SECURE</span>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-xs text-gray-500">POWERED</span>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <Swords className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-500">ARMED</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
              BattleWorld Command Center
            </span>
          </h2>
          {userInfo.role === "admin" && (
            <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
              Select an warrior to begin strategic communications
            </p>
          )}

          {/* Animated status bar */}
          <div className="max-w-xs mx-auto">
            <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-500/80 uppercase tracking-wider">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-emerald-500/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-emerald-500/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-emerald-500/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-emerald-500/20" />
    </div>
  );
};

export default EmptyContainer;
