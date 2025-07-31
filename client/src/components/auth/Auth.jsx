import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { setNotify } from "../../features/notifySlice";
import { apiClient } from "../../lib/apiClient";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "../../utils/constants";
import { setUserInfo } from "../../features/userSlice";
import {useNavigate} from "react-router-dom";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateSignup = () => {

    const { email, fullName, password, confirmPassword } = formData;
    const isValidName = /^[A-Za-z\s]+$/.test(fullName);
    const isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email.toLowerCase());

    if ((!email.length && !fullName.length && !password.length)) {
      dispatch(setNotify({ message: "Please fill the details", type: "warning" }));
      return false;
    }
    else if ((!fullName.length)) {
      dispatch(setNotify({ message: "Full Name is required", type: "warning" }));
      return false;
    }
    else if (!email.length) {
      dispatch(setNotify({ message: "Email is required", type: "warning" }));
      return false;
    }
    else if (!password.length) {
      dispatch(setNotify({ message: "Password is required", type: "warning" }));
      return false;
    }
    else if ((fullName.length < 7)) {
      dispatch(setNotify({ message: "Full Name must be at least 5 characters.", type: "warning" }));
      return false;
    }
    else if (!isValidName) {
      dispatch(setNotify({ message: "Full Name can only contain letters and spaces.", type: "warning" }));
      return false;
    }
    else if (!isValidEmail) {
      dispatch(setNotify({ message: "Please enter a valid email address.", type: "warning" }));
      return false;
    }
    else if ((password.length < 8)) {
      dispatch(setNotify({ message: "Password must be at least 8 characters long.", type: "warning" }));
      return true;
    }
    else if ((password !== confirmPassword)) {
      dispatch(setNotify({ message: "Confirm password must match the password.", type: "warning" }));
      return false;
    }
    return true;

  };

  const validateLogin = () =>{
    const { email, password } = formData;
    const isValidEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email.toLowerCase());

    if ((!email.length  && !password.length)) {
      dispatch(setNotify({ message: "Please fill the details", type: "warning" }));
      return false;
    }
    else if (!email.length) {
      dispatch(setNotify({ message: "Email is required", type: "warning" }));
      return false;
    }
    else if (!password.length) {
      dispatch(setNotify({ message: "Password is required", type: "warning" }));
      return false;
    }
    else if (!isValidEmail) {
      dispatch(setNotify({ message: "Please enter a valid email address.", type: "warning" }));
      return false;
    }
    return true;
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (validateLogin()) {
        const {email, password} = formData;
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {email, password},
          {withCredentials: true}
        );
        console.log(response.data.user);
        dispatch(setUserInfo(response.data.user));
        if(response.data.user.role === "candidate") navigate("/candidate");
        else navigate("/admin");
        dispatch(setNotify({message:"Login successfull",type:"success"}));
      }
    } catch (err) {
        if(err.response?.status===409 || err.response?.status === 401){
          dispatch(setNotify({message:err.response.data,type: "error"}));
        }
        else{
          dispatch(setNotify({message:"Login failed. Please try again",type: "error"}));
        }
        
    }

  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (validateSignup()) {
        const { email, fullName, password } = formData;
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, fullName, password },
          { withCredentials: true }
        );
        console.log(response.data.user);
        dispatch(setUserInfo(response.data.user));
        if(response.data.user.role === "candidate") navigate("/candidate");
        else navigate("/admin");
        dispatch(setNotify({ message: "Signup Successfull", type: "success" }));
      }
    } catch (err) {
      if (err.response?.status === 409) {
        dispatch(setNotify({ message: err.response.data, type: "info" }));
        console.error(err.message);
      } else {
        console.error(err);

        dispatch(
          setNotify({
            message: "Signup failed. Please try again",
            type: "info",
          })
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left Side - 3D Doom Images */}
      <div className="flex-1 relative md:overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-gray-900/30"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* 3D Doom Images Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Dr. Doom Image 1 - Front Layer */}
          <div className="absolute md:z-30  md:opacity-100 opacity-60 animate-float-1">
            <div className="relative group cursor-pointer">
              <img
                src="images/doom/doom1.png"
                alt="Dr. Doom"
                className="w-50 h-50 md:w-120 md:h-120 object-contain filter drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>

          {/* Dr. Doom Image 2 - Middle Layer */}
          <div className="hidden md:block absolute z-20 animate-float-2">
            <div className="relative group cursor-pointer transform translate-x-32 translate-y-16 -rotate-12">
              <img
                src="images/doom/doom2.png"
                alt="Dr. Doom"
                className="w-64 h-64 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>

          {/* Dr. Doom Image 3 - Back Layer */}
          <div className="hidden md:block absolute z-10 animate-float-3">
            <div className="relative group cursor-pointer transform -translate-x-24 translate-y-8 rotate-6">
              <img
                src="images/doom/doom2.png"
                alt="Dr. Doom"
                className="w-72 h-72 object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="absolute bottom-20 left-10 text-left">
          <h1 className="text-4xl font-bold text-green-400 mb-2 animate-pulse pt-2 md:pt-0">
            Welcome to BattleWorld
          </h1>
          <p className="text-gray-400 text-lg">
            Doom's Supreme Recruitment Portal
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center md:p-8 px-6">
        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <div className="flex mb-8 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${isLogin
                ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                : "text-gray-400 hover:text-white"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-300 ${!isLogin
                ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                : "text-gray-400 hover:text-white"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Full Name - Only for Sign Up */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-gray-400 transition-all duration-300 outline-none focus:outline-none"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-gray-400 transition-all duration-300 outline-none focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-gray-400 transition-all duration-300 outline-none focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-gray-400 transition-all duration-300 outline-none focus:outline-none"
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/30"
            >
              {isLogin ? "Enter BattleWorld" : "Join the Ranks"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "New to BattleWorld?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:text-green-300 ml-1 font-medium"
              >
                {isLogin ? "Join now" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
          }
          25% { 
            transform: translateY(-15px) translateX(5px) rotate(1deg) scale(1.02);
          }
          50% { 
            transform: translateY(-25px) translateX(0px) rotate(0deg) scale(1.05);
          }
          75% { 
            transform: translateY(-15px) translateX(-5px) rotate(-1deg) scale(1.02);
          }
        }
        
        @keyframes float-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(128px) rotate(-12deg) scale(1);
          }
          33% { 
            transform: translateY(-10px) translateX(135px) rotate(-10deg) scale(1.03);
          }
          66% { 
            transform: translateY(-20px) translateX(125px) rotate(-14deg) scale(1.01);
          }
        }
        
        @keyframes float-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(-96px) rotate(6deg) scale(1);
          }
          40% { 
            transform: translateY(-8px) translateX(-100px) rotate(8deg) scale(1.02);
          }
          80% { 
            transform: translateY(-16px) translateX(-90px) rotate(4deg) scale(1.01);
          }
        }
        
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
