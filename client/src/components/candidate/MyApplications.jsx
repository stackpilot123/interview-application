import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { GET_APPLIED_JOBS } from "../../utils/constants";

const MyApplications = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getAppliedJobs = async () => {
    try {
      const response = await apiClient.get(GET_APPLIED_JOBS, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAppliedJobs(response.data.appliedJobs);
        console.log(response.data.appliedJobs);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAppliedJobs();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case "accepted":
        return (
          <CheckCircle className="w-4 h-4 text-green-400 animate-bounce" />
        );
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-400 animate-pulse" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-400 border-yellow-400/50 shadow-lg shadow-yellow-500/20";
      case "accepted":
        return "bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-400 border-green-400/50 shadow-lg shadow-green-500/20";
      case "rejected":
        return "bg-gradient-to-r from-red-900/30 to-rose-900/30 text-red-400 border-red-400/50 shadow-lg shadow-red-500/20";
      default:
        return "bg-gradient-to-r from-gray-900/30 to-slate-900/30 text-gray-400 border-gray-400/50";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  let filteredJobs = [];
  if (appliedJobs) {
    filteredJobs = appliedJobs.filter((app) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "pending") {
        return app.status === "pending" || app.status === "savedPending";
      }
      return app.status === selectedFilter;
    });
  }

  const statusCounts = {
    all: appliedJobs?.length || 0,
    pending: appliedJobs?.filter((app) => app.status === "pending" || app.status === "savedPending").length || 0,
    accepted:
      appliedJobs?.filter((app) => app.status === "accepted").length || 0,
    rejected:
      appliedJobs?.filter((app) => app.status === "rejected").length || 0,
  };

  const filterOptions = [
    {
      key: "all",
      label: "All Applications",
      icon: Filter,
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "from-blue-400 to-purple-500",
      shadowColor: "shadow-blue-500/25",
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      gradient: "from-yellow-500 to-orange-600",
      hoverGradient: "from-yellow-400 to-orange-500",
      shadowColor: "shadow-yellow-500/25",
    },
    {
      key: "accepted",
      label: "Accepted",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-400 to-emerald-500",
      shadowColor: "shadow-green-500/25",
    },
    {
      key: "rejected",
      label: "Rejected",
      icon: XCircle,
      gradient: "from-red-500 to-rose-600",
      hoverGradient: "from-red-400 to-rose-500",
      shadowColor: "shadow-red-500/25",
    },
  ];

  const handleDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    // a.download = .name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      {filterOptions && appliedJobs && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Animated Header */}
              <div
                className={`mb-8 transform transition-all duration-1000 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="relative">
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent mb-4">
                    My Applications
                  </h1>
                  <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-gray-400 text-lg mt-6 animate-fade-in">
                  Track your journey to join BattleWorld's elite forces
                </p>
              </div>

              {/* Enhanced Filter System */}
              <div
                className={`mb-8 transform transition-all duration-1000 delay-200 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="w-5 h-5 text-green-400 animate-pulse" />
                      <h3 className="text-lg font-semibold text-green-400">
                        Filter Applications
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {filterOptions.map((filter, index) => {
                        const Icon = filter.icon;
                        const isActive = selectedFilter === filter.key;

                        return (
                          <button
                            key={filter.key}
                            onClick={() => setSelectedFilter(filter.key)}
                            className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
                              isActive
                                ? `bg-gradient-to-r ${filter.gradient} shadow-xl ${filter.shadowColor} scale-105`
                                : "bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/50"
                            }`}
                            style={{
                              animationDelay: `${index * 100}ms`,
                            }}
                          >
                            {/* Animated background effect */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${filter.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            ></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                              <Icon
                                className={`w-6 h-6 mb-2 transition-all duration-300 ${
                                  isActive
                                    ? "text-white animate-bounce"
                                    : "text-gray-400 group-hover:text-white"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                                  isActive
                                    ? "text-white"
                                    : "text-gray-300 group-hover:text-white"
                                }`}
                              >
                                {filter.label}
                              </span>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-600/50 text-gray-300 group-hover:bg-white/20 group-hover:text-white"
                                }`}
                              >
                                {statusCounts[filter.key]}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Applications Grid */}
              <div className="space-y-6">
                {filteredJobs.length === 0 ? (
                  <div
                    className={`text-center py-16 transform transition-all duration-500 ${
                      isLoaded
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        No Applications Found
                      </h3>
                      <p className="text-gray-500">
                        {selectedFilter === "all"
                          ? "You haven't applied to any positions yet."
                          : `No ${selectedFilter} applications found.`}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredJobs.reverse().map((application, index) => (
                    <div
                      key={index}
                      className={`group transform transition-all duration-500 hover:scale-[1.02] ${
                        isLoaded
                          ? "translate-x-0 opacity-100"
                          : "translate-x-10 opacity-0"
                      }`}
                    >
                      <div className="relative">
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                            {/* Job Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                  <h3 className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                                    {application.job?.title || "No Title"}
                                  </h3>
                                  <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${application.status === "savedPending"?getStatusColor("pending"):getStatusColor(application.status)}`}
                                  >
                                    {application.status === "savedPending"?getStatusIcon("pending"):getStatusIcon(application.status)}
                                    <span className="font-semibold">
                                      {
                                        application.status==="savedPending"?"Pending": application.status
                                        ? application.status
                                            .charAt(0)
                                            .toUpperCase() +
                                          application.status.slice(1)
                                        : "Unknown"
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-gray-300 leading-relaxed text-lg group-hover:text-white transition-colors duration-300">
                                {application.job?.description ||
                                  "No description available"}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  {
                                    icon: MapPin,
                                    text:
                                      application.job?.location ||
                                      "Location not specified",
                                  },
                                  {
                                    icon: Calendar,
                                    text: application.job?.deadline
                                      ? `Deadline: ${formatDate(
                                          application.job.deadline
                                        )}`
                                      : "No deadline specified",
                                  },
                                  {
                                    icon: Users,
                                    text: application.job?.openings
                                      ? `${application.job.openings} openings`
                                      : "Openings not specified",
                                  },
                                  {
                                    icon: AlertCircle,
                                    text:
                                      application.job?.experienceLevel ||
                                      "Experience level not specified",
                                  },
                                ].map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                                  >
                                    <item.icon className="w-5 h-5 text-green-400" />
                                    <span className="text-sm">{item.text}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Animated Required Powers */}
                              {application.job?.requiredPowers &&
                                application.job.requiredPowers.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                      Required Powers
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {application.job.requiredPowers.map(
                                        (power, powerIndex) => (
                                          <span
                                            key={powerIndex}
                                            className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-green-400 text-sm rounded-full border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105"
                                          >
                                            {power}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Enhanced Resume Section */}
                            <div className="xl:w-80">
                              <div className="relative group/resume">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-xl blur-sm opacity-0 group-hover/resume:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-gray-700/30 backdrop-blur-sm rounded-xl p-5 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
                                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-green-400 animate-pulse" />
                                    Your Application
                                  </h4>

                                  {application.resume?.resumeFile && (
                                    <div className="mb-4 animate-slide-in">
                                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg border border-gray-500/30 hover:border-green-500/30 transition-all duration-300 group/file">
                                        <div className="flex items-center gap-3">
                                          <FileText className="w-5 h-5 text-green-400 group-hover/file:animate-bounce" />
                                          <span className="text-sm text-gray-300 truncate max-w-[140px]">
                                            resume.pdf
                                            {/* {application.resume.resumeFile} */}
                                          </span>
                                        </div>
                                        <button
                                          className="text-green-400 hover:text-green-300 transition-colors duration-300 hover:scale-110 transform"
                                          onClick={() => {
                                            handleDownload(
                                              application.resume.resumeFile
                                            );
                                          }}
                                        >
                                          <Download className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {application.resume?.resumeText && (
                                    <div className="mb-4 animate-slide-in">
                                      <div className="p-4 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg border border-gray-500/30 hover:border-green-500/30 transition-all duration-300 group/text">
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-sm text-gray-400 font-medium">
                                            Cover Letter
                                          </span>
                                          <button className="text-green-400 hover:text-green-300 transition-colors duration-300 hover:scale-110 transform">
                                            <Eye className="w-4 h-4" />
                                          </button>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-3 group-hover/text:text-white transition-colors duration-300">
                                          {application.resume.resumeText}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {!application.resume?.resumeFile &&
                                    !application.resume?.resumeText && (
                                      <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-600/30 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                                          <FileText className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                          No resume submitted
                                        </p>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
        </div>
      )}
    </>
  );
};

export default MyApplications;
