import { useState, useEffect } from "react";
import {
  User,
  Bell,
  LogOut,
  Settings,
  MessageCircle,
  Briefcase,
  FileText,
  Home,
  Zap,
} from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { GET_USER_INFO, LOGOUT_ROUTE } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../features/userSlice";
import { setNotify } from "../../features/notifySlice";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [glowPulse, setGlowPulse] = useState(false);

  
  // Pulse effect for notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { name: "Dashboard", icon: Home, to: "/candidate", glow: false },
    {
      name: "Job Board",
      icon: Briefcase,
      to: "/candidate/job-board",
      glow: false,
    },
    {
      name: "My Applications",
      icon: FileText,
      to: "/candidate/my-applications",
      glow: false,
    },
    { name: "Messages", icon: MessageCircle, to: "/candidate/chat", glow: false },
  ];

  const profileMenuItems = [
    { name: "My Profile", icon: User },
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  const handleLogout = async () => {
    try {
      const response = await apiClient.get(LOGOUT_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch(setUserInfo(null));
        navigate("/auth");
        dispatch(setNotify({ message: "Logout successfull", type: "success" }));
      }
    } catch (err) {
      dispatch(
        setNotify({ message: "Logout failed. Please try again", type: "error" })
      );
      console.log(err.message);
    }
  };

  const handleProfileNavigation = (name) => {
    if (name === "Logout") {
      handleLogout();
    } else if (name === "My Profile") {
      navigate("/candidate/profile");
    }
  };

  return (
    <nav className=" bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-2 border-green-500 shadow-2xl relative overflow-visible py-1.5 rounded-xl">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-30"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-green-300 rounded-full animate-pulse opacity-40"
          style={{ top: "60%", left: "20%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse opacity-20"
          style={{ top: "40%", left: "80%", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"
          style={{ top: "80%", left: "60%", animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              {/* Doom's Insignia with animation */}
              <div
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-green-500/50 group-hover:shadow-green-400/70 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 border-2 border-green-400 cursor-pointer"
                onClick={() => {
                  navigate("/candidate");
                }}
              >
                {/* <Crown className="w-7 h-7 text-black font-bold animate-pulse" /> */}
                <img
                  src="https://res.cloudinary.com/dnwmgaltl/image/upload/v1752152427/chat-app-profile-pic/b1xh9qt8buelfpugnpea.png"
                  alt="logo"
                  className="w-full h-full text-black font-bold "
                />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent hover:from-green-300 hover:to-green-500 transition-all duration-300">
                  <span className="text-green-400 drop-shadow-lg">DOOM's</span>{" "}
                  BattleWorld
                </h1>
                <p className="text-xs text-gray-400 -mt-1">
                  Supreme Recruitment Portal
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-2">
                {navigationItems.map((item, index) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      `text-gray-300 hover:bg-gradient-to-r hover:from-green-700 hover:to-green-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 border border-transparent hover:border-green-500/50 ${
                        item.glow ? "animate-pulse" : ""
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-green-500/30 scale-105 shadow-lg border-green-500/50"
                          : ""
                      }`
                    }
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <item.icon className="w-4 h-4 mr-2 group-hover:animate-spin" />
                    {item.name}
                    {item.glow && (
                      <Zap className="w-3 h-3 ml-2 text-green-400 animate-bounce" />
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button
                className={`bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-full text-gray-400 hover:text-white hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 relative transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 border border-gray-600 hover:border-green-500 ${
                  glowPulse ? "shadow-lg shadow-green-500/50" : ""
                }`}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce shadow-lg shadow-red-500/50">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="max-w-xs bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-300 px-3 py-2 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 border border-gray-600 hover:border-green-500"
                  >
                    <div className="w-10 h-10 rounded-full mr-3 overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/50">
                      {userInfo.profilePicture ? (
                        <img
                          src={userInfo.profilePicture}
                          alt="profilePic"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center text-green-500 text-xl font-bold">
                          {userInfo.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">
                        {userInfo.fullName}
                      </div>
                      <div className="text-xs text-green-400 animate-pulse">
                        {userInfo.username?userInfo.username.charAt(0).toUpperCase()+userInfo.username.slice(1):""}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-lg shadow-2xl py-2 bg-gradient-to-br from-gray-900 via-black to-gray-900 ring-1 ring-green-500 focus:outline-none border border-green-500/50 backdrop-blur-sm animate-fadeIn">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg "></div>
                    {profileMenuItems.map((item, index) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          handleProfileNavigation(item.name);
                        }}
                        className="relative px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-green-700/50 hover:to-green-600/50 hover:text-white transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg mx-2 rounded-md"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-green-400" />
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button - Profile Picture */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gradient-to-r from-gray-800 to-gray-700 inline-flex items-center justify-center p-1 rounded-lg text-gray-400 hover:text-white hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 border border-gray-600 hover:border-green-500"
            >
              <div className="w-8 h-8 rounded-md overflow-hidden border-2 border-green-500">
                {userInfo.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="profilePic"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-green-500 text-xl font-bold">
                    {userInfo.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-green-500/50 backdrop-blur-sm animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.to}
                className="text-gray-300 hover:bg-gradient-to-r hover:from-green-700/50 hover:to-green-600/50 hover:text-white px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg mx-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="w-5 h-5 mr-3 text-green-400" />
                {item.name}
                {item.glow && (
                  <Zap className="w-3 h-3 ml-2 text-green-400 animate-bounce" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Profile Section */}
          <div className="pt-4 pb-3 border-t border-green-500/50">
            <div className="flex items-center px-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/50">
                {userInfo.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="profilePic"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-green-500 text-xl font-bold">
                    {userInfo.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {userInfo.fullName.charAt(0).toUpperCase()+userInfo.fullName.slice(1)}
                </div>
                <div className="text-sm text-green-400 animate-pulse">
                  {userInfo.username?userInfo.username.charAt(0).toUpperCase()+userInfo.username.slice(1):""}
                </div>
              </div>
              <button
                className={`ml-auto bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-full text-gray-400 hover:text-white hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 relative transform hover:scale-110 border border-gray-600 hover:border-green-500 ${
                  glowPulse ? "shadow-lg shadow-green-500/50" : ""
                }`}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce shadow-lg shadow-red-500/50">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {profileMenuItems.map((item, index) => (
                <div
                  key={item.name}
                  className="px-3 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-green-700/50 hover:to-green-600/50 transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg mx-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    handleProfileNavigation(item.name);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3 text-green-400" />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
