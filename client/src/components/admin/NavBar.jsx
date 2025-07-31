import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  LogOut, 
  ChevronDown, 
  Crown,
  User,
  Shield,
  Menu,
  X,
  Zap,
  Clock
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { LOGOUT_ROUTE } from '../../utils/constants';
import { setNotify } from '../../features/notifySlice';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';



const NavBar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setIsLoaded(true);
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

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
  return (
    <nav className={` bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-green-500 shadow-xl backdrop-blur-lg transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} rounded-xl`}>
      <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:justify-around justify-between items-center h-16">
          {/* Logo and Brand Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 transform hover:scale-105 transition-all duration-300">
              {/* Logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transform hover:rotate-6 transition-all duration-300 relative cursor-pointer" onClick={()=>navigate("/admin")}>
                <img src="https://res.cloudinary.com/dnwmgaltl/image/upload/v1752152427/chat-app-profile-pic/b1xh9qt8buelfpugnpea.png" alt="logo" className="w-full h-full text-white drop-shadow-lg"/>
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                  DOOM'S BattleWorld
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Admin Portal</p>
              </div>
            </div>
            
            {/* No additional text - clean design */}
          </div>

          {/* Center Section - Time Display */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/30 rounded-lg border border-green-500/10 backdrop-blur-sm group hover:bg-slate-700/50 transition-all duration-300">
              <Clock className="w-4 h-4 text-green-400 group-hover:animate-spin" />
              <div className="text-center">
                <div className="text-sm font-mono text-green-400 font-bold tracking-wider">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-slate-400 -mt-0.5">
                  Time in this Universe
                </div>
              </div>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 py-3 px-1 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 border border-transparent hover:border-green-500/20 group"
              >
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transform group-hover:scale-110 transition-all duration-300">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">Dr. Victor Von Doom</p>
                  <p className="text-xs text-green-400">Supreme Ruler</p>
                </div>
                
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 backdrop-blur-xl rounded-lg shadow-2xl border border-green-500/20 py-2 z-[300] animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Dr. Victor Von Doom</p>
                        <p className="text-xs text-green-400">Supreme Ruler of BattleWorld</p>
                        <p className="text-xs text-slate-400">doom@battleworld.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <a href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors group">
                      <User className="mr-3 h-4 w-4 group-hover:text-green-400" />
                      Profile Settings
                    </a>
                    <a href="/admin/preferences" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors group">
                      <Settings className="mr-3 h-4 w-4 group-hover:text-green-400" />
                      Preferences
                    </a>
                    <a href="/admin/security" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors group">
                      <Shield className="mr-3 h-4 w-4 group-hover:text-green-400" />
                      Security
                    </a>
                  </div>
                  
                  <hr className="my-1 border-slate-700/50" />
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group" onClick={handleLogout}>
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-green-500/20 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile Profile Info */}
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-sm">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dr. Victor Von Doom</p>
                <p className="text-xs text-green-400">Supreme Ruler</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;