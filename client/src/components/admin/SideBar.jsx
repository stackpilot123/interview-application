import React, { useState } from "react";
import {
  Users,
  PlusCircle,
  UserCheck,
  MessageSquare,
  Video,
  BarChart3,
  FileText,
  Eye,
  Menu,
  User,
  Bookmark,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiClient } from '../../lib/apiClient';
import { LOGOUT_ROUTE } from '../../utils/constants';
import { setNotify } from '../../features/notifySlice';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../features/userSlice';


const menuItems = [
  {
    icon: BarChart3,
    label: "Dashboard",
    color: "text-green-400",
    hoverColor: "hover:bg-green-400/10",
    to: "/admin",
    activeColor: "bg-green-400/20",
  },
  {
    icon: Users,
    label: "Total Candidates",
    color: "text-blue-400",
    hoverColor: "hover:bg-blue-400/10",
    to: "/admin/total-candidates",
    activeColor: "bg-blue-400/20",
  },
  {
    icon: PlusCircle,
    label: "Post New Jobs",
    color: "text-purple-400",
    hoverColor: "hover:bg-purple-400/10",
    to: "/admin/job-posting",
    activeColor: "bg-purple-400/20",
  },
  {
    icon: Eye,
    label: "Review Applications",
    color: "text-cyan-400",
    hoverColor: "hover:bg-cyan-400/10",
    to: "/admin/swipe-applicants",
    activeColor: "bg-cyan-400/20",
  },
  {
    icon: Bookmark,
    label: "Saved Candidates",
    color: "text-orange-400",
    hoverColor: "hover:bg-orange-400/10",
    to: "/admin/saved-candidates",
    activeColor: "bg-orange-400/20",
  },
  {
    icon: FileText,
    label: "View All Jobs",
    color: "text-indigo-400",
    hoverColor: "hover:bg-indigo-400/10",
    to: "/admin/view-all-jobs",
    activeColor: "bg-indigo-400/20",
  },
  {
    icon: UserCheck,
    label: "Shortlisted Candidates",
    color: "text-emerald-400",
    hoverColor: "hover:bg-emerald-400/10",
    to: "/admin/shortlisted-candidates",
    activeColor: "bg-emerald-400/20",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    color: "text-yellow-400",
    hoverColor: "hover:bg-yellow-400/10",
    to: "/admin/chat",
    activeColor: "bg-yellow-400/20",
  },
  {
    icon: Video,
    label: "Interviews",
    color: "text-red-400",
    hoverColor: "hover:bg-red-400/10",
    to: "/admin/video-call",
    activeColor: "bg-red-400/20",
  },
];

export default function Sidebar() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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
    <nav
      className={`h-[88vh] relative shadow-md p-2 flex flex-col duration-500 bg-gradient-to-t from-gray-900 via-black to-gray-900 text-white ${
        open ? "w-60" : "w-16"
      } border-r border-green-500 rounded-xl`}
    >
      {/* Doom Bubble Animation - Only when open */}
      {open && (
        <div className="absolute top-8 left-8 z-0 pointer-events-none animate-float">
          <div className="w-8 h-8 bg-green-400 rounded-full shadow-xl opacity-70 blur-md animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <div className="px-3 py-2 h-20 flex justify-between items-center relative z-10">
        {open && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-green-400 font-bold text-sm">DOOM'S PANEL</h2>
              <p className="text-gray-400 text-xs">Supreme Control</p>
            </div>
          </div>
        )}
        <Menu
          size={30}
          className={`duration-500 cursor-pointer hover:text-green-400 ${
            !open ? "rotate-180" : ""
          }`}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Body */}
      <ul className="flex-1 space-y-2 relative z-10">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li key={index}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  ` px-3 py-2 my-2 ${
                    item.hoverColor
                  } rounded-md duration-300 cursor-pointer flex gap-3 items-center relative group hover:shadow-lg ${
                    isActive ? item.activeColor : ""
                  }`
                }
              >
                {/* Icon */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <IconComponent
                    size={20}
                    className={`${item.color} w-5 h-5 transition-all duration-200`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-gray-300 group-hover:text-white font-medium text-sm transition-all duration-500
                ${
                  !open ? "w-0 opacity-0" : "w-auto opacity-100"
                } overflow-hidden`}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {!open && (
                  <span className="absolute left-16 bg-gray-800 text-white rounded-md shadow-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="flex items-center gap-3 px-3 py-2 border-t border-gray-700/50 relative z-10">
        <div className="w-8 h-8 flex items-center justify-center">
          <User size={20} className="text-green-400 w-5 h-5" />
        </div>
        {open && (
          <div className="flex justify-between w-full items-center">
            <div className="leading-5">
              <p className="text-gray-300 font-medium text-sm">
                {userInfo.fullName}
              </p>
              <span className="text-xs text-gray-400">{userInfo.email}</span>
            </div>
            <div className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="text-red-500 w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
