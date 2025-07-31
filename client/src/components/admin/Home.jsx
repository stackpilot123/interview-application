import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Star, 
  Plus, 
  Target, 
  Shield, 
  Crown,
  Zap,
  ArrowRight,
  TrendingUp,
  Swords,
  Eye,
  UserPlus,
  Sparkles,
  Activity,
  ChevronRight,
  Flame,
  Trophy,
  Sword,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [pulseElements, setPulseElements] = useState([]);

  useEffect(() => {
    const pulses = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setPulseElements(pulses);
  }, []);

  const dashboardCards = [
    {
      id: 1,
      title: "Review Applications",
      subtitle: "Judge the warriors",
      description: "Swipe through candidate profiles and decide their fate in BattleWorld",
      icon: Swords,
      color: "from-red-600 to-red-800",
      glowColor: "shadow-red-500/30",
      borderColor: "border-red-500/30",
      count: "23",
      countLabel: "Pending review",
      bgPattern: "bg-gradient-to-br from-red-900/10 to-red-800/5",
      hoverColor: "hover:shadow-red-500/50",
      to:"/admin/swipe-applicants"
    },
    {
      id: 2,
      title: "Saved Candidates",
      subtitle: "Elite reserves",
      description: "Champions you've marked for future consideration and callbacks",
      icon: Bookmark,
      color: "from-amber-600 to-amber-800",
      glowColor: "shadow-amber-500/30",
      borderColor: "border-amber-500/30",
      count: "12",
      countLabel: "In reserve",
      bgPattern: "bg-gradient-to-br from-amber-900/10 to-amber-800/5",
      hoverColor: "hover:shadow-amber-500/50",
      to:"/admin/saved-candidates"

    },
    {
      id: 3,
      title: "Create Job Opening",
      subtitle: "Summon new warriors",
      description: "Post new missions and quests to attract the multiverse's finest",
      icon: Plus,
      color: "from-green-600 to-green-800",
      glowColor: "shadow-green-500/30",
      borderColor: "border-green-500/30",
      count: "8",
      countLabel: "Active postings",
      bgPattern: "bg-gradient-to-br from-green-900/10 to-green-800/5",
      hoverColor: "hover:shadow-green-500/50",
      to:"/admin/job-posting"

    },
    {
      id: 4,
      title: "Shortlisted Warriors",
      subtitle: "The chosen ones",
      description: "Elite candidates selected for interviews and final consideration",
      icon: Trophy,
      color: "from-purple-600 to-purple-800",
      glowColor: "shadow-purple-500/30",
      borderColor: "border-purple-500/30",
      count: "7",
      countLabel: "Ready for interview",
      bgPattern: "bg-gradient-to-br from-purple-900/10 to-purple-800/5",
      hoverColor: "hover:shadow-purple-500/50",
      to:"/admin/shortlisted-candidates"

    }
  ];

  const stats = [
    { 
      label: "Total Applications", 
      value: "156", 
      change: "+23", 
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Active Campaigns", 
      value: "8", 
      change: "+2", 
      icon: Briefcase,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative rounded-xl py-4">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8  ">
        
        {/* Pulse Effects - Hidden on small screens for performance */}
        <div className="hidden md:block">
          {pulseElements.map((pulse) => (
            <div
              key={pulse.id}
              className="absolute w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-green-500/5 rounded-full animate-ping"
              style={{
                left: `${pulse.x}%`,
                top: `${pulse.y}%`,
                animationDelay: `${pulse.delay}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>

        {/* Welcome Header with Enhanced Animation */}
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 animate-fade-in">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg sm:rounded-xl md:rounded-2xl blur-sm sm:blur-md md:blur-lg lg:blur-xl group-hover:blur-lg sm:group-hover:blur-xl md:group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-r from-gray-900/90 to-slate-900/90 backdrop-blur-sm border border-green-500/30 hover:border-green-500/50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4 md:h-52">
                <div className="p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg md:rounded-xl ">
                  {/* <Crown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white animate-bounce" style={{ animationDuration: '2s' }} /> */}
                  <img src="/images/doom/doom2.png" alt="drDoom" className="h-75 text-white animate-pulse-glow hidden md:block"/>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent animate-gradient">
                    Hail, Dr. Doom
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg animate-slide-up animate-gradient">Supreme Ruler of BattleWorld</p>
                </div>
                <div className="hidden sm:block">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-500 animate-pulse"/>
                </div>
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed animate-fade-in-delayed pt-12">
                Your domain awaits your command. Review the latest challengers and expand your legion of champions across the multiverse.
              </p>
              
              {/* Animated Status Bar */}
              <div className="mt-2 sm:mt-3 md:mt-4 flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs sm:text-sm font-medium">System Online</span>
                </div>
                <div className="flex-1 h-0.5 md:h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
                <Activity className="w-3 h-3 md:w-4 md:h-4 text-green-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-br from-gray-800/60 to-slate-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 transform hover:scale-[1.02] transition-all duration-300 animate-slide-up group ${stat.bgColor}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-1 sm:p-1.5 md:p-2 ${stat.bgColor} rounded-lg`}>
                      <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${stat.color}`} />
                    </div>
                    <span className="text-gray-300 font-medium text-xs sm:text-sm md:text-base">{stat.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="flex items-end gap-2 md:gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white animate-count-up">{stat.value}</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    <span className="text-xs sm:text-sm font-semibold">{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-sm border ${card.borderColor} hover:border-opacity-80 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-500 hover:scale-[1.02] ${card.hoverColor} cursor-pointer animate-slide-up`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={()=>navigate(card.to)}
              >
                {/* Enhanced Background Pattern */}
                <div className={`absolute inset-0 ${card.bgPattern} rounded-lg sm:rounded-xl md:rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                
                {/* Enhanced Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-500`}></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r ${card.color} opacity-20 animate-pulse`}></div>
                </div>
                
                <div className="relative z-10">
                  {/* Enhanced Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4 md:mb-6">
                    <div className={`p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-br ${card.color} rounded-md sm:rounded-lg md:rounded-xl shadow-lg ${card.glowColor} group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-1`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 md:gap-2 transition-all duration-300 ${hoveredCard === card.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                      <span className="text-gray-400 text-xs sm:text-sm font-medium">Enter</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-gray-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-green-400 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 font-medium mb-1 sm:mb-2 md:mb-3 group-hover:text-gray-300 transition-colors duration-300 text-xs sm:text-sm md:text-base">
                      {card.subtitle}
                    </p>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 text-xs sm:text-sm md:text-base">
                      {card.description}
                    </p>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-gray-700/50 group-hover:border-gray-600/50 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${card.color} animate-pulse`}></div>
                      <span className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">{card.countLabel}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300 animate-count-up">
                        {card.count}
                      </span>
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
                
                {/* Animated Corner Accent */}
                <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-gradient-to-br ${card.color} rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 animate-spin`} style={{ animationDuration: '3s' }}></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Quick Actions Footer */}
        <div className="mt-6 sm:mt-8 md:mt-12 animate-fade-in-delayed">
          <div className="bg-gradient-to-r from-gray-800/40 to-slate-800/40 backdrop-blur-sm border border-gray-700/40 hover:border-gray-600/40 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-[1.005]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="relative">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-gray-300 font-medium text-xs sm:text-sm md:text-base">All Systems Operational</span>
                <Sword className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span>Last updated:</span>
                  <span className="text-green-400 font-medium animate-pulse">Now</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>BattleWorld v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
            0%, 100% { 
                background-position: 0% 50%;
                filter: brightness(1);
            }
            50% { 
                background-position: 100% 50%;
                filter: brightness(1.2) drop-shadow(0 0 10px rgba(34, 197, 94, 0.3));
            }
        }

        
        @keyframes pulse-glow {
            0%, 100% { 
                filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6));
            }
            50% { 
                filter: drop-shadow(0 0 40px rgba(34, 197, 94, 1)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.5));
        }
        }
        
        @keyframes count-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 7s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 7s ease-in-out infinite;
        }
        
        .animate-count-up {
          animation: count-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;