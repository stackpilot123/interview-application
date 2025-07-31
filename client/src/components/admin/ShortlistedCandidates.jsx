import React, { useEffect, useRef, useState } from "react";
import {
    MessageCircle,
    Eye,
    Briefcase,
    Calendar,
    Mail,
    User,
    Star,
    Filter,
    Zap,
    Target,
    Shield,
    Download,
    FileText,
    Sparkles,
    Crown,
} from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { GET_SHORTLISTED_CANDIDATES } from "../../utils/constants";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { setSelectedChatData, setSelectedChatType } from "../../features/chatSlice";

const ShortlistedCandidates = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [acceptedCandidates, setAcceptedCandidates] = useState([]);
    const [likedCandidates, setLikedCandidates] = useState([]);
    const [filter, setFilter] = useState("all");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const cardsSectionRef = useRef();

    const handleMessageClick = (data) =>{
        console.log(data);
        dispatch(setSelectedChatType("contact"));
        dispatch(setSelectedChatData(data));
        navigate("/admin/chat");
    }
    
    const handleFilterClick = () => {
        if (cardsSectionRef.current) {
            cardsSectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    const getShortlistedData = async () => {
        try {
            const response = await apiClient.get(
                GET_SHORTLISTED_CANDIDATES,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setAcceptedCandidates(response.data.acceptedCandidates);
                setLikedCandidates(response.data.likedCandidates);
                console.log(response.data);
            }
        } catch (err) {
            console.error("error in getting the data of shortlisted candidates : ", err.message);
        }
    }
    
    useEffect(() => {
        getShortlistedData();
    }, [])

    const getFilteredCandidates = () => {
        switch (filter) {
            case "liked":
                return likedCandidates;
            case "all":
            default:
                // Combine both arrays and remove duplicates based on user._id
                const allCandidates = [...acceptedCandidates];
                const likedIds = new Set(likedCandidates.map(c => c.user._id));
                
                // Add liked candidates that aren't already in accepted
                likedCandidates.forEach(liked => {
                    if (!acceptedCandidates.find(accepted => accepted.user._id === liked.user._id)) {
                        allCandidates.push(liked);
                    }
                });
                
                // Mark which candidates are liked for UI purposes
                return allCandidates.map(candidate => ({
                    ...candidate,
                    isLiked: likedIds.has(candidate.user._id)
                }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const CandidateModal = ({ candidate, onClose }) => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl shadow-green-500/20 animate-in slide-in-from-bottom duration-500 transform">
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 animate-pulse"></div>
                    <div className="relative flex justify-between items-start">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                                <img
                                    src={candidate.user.profilePicture}
                                    alt={candidate.user.fullName}
                                    className="relative w-24 h-24 rounded-full object-cover border-2 border-gray-600 transform transition-all duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="animate-in slide-in-from-left duration-700">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    {candidate.user.fullName}
                                </h2>
                                <p className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                                    <Mail className="w-4 h-4" />
                                    {candidate.user.email}
                                </p>
                                <p className="text-sm text-gray-400">
                                    @{candidate.user.username}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-400 text-3xl transition-all duration-300 hover:rotate-90 hover:scale-110"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6 custom-scrollbar">
                    <div className="animate-in slide-in-from-bottom duration-500 delay-100">
                        <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Preferred Role
                        </h4>
                        <p className="text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                            {candidate.user.preferredRole}
                        </p>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-150">
                        <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Backstory
                        </h4>
                        <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700 leading-relaxed">
                            {candidate.user.backstory}
                        </p>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-200">
                        <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Combat Style
                        </h4>
                        <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700 leading-relaxed">
                            {candidate.user.combatStyle}
                        </p>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-250">
                        <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Powers & Abilities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {candidate.user.powers.map((power, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-green-900/20 to-green-800/20 p-3 rounded-lg border border-green-700/50 transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-left"
                                    style={{ animationDelay: `${250 + index * 50}ms` }}
                                >
                                    <span className="text-green-300 font-medium">{power}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-300">
                        <h4 className="font-semibold mb-3 text-red-400 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Weaknesses
                        </h4>
                        <div className="space-y-2">
                            {candidate.user.weakness.map((weakness, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-red-900/20 to-red-800/20 p-3 rounded-lg border border-red-700/50 text-red-300 transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-right"
                                    style={{ animationDelay: `${300 + index * 50}ms` }}
                                >
                                    {weakness}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-350">
                        <h4 className="font-semibold mb-3 text-blue-400 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Key Battles
                        </h4>
                        <div className="space-y-2">
                            {candidate.user.keyBattles.map((battle, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 p-3 rounded-lg border border-blue-700/50 text-blue-300 transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-left"
                                    style={{ animationDelay: `${350 + index * 50}ms` }}
                                >
                                    {battle}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom duration-500 delay-400">
                        <h4 className="font-semibold mb-3 text-purple-400 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Team Affiliations
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {candidate.user.teams.map((team, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-900 to-purple-800 text-purple-300 rounded-full text-sm border border-purple-600 transform hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 animate-in slide-in-from-bottom"
                                    style={{ animationDelay: `${400 + index * 30}ms` }}
                                >
                                    {team}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const JobModal = ({ job, onClose }) => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl shadow-blue-500/20 animate-in slide-in-from-top duration-500 transform">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Mission Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-400 text-3xl transition-all duration-300 hover:rotate-90 hover:scale-110"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="animate-in slide-in-from-bottom duration-500 delay-100">
                            <h3 className="font-semibold text-xl text-white mb-3 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                                {job.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                {job.description}
                            </p>
                        </div>

                        <div className="flex items-center text-sm text-gray-400 animate-in slide-in-from-bottom duration-500 delay-200">
                            <Calendar className="w-4 h-4 mr-2" />
                            Mission Posted: {formatDate(job.createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden rounded-xl">
            {/* Add custom scrollbar and animation styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.7);
                }
                .jobs-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .jobs-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .jobs-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(107, 114, 128, 0.5);
                    border-radius: 2px;
                }
                .jobs-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.7);
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                }
                
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }
                
                .sparkle-animation {
                    animation: sparkle 2s ease-in-out infinite;
                }
                
                .glow-pulse {
                    animation: glow-pulse 2s ease-in-out infinite;
                }
                
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                }
            `}</style>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-green-600 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                {/* Additional floating elements */}
                <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-green-400 rounded-full float-animation"></div>
                <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full float-animation" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/3 left-2/3 w-5 h-5 bg-purple-400 rounded-full float-animation" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
                <div className="mb-10 animate-in slide-in-from-top duration-1000">
                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                        Elite{" "}
                        <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Warriors
                        </span>
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Command your selected champions for BattleWorld supremacy
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-8 animate-in slide-in-from-left duration-1000 delay-200">
                    <div className="flex items-center gap-4 mb-6">
                        <Filter className="w-6 h-6 text-green-400 animate-bounce" />
                        <h2 className="text-green-400 font-bold text-lg sm:text-xl">
                            Combat Ready Status
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div
                            onClick={() => {
                                setFilter("all");
                                handleFilterClick();
                            }}
                            className={`group relative p-4 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                                filter === "all"
                                    ? "bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-blue-500 shadow-2xl shadow-blue-500/30"
                                    : "bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20"
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex flex-col items-center text-center">
                                <div className="p-3 sm:p-4 rounded-full bg-blue-600/20 mb-3 sm:mb-4 group-hover:animate-pulse">
                                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                                </div>
                                <span className="font-bold text-base sm:text-lg mb-2">All Champions</span>
                                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    {getFilteredCandidates().length}
                                </span>
                                <div className="text-xs sm:text-sm text-gray-400 mt-2">
                                    Ready for Battle
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                setFilter("liked");
                                handleFilterClick();
                            }}
                            className={`group relative p-4 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                                filter === "liked"
                                    ? "bg-gradient-to-br from-red-900/50 to-red-700/50 border-red-500 shadow-2xl shadow-red-500/30"
                                    : "bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/20"
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex flex-col items-center text-center">
                                <div className="p-3 sm:p-4 rounded-full bg-red-600/20 mb-3 sm:mb-4 group-hover:animate-pulse">
                                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 fill-current" />
                                </div>
                                <span className="font-bold text-base sm:text-lg mb-2">Elite Favorites</span>
                                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                                    {likedCandidates.length}
                                </span>
                                <div className="text-xs sm:text-sm text-gray-400 mt-2">
                                    Premium Selection
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Candidates Grid */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    ref={cardsSectionRef}
                >
                    {getFilteredCandidates().map((candidate, index) => (
                        <div
                            key={candidate.user._id}
                            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 animate-in slide-in-from-bottom flex flex-col"
                            style={{ 
                                minHeight: '520px',
                                animationDelay: `${index * 100}ms`
                            }}
                            onMouseEnter={() => setHoveredCard(candidate.user._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Elite Badge for liked candidates */}
                            {filter === "all" && candidate.isLiked && (
                                <div className="absolute -top-1 -right-1 z-10 animate-slide-up">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 blur-lg opacity-75 glow-pulse"></div>
                                        <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-2 rounded-bl-2xl rounded-tr-2xl shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                            <div className="flex items-center gap-1">
                                                <Crown className="w-4 h-4 text-white animate-pulse" />
                                                <span className="text-xs font-bold text-white">ELITE</span>
                                            </div>
                                        </div>
                                        {hoveredCard === candidate.user._id && (
                                            <>
                                                <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-yellow-300 sparkle-animation" />
                                                <Sparkles className="absolute -bottom-2 -right-2 w-3 h-3 text-amber-300 sparkle-animation" style={{ animationDelay: '1s' }} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative p-4 sm:p-6 flex flex-col flex-1">
                                {/* Profile Section */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="relative group/avatar">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur opacity-0 group-hover/avatar:opacity-75 transition duration-1000 group-hover/avatar:duration-200 animate-pulse"></div>
                                        <img
                                            src={candidate.user.profilePicture}
                                            alt={candidate.user.fullName}
                                            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-600 transform transition-all duration-500 group-hover:scale-110"
                                        />
                                        {hoveredCard === candidate.user._id && (
                                            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-1 group-hover:text-green-400 transition-colors duration-300">
                                            {candidate.user.fullName}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-400 truncate flex items-center mb-1">
                                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="truncate">{candidate.user.email}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            @{candidate.user.username}
                                        </p>
                                    </div>
                                    <button className="p-2 sm:p-3 text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 group-hover:animate-pulse cursor-pointer" onClick={()=>handleMessageClick(candidate)}>
                                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6"/>
                                    </button>
                                </div>

                                {/* View Profile Button */}
                                <button
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className="w-full mb-6 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-green-600 hover:to-blue-600 text-gray-200 hover:text-white rounded-xl transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm border border-gray-600 hover:border-transparent transform hover:scale-105 group-hover:shadow-lg relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                                    <span className="relative z-10">Access Full Dossier</span>
                                </button>

                                {/* Jobs Section - Fixed height with scroll */}
                                <div className="flex-1 flex flex-col min-h-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-green-400 flex items-center gap-2 mb-3 group-hover:animate-pulse">
                                        <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Missions Assigned ({candidate.jobs.length})
                                    </h4>
                                    <div className="flex-1 overflow-y-auto jobs-scrollbar pr-2 space-y-3" style={{ maxHeight: '200px' }}>
                                        {candidate.jobs.map((item, jobIndex) => (
                                            <div
                                                key={item._id}
                                                className="group/job bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl p-3 sm:p-4 border border-gray-600/50 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 animate-in slide-in-from-right relative overflow-hidden"
                                                style={{ animationDelay: `${jobIndex * 100}ms` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover/job:translate-x-full transition-transform duration-1000"></div>
                                                <div className="relative flex justify-between items-start mb-2 sm:mb-3">
                                                    <h5 className="font-semibold text-white text-xs sm:text-sm group-hover/job:text-green-400 transition-colors duration-300 pr-2">
                                                        {item.job?.title || "Mission Classified"}
                                                    </h5>
                                                    <button
                                                        onClick={() => item.job && setSelectedJob(item.job)}
                                                        className="text-green-400 hover:text-blue-400 p-1.5 sm:p-2 hover:bg-green-500/20 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12 flex-shrink-0"
                                                    >
                                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                                {item.job?.createdAt && (
                                                    <p className="text-xs text-gray-400 flex items-center group-hover/job:text-green-300 transition-colors duration-300">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                        Deployed: {formatDate(item.job.createdAt)}
                                                    </p>
                                                )}
                                                {(item.resumeFile || item.resumeText) && (
                                                    <div className="mt-2 flex items-center text-xs text-blue-400">
                                                        <FileText className="w-3 h-3 mr-1 animate-pulse" />
                                                        <span>Resume submitted</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer with like indicator for liked candidates */}
                            {filter === "liked" && (
                                <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 px-4 sm:px-6 py-3 sm:py-4 border-t border-red-700/50 animate-in slide-in-from-bottom duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse"></div>
                                    <div className="relative flex items-center text-red-400 text-xs sm:text-sm font-semibold">
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 fill-current animate-pulse" />
                                        Elite Selection
                                        {hoveredCard === candidate.user._id && (
                                            <Sparkles className="ml-2 w-4 h-4 text-yellow-400 sparkle-animation" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {getFilteredCandidates().length === 0 && (
                    <div className="text-center py-16 animate-in fade-in duration-1000">
                        <div className="w-24 h-24 mx-auto mb-6 text-gray-600 relative">
                            <User className="w-full h-full animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute -inset-4">
                                <Sparkles className="absolute top-0 left-1/2 w-4 h-4 text-green-400 sparkle-animation" />
                                <Sparkles className="absolute bottom-0 right-1/4 w-3 h-3 text-blue-400 sparkle-animation" style={{ animationDelay: '1s' }} />
                                <Sparkles className="absolute top-1/2 left-0 w-5 h-5 text-purple-400 sparkle-animation" style={{ animationDelay: '2s' }} />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                            No warriors found
                        </h3>
                        <p className="text-gray-400 text-base sm:text-lg px-4">
                            {filter === "liked"
                                ? "No elite champions selected yet. Begin your recruitment!"
                                : "No warriors ready for battle. Initiate the selection process!"}
                        </p>
                    </div>
                )}

                {/* Modals */}
                {selectedCandidate && (
                    <CandidateModal
                        candidate={selectedCandidate}
                        onClose={() => setSelectedCandidate(null)}
                    />
                )}

                {selectedJob && (
                    <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
                )}
            </div>
        </div>
    );
};

export default ShortlistedCandidates;