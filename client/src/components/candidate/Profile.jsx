import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Zap,
  Shield,
  Sword,
  Users,
  Target,
  Plus,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "../../lib/apiClient";
import { UPDATE_PROFILE } from "../../utils/constants";
import { setNotify } from "../../features/notifySlice";
import { setUserInfo } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import ProfilePic from "./ProfilePic";

const Profile = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: userInfo.username ? userInfo.username : "",
    backstory: userInfo.backstory ? userInfo.backstory : "",
    powers: userInfo.powers,
    weaknesses: userInfo.weaknesses,
    keyBattles: userInfo.keyBattles,
    teams: userInfo.teams,
    combatStyle: userInfo.combatStyle ? userInfo.combatStyle : "",
    preferredRole: userInfo.preferredRole ? userInfo.preferredRole : "",
  });

  const [dropdownStates, setDropdownStates] = useState({
    combatStyle: false,
    preferredRole: false,
  });

  const combatStyleRef = useRef(null);
  const preferredRoleRef = useRef(null);

  const combatStyles = [
    { value: "melee", label: "Melee Combat", icon: "⚔️" },
    { value: "ranged", label: "Ranged Combat", icon: "🏹" },
    { value: "magic", label: "Mystical Arts", icon: "🔮" },
    { value: "tech", label: "Technology-based", icon: "🤖" },
    { value: "stealth", label: "Stealth Operations", icon: "🥷" },
    { value: "berserker", label: "Berserker", icon: "😤" },
    { value: "tactical", label: "Tactical Warfare", icon: "🎯" },
  ];

  const preferredRoles = [
    { value: "frontline", label: "Frontline Warrior", icon: "🛡️" },
    { value: "support", label: "Support Specialist", icon: "🔧" },
    { value: "strategist", label: "Battle Strategist", icon: "🧠" },
    { value: "assassin", label: "Stealth Assassin", icon: "🗡️" },
    { value: "tank", label: "Heavy Tank", icon: "🏰" },
    { value: "scout", label: "Scout/Reconnaissance", icon: "👁️" },
    { value: "commander", label: "Field Commander", icon: "👑" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        combatStyleRef.current &&
        !combatStyleRef.current.contains(event.target)
      ) {
        setDropdownStates((prev) => ({ ...prev, combatStyle: false }));
      }
      if (
        preferredRoleRef.current &&
        !preferredRoleRef.current.contains(event.target)
      ) {
        setDropdownStates((prev) => ({ ...prev, preferredRole: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleDropdown = (field) => {
    setDropdownStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectOption = (field, value) => {
    handleInputChange(field, value);
    setDropdownStates((prev) => ({ ...prev, [field]: false }));
  };

  const CustomDropdown = ({
    field,
    label,
    icon,
    options,
    value,
    dropdownRef,
  }) => {
    const isOpen = dropdownStates[field];
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-green-400 font-semibold text-sm uppercase tracking-wide">
            {label}
          </label>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => toggleDropdown(field)}
            className={`w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-left text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 flex items-center justify-between hover:bg-gray-800/70 ${
              isOpen ? "ring-2 ring-green-500 border-transparent" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              {selectedOption ? (
                <>
                  <span className="text-lg">{selectedOption.icon}</span>
                  <span>{selectedOption.label}</span>
                </>
              ) : (
                <span className="text-gray-500">
                  Select {label.toLowerCase()}
                </span>
              )}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? "opacity-100 pointer-events-auto transform translate-y-0"
                : "opacity-0 pointer-events-none transform -translate-y-2"
            }`}
            style={{ display: isOpen ? "block" : "none" }}
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(field, option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3 ${
                    value === option.value
                      ? "bg-green-600/20 text-green-400"
                      : "text-white"
                  } ${index === 0 ? "border-t-0" : "border-t border-gray-700"}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderArrayField = (field, label, icon) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-green-400 font-semibold text-sm uppercase tracking-wide">
          {label}
        </label>
      </div>
      {formData[field].map((item, index) => (
        <div key={index} className="flex gap-2 group">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800/70"
            placeholder={`Enter ${label.toLowerCase().slice(0, -1)}`}
          />
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="p-3 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 rounded-lg transition-all duration-200 transform hover:scale-105 opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-green-400 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
      >
        <Plus className="w-4 h-4" />
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  const validateProfileData = () => {
    // let {
    //   backstory,
    //   combatStyle,
    //   keyBattles,
    //   powers,
    //   preferredRole,
    //   teams,
    //   username,
    //   weaknesses,
    // } = formData;

    // if (formData.username !== "") {
    //   if (formData.username.length <= 3 || formData.username.length >= 20) {
    //     dispatch(
    //       setNotify({
    //         message: "Username must be 3 20 characters",
    //         type: "info",
    //       })
    //     );
    //     return false;
    //   }
    //   if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    //     dispatch(
    //       setNotify({
    //         message:
    //           "Username can only contain letters, numbers, and underscores.",
    //         type: "info",
    //       })
    //     );
    //     return false;
    //   }
    // }
    return true;
  };
  const handleSubmit = async () => {
    if (validateProfileData()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE,
          { formData },
          { withCredentials: true }
        );

        if (response.status === 200) {
          // console.log(response.data.user);
          dispatch(setUserInfo({ ...userInfo, ...response.data.user }));
          setFormData(response.data.user);
          navigate("/candidate");
          dispatch(
            setNotify({
              message: "Profile Saved – Multiversal identity stabilized.",
              type: "success",
            })
          );
          // console.log(userInfo);
        }
      } catch (err) {
        dispatch(
          setNotify({
            message: "Profile updation failed! Please try again",
            type: "error",
          })
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-black/30 bg-gradient-to-b from-gray-900/40 via-gray-900/55 to-gray-900 md:p-6 rounded-4xl md:mx-5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            <span className="text-green-400 animate-pulse">WARRIOR</span>{" "}
            PROFILE
          </h1>
          <p className="text-gray-400">
            Join the elite ranks of BattleWorld's finest
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 animate-pulse"></div>
        </div>

        {/* Profile completion div  */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Profile Completion</span>
              <span className="text-sm text-green-400 font-semibold">
                {userInfo.profilePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userInfo.profilePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>


        <ProfilePic/>


        {/* Form */}
        <div className="space-y-8 mt-4">
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-600">
            {/* Name */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                <label className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                  Full Name
                </label>
              </div>
              <input
                type="text"
                value={userInfo.fullName}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800/70"
                placeholder="Enter your full name"
                readOnly
              />
            </div>

            {/* Username */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                <label className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                  Warrior Name
                </label>
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800/70"
                placeholder="Enter your warrior name"
              />
            </div>

            {/* Backstory */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <label className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                  Origin Story
                </label>
              </div>
              <textarea
                value={formData.backstory}
                onChange={(e) => handleInputChange("backstory", e.target.value)}
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none hover:bg-gray-800/70"
                placeholder="Tell us your origin story..."
              />
            </div>

            {/* Powers */}
            <div className="mb-8">
              {renderArrayField(
                "powers",
                "Powers",
                <Zap className="w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Weaknesses */}
            <div className="mb-8">
              {renderArrayField(
                "weaknesses",
                "Weaknesses",
                <Shield className="w-5 h-5 text-red-400" />
              )}
            </div>

            {/* Key Battles */}
            <div className="mb-8">
              {renderArrayField(
                "keyBattles",
                "Key Battles",
                <Sword className="w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Teams */}
            <div className="mb-8">
              {renderArrayField(
                "teams",
                "Teams",
                <Users className="w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Combat Style */}
            <div className="mb-8">
              <CustomDropdown
                field="combatStyle"
                label="Combat Style"
                icon={<Target className="w-5 h-5 text-green-400" />}
                options={combatStyles}
                value={formData.combatStyle}
                dropdownRef={combatStyleRef}
              />
            </div>

            {/* Preferred Role */}
            <div className="mb-8">
              <CustomDropdown
                field="preferredRole"
                label="Preferred Role"
                icon={<Target className="w-5 h-5 text-green-400" />}
                options={preferredRoles}
                value={formData.preferredRole}
                dropdownRef={preferredRoleRef}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 hover:shadow-2xl flex gap-2 text-xs md:text-lg items-center justify-between cursor-pointer"
              >
                UPDATE BATTLE CREDENTIALS
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="512"
                    height="512"
                    x="0"
                    y="0"
                    viewBox="0 0 512 512"
                    // style={"enable-background:new 0 0 512 512"}
                    className="md:w-6 md:h-6 w-4 h-4"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M450.59 320.82a7.5 7.5 0 0 0-2.19-5.3l-15.29-15.29a29.15 29.15 0 0 0-41.17 0l-91.71 91.71a29.15 29.15 0 0 0 0 41.17l15.29 15.29a7.51 7.51 0 0 0 10.6 0L448.4 326.12a7.5 7.5 0 0 0 2.19-5.3zM412.52 383.21l-29.31 29.31L431 460.35A49.61 49.61 0 0 1 460.35 431zM501.91 453.09a34.5 34.5 0 1 0 0 48.82 34.56 34.56 0 0 0 0-48.82zM120.06 300.23a29.15 29.15 0 0 0-41.17 0L63.6 315.52a7.51 7.51 0 0 0 0 10.6L185.88 448.4a7.51 7.51 0 0 0 10.6 0l15.29-15.29a29.15 29.15 0 0 0 0-41.17zM51.65 431A49.61 49.61 0 0 1 81 460.35l47.82-47.83-29.34-29.31zM10.09 453.09a34.52 34.52 0 1 0 48.82 0 34.58 34.58 0 0 0-48.82 0zM23.07 123.6a7.54 7.54 0 0 0 2.51 4.26L172.65 252.3l31.65-37.4-49.3-49.26a7.5 7.5 0 1 1 10.6-10.6l48.4 48.37 32.16-38-118.3-139.83a7.54 7.54 0 0 0-4.26-2.51L9 .15A7.5 7.5 0 0 0 .15 9zM340.78 330.18l24.27-24.28-27.47-32.46-29 24.54zM330.18 340.78 297.1 307.7l-29.49 24.95 38.3 32.4zM171.22 330.18 346.36 155a7.5 7.5 0 0 1 10.6 10.6L181.82 340.78l24.27 24.27 280.33-237.19a7.54 7.54 0 0 0 2.51-4.26L511.85 9A7.5 7.5 0 0 0 503 .15L388.4 23.07a7.54 7.54 0 0 0-4.26 2.51L147 305.91z"
                        fill="#ffffff"
                        opacity="1"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
          
      `}</style>
    </div>
  );
};

export default Profile;
