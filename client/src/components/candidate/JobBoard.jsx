import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Zap,
  Clock,
  Shield,
  Sword,
  Target,
  Star,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { DISPLAY_ALL_JOBS, GET_JOB_BOARD } from "../../utils/constants";

const JobBoard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(null);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 70; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    setIsLoaded(true);

    // Animate particles
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y <= -5 ? 105 : particle.y - particle.speed,
          opacity: particle.opacity > 0.1 ? particle.opacity - 0.001 : 0.5,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const getJobs = async () => {
    try {
      const response = await apiClient.get(GET_JOB_BOARD, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const totalJobs = response.data.activeJobs;
        const appliedJobsIds = userInfo.appliedJobs.map((item) => item.job);
        const jobs = totalJobs.filter(
          (job) => !appliedJobsIds.includes(job._id)
        );
        console.log(jobs);
        setJobs(jobs.reverse());
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getJobs();
  }, [userInfo.appliedJobs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case "Expert":
        return "text-red-400 bg-red-900/30 border-red-700 shadow-red-500/20";
      case "Advanced":
        return "text-orange-400 bg-orange-900/30 border-orange-700 shadow-orange-500/20";
      case "Intermediate":
        return "text-blue-400 bg-blue-900/30 border-blue-700 shadow-blue-500/20";
      case "Beginner":
        return "text-green-400 bg-green-900/30 border-green-700 shadow-green-500/20";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-700 shadow-gray-500/20";
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "shadow-2xl shadow-amber-500/20 border-amber-500/30";
      case "epic":
        return "shadow-xl shadow-purple-500/20 border-purple-500/30";
      case "rare":
        return "shadow-lg shadow-blue-500/20 border-blue-500/30";
      default:
        return "shadow-md shadow-green-500/20 border-green-500/30";
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case "legendary":
        return <Star className="h-4 w-4 text-amber-400" />;
      case "epic":
        return <Sword className="h-4 w-4 text-purple-400" />;
      case "rare":
        return <Target className="h-4 w-4 text-blue-400" />;
      default:
        return <Shield className="h-4 w-4 text-green-400" />;
    }
  };

  const handleApplyJob = (jobId) => {
    navigate(`/candidate/job-board/apply/${jobId}`);
  };

  return (
    <>
      {jobs && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  transition: "all 0.05s linear",
                }}
              />
            ))}
          </div>

          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
                backgroundSize: "40px 40px",
                animation: "grid-move 20s linear infinite",
              }}
            />
          </div>

          {/* Header with enhanced animations */}
          <div
            className={`bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-b border-green-500/20 relative transform transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg blur-lg animate-pulse"></div>
                  <div className="relative">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent animate-pulse">
                      Mission Control
                    </h1>
                    <p className="text-gray-300 mt-3 text-lg font-medium tracking-wide">
                      Choose your destiny • Forge your legend • Dominate
                      BattleWorld
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">
                      {jobs.length}
                    </div>
                    <div className="text-sm text-gray-300">Active Missions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Job Cards Grid */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs &&
                jobs.map((job, index) => (
                  <div
                    key={job._id}
                    className={`relative bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm rounded-xl border-2 transition-all duration-150 overflow-hidden group cursor-pointer transform hover:scale-105 ${
                      hoveredCard === job._id
                        ? `${getRarityGlow(
                            job.rarity
                          )} translate-y-[-4px] rotate-1`
                        : "border-gray-700/50 shadow-lg hover:shadow-2xl"
                    }`}
                    style={{
                      animation: `slideUp 0.1s ease-out  both`,
                    }}
                    onMouseEnter={() => setHoveredCard(job._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => {
                      handleApplyJob(job._id);
                    }}
                  >
                    {/* Rarity Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-100 ${
                        job.rarity === "legendary"
                          ? "from-amber-500/30 to-yellow-500/30"
                          : job.rarity === "epic"
                          ? "from-purple-500/30 to-pink-500/30"
                          : job.rarity === "rare"
                          ? "from-blue-500/30 to-cyan-500/30"
                          : "from-green-500/30 to-emerald-500/30"
                      }`}
                    />

                    {/* Card Header */}
                    <div className="relative p-6 border-b border-gray-700/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          {getRarityIcon(job.rarity)}
                          <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                            {job.title}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border shadow-lg ${getExperienceColor(
                            job.experienceLevel
                          )} transition-all duration-300 group-hover:scale-110`}
                        >
                          {job.experienceLevel}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {job.description}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="relative p-6 space-y-5">
                      {/* Required Powers */}
                      <div className="transform transition-all duration-200 group-hover:scale-105">
                        <div className="flex items-center mb-3">
                          <Zap className="h-5 w-5 text-green-400 mr-2 animate-pulse" />
                          <span className="text-sm font-bold text-gray-300">
                            Required Powers
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredPowers.map((power, powerIndex) => (
                            <span
                              key={powerIndex}
                              className="px-3 py-1 bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 text-xs rounded-full border border-green-700/50 font-medium hover:from-green-800/60 hover:to-emerald-800/60 transition-all duration-100 transform hover:scale-105"
                              style={{
                                animation: `powerGlow 2s ease-in-out infinite alternate`,
                              }}
                            >
                              {power}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        <MapPin className="h-4 w-4 mr-3 text-green-400 animate-pulse" />
                        <span className="font-medium">{job.location}</span>
                      </div>

                      {/* Openings */}
                      <div className="flex items-center text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        <Users className="h-4 w-4 mr-3 text-green-400 animate-pulse" />
                        <span className="font-medium">
                          {job.openings}{" "}
                          {job.openings === 1 ? "Position" : "Positions"}{" "}
                          Available
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        <Calendar className="h-4 w-4 mr-3 text-green-400 animate-pulse" />
                        <span className="font-medium">
                          Mission Deadline: {formatDate(job.deadline)}
                        </span>
                      </div>

                      {/* Posted Date */}
                      <div className="flex items-center text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        <Clock className="h-4 w-4 mr-3 text-green-400 animate-pulse" />
                        <span className="font-medium">
                          Posted: {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Card Footer */}
                    <div className="relative p-6 pt-0">
                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 group-hover:shadow-2xl group-hover:shadow-green-500/30 transform hover:scale-105 active:scale-95">
                        <Shield className="h-5 w-5 animate-pulse" />
                        <span className="text-lg">APPLY NOW</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>

                    {/* Hover Effect Lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
            </div>

            {/* Enhanced Empty State */}
            {jobs.length === 0 && (
              <div className="text-center py-20 transform transition-all duration-1000 opacity-100">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 max-w-md mx-auto shadow-2xl">
                  <div className="relative">
                    <Clock className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">
                    No Active Missions
                  </h3>
                  <p className="text-gray-500 text-lg">
                    New challenges await. Return to command center soon.
                  </p>
                </div>
              </div>
            )}
          </div>

          <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes powerGlow {
          from {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          to {
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
      `}</style>
        </div>
      )}
    </>
  );
};

export default JobBoard;
