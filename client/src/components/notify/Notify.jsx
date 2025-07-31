import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setNotify } from "../../features/notifySlice";

const Notify = () => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const { message, type } = useSelector((state) => state.notify.notify);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      setShow(true);
      setIsExiting(false);
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShow(false);
      dispatch(setNotify({ message: "", type: "" }));
    }, 300);
  };

  const getNotificationConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          bgColor: "bg-gradient-to-r from-green-900/90 to-green-800/90",
          borderColor: "border-green-500",
          iconColor: "text-green-400",
          glowColor: "shadow-green-500/30",
        };
      case "error":
        return {
          icon: AlertCircle,
          bgColor: "bg-gradient-to-r from-red-900/90 to-red-800/90",
          borderColor: "border-red-500",
          iconColor: "text-red-400",
          glowColor: "shadow-red-500/30",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgColor: "bg-gradient-to-r from-yellow-900/90 to-yellow-800/90",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-400",
          glowColor: "shadow-yellow-500/30",
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-gradient-to-r from-blue-900/90 to-blue-800/90",
          borderColor: "border-blue-500",
          iconColor: "text-blue-400",
          glowColor: "shadow-blue-500/30",
        };
    }
  };

  const config = getNotificationConfig();
  const IconComponent = config.icon;

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-100">
      <div
        className={`
          ${config.bgColor} 
          ${config.borderColor} 
          ${config.glowColor}
          backdrop-blur-md border rounded-lg p-3 sm:p-4 w-full sm:min-w-80 sm:max-w-md max-w-none
          shadow-2xl transform transition-all duration-300 ease-out
          ${
            isExiting
              ? "translate-x-full opacity-0 scale-95"
              : "translate-x-0 opacity-100 scale-100 animate-slide-in-bounce"
          }
        `}
      >
        {/* Content */}
        <div className="relative flex items-start gap-3">
          {/* Icon */}
          <div className={`${config.iconColor} mt-0.5 animate-pulse`}>
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-white font-medium text-xs sm:text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes slide-in-bounce {
          0% {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        
        
        .animate-slide-in-bounce {
          animation: slide-in-bounce 0.5s ease-out;
        }
        
        .animate-progress {
          animation: progress 4000ms linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Notify;
