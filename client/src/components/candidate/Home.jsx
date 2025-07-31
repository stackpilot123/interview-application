import {
  User,
  Briefcase,
  FileText,
  MessageCircle,
  Settings,
  Shield,
  Crown,
  Zap,
  Eye,
  Target,
  Sword,
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

const Home = () => {
  const userInfo = useSelector((state)=>state.user.userInfo);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const quickActions = [
    {
      title: "Complete Profile",
      description: "Unlock your full potential",
      icon: User,
      progress: userInfo.profilePercentage? userInfo.profilePercentage : "0",
      color: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/50",
      borderColor: "border-green-500/50",
      urgent: true,
    },
    {
      title: "Browse Jobs",
      description: "Find your destiny",
      icon: Briefcase,
      count: 12,
      color: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/50",
      borderColor: "border-blue-500/50",
    },
    {
      title: "My Applications",
      description: "Track your journey",
      icon: FileText,
      count: 5,
      color: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/50",
      borderColor: "border-purple-500/50",
    },
    {
      title: "Messages",
      description: "Communications await",
      icon: MessageCircle,
      count: 3,
      color: "from-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/50",
      borderColor: "border-orange-500/50",
    },
  ];

  const handleCandidateNavigation = (title) =>{
    if(title === "Complete Profile"){
      navigate("/candidate/profile");
    } else if(title === "Browse Jobs"){
      navigate("/candidate/job-board");
    } else if(title === "My Applications"){
      navigate("/candidate/my-applications");
    } else if(title === "Messages"){
      navigate("/candidate/chat");
    }
  }
  return (
    <div className="min-h-screen  relative overflow-hidden">
      

      {/* Main Content */}
      <div className="relative mx-auto px-6 py-12 ">
        {/* Header */}
        <div className="mb-12 md:mb-14 flex items-center justify-around border border-green-500/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 md:h-[650px] rounded-xl">
          <div>
            <img
              src="images/doom/drDOOM5.png"
              alt="dr-doom"
              className="md:h-[700px] hidden lg:block "
            />
          </div>
          <div className="md:w-1/2 py-4 px-6 md:py-2 md:px-3">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-500 to-green-200 bg-clip-text text-transparent leading-tight">
                Welcome to BattleWorld
              </h1>
            </div>
            {/* Subtitle */}
            <h2 className="text-md lg:text-3xl font-semibold text-white mb-4">
              Doom's Elite Recruitment Portal
            </h2>
            {/* Main Description */}
            <p className="text-gray-300 text-lg lg:text-xl leading-relaxed mb-6">
              Prepare yourself for the ultimate multiversal challenges. Under
              the supreme rule of{" "}
              <span className="text-green-400 font-semibold">
                Victor Von Doom
              </span>
              , BattleWorld seeks only the most capable warriors, strategists,
              and champions.
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              onClick={()=>{handleCandidateNavigation(action.title)}}
              className={`relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-8 border ${action.borderColor} hover:border-opacity-80 transition-all duration-300 hover:shadow-xl ${action.shadowColor} transform hover:-translate-y-2 hover:scale-105 cursor-pointer group`}
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Urgent Badge */}
              {action.urgent && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full animate-bounce shadow-lg shadow-red-500/50">
                  Urgent!
                </div>
              )}

              {/* Content */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-4 bg-gradient-to-r ${action.color} rounded-lg shadow-lg ${action.shadowColor} transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 group-hover:text-green-400 transform ${
                    hoveredCard === index ? "translate-x-2" : ""
                  } transition-all duration-300`}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                {action.title}
              </h3>
              <p className="text-gray-400 mb-4">{action.description}</p>

              {/* Progress Bar or Count */}
              {action.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-green-400 font-medium">
                      {action.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${action.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${action.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {action.count && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-white font-bold text-lg">
                    {action.count}
                  </span>
                  <span className="text-gray-400 ml-1">available</span>
                </div>
              )}

              {/* Hover Effect Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-8 border border-green-500/50">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Serve Doom?
            </h3>
            <p className="text-gray-400 mb-6">
              Complete your profile and begin your journey in BattleWorld
            </p>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50">
              Begin Your Destiny
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
