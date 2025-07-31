import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Eye, Edit, Trash2, Plus, Zap, Shield, Star, Funnel } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { DISPLAY_ALL_JOBS } from '../../utils/constants';
import {useNavigate} from "react-router-dom";

const ViewAllJobs = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredJob, setHoveredJob] = useState(null);

  const getJobData = async () => {
    try {
      const response = await apiClient.get(
        DISPLAY_ALL_JOBS,
        {withCredentials: true}
      );
      if(response.status === 200){
        console.log(response.data.jobs);
        setJobs(response.data.jobs);

      }
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    const mockJobs = [
      {
        "_id": "6873d0b209cc96c02369d70c",
        "title": "Dimensional Scout",
        "description": "Survey unstable rifts and report anomalies back to Doom's central command. Stealth and agility preferred.",
        "requiredPowers": [
          "Dimensional Awareness",
          "Stealth",
          "Rapid Regeneration"
        ],
        "experienceLevel": "Intermediate",
        "location": "Zone 7 - Quantum Fringe",
        "deadline": "2025-09-10T00:00:00.000Z",
        "openings": 5,
        "createdAt": "2025-07-13T15:28:50.817Z",
        "candidatesApplied": [1, 2, 3]
      },
      {
        "_id": "6873d0b209cc96c02369d70d",
        "title": "BattleWorld Tactician",
        "description": "Lead strategic assaults against multiversal threats. Command experience and tactical brilliance required.",
        "requiredPowers": [
          "Tactical Genius",
          "Leadership",
          "Battle Strategy"
        ],
        "experienceLevel": "Expert",
        "location": "Doom's Citadel",
        "deadline": "2025-08-15T00:00:00.000Z",
        "openings": 2,
        "createdAt": "2025-07-12T10:15:30.817Z",
        "candidatesApplied": [1, 2, 3, 4, 5, 6, 7]
      },
      {
        "_id": "6873d0b209cc96c02369d70e",
        "title": "Mystic Enforcer",
        "description": "Patrol the mystical barriers of BattleWorld. Arcane knowledge and combat prowess essential.",
        "requiredPowers": [
          "Mystical Arts",
          "Energy Manipulation",
          "Barrier Creation"
        ],
        "experienceLevel": "Advanced",
        "location": "Mystic Sanctum",
        "deadline": "2025-08-20T00:00:00.000Z",
        "openings": 3,
        "createdAt": "2025-07-11T08:45:12.817Z",
        "candidatesApplied": [1, 2]
      }
    ];
    getJobData();
    setTimeout(() => {
      setLoading(false);
      setIsVisible(true);
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInMs = now - posted;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getExperienceLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return new Date(job.deadline) > new Date();
    if (filter === 'expired') return new Date(job.deadline) <= new Date();
    return true;
  });

  const filterOptions = [
    { id: 'all', label: 'All Jobs', count: jobs.length, icon: Funnel },
    { id: 'active', label: 'Active', count: jobs.filter(j => new Date(j.deadline) > new Date()).length, icon: Zap },
    { id: 'expired', label: 'Expired', count: jobs.filter(j => new Date(j.deadline) <= new Date()).length, icon: Clock }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-6 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded-md w-64 mb-8 animate-shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 h-100 animate-pulse-glow"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-6 rounded-xl w-screen md:w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-text-glow">
              Job Postings
            </h1>
            <p className="text-gray-400 animate-fade-in-up">Manage all BattleWorld recruitment opportunities</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 overflow-x-auto">
            {/* Enhanced Filter Tabs */}
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50 shadow-2xl min-w-fit">
              <div className="flex relative">
                {filterOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setFilter(option.id)}
                      className={`relative px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 group ${
                        filter === option.id 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={16} className={`transition-all duration-300 ${
                        filter === option.id ? 'rotate-12 scale-110' : 'group-'
                      }`} />
                      <span className="whitespace-nowrap">{option.label}</span>
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === option.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                      }`}>
                        {option.count}
                      </span>
                    </button>
                  );
                })}
                
                {/* Animated Background */}
                <div 
                  className="absolute top-2 bottom-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg transition-all duration-500 ease-out shadow-lg"
                  style={{
                    left: `${filterOptions.findIndex(o => o.id === filter) * 33.33}%`,
                    width: '33.33%',
                    transform: 'translateX(2px)'
                  }}
                />
              </div>
            </div>
            
            {/* New Job Button */}
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-green-500/25  active:scale-95 group mx-auto" onClick={()=>navigate("/admin/job-posting")}>
              <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
              <span>New Job</span>
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div 
              key={job._id} 
              className={`bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2  ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none'
              }}
              onMouseEnter={() => setHoveredJob(job._id)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              <div className="p-6 relative overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Icons */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center transition-all duration-500 ${
                  hoveredJob === job._id ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
                }`}>
                  <Star size={20} className="text-green-400" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-all duration-300 ">
                      {job.title}
                    </h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300  ${getExperienceLevelColor(job.experienceLevel)}`}>
                      {job.experienceLevel}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
                  {job.description}
                </p>

                {/* Required Powers */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2 group-hover:text-green-400 transition-colors duration-300">Required Powers</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredPowers.slice(0, 3).map((power, powerIndex) => (
                      <span 
                        key={powerIndex} 
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer "
                        
                      >
                        {power}
                      </span>
                    ))}
                    {job.requiredPowers.length > 3 && (
                      <span className="text-gray-400 text-xs px-2 py-1 hover:text-green-400 transition-colors duration-300">
                        +{job.requiredPowers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ">
                    <MapPin size={16} className="text-green-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ">
                    <Calendar size={16} className="text-blue-400" />
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ">
                    <Users size={16} className="text-purple-400" />
                    <span>{job.openings} openings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 ">
                    <Clock size={16} className="text-orange-400" />
                    <span>Posted {getTimeAgo(job.createdAt)}</span>
                  </div>
                </div>

                {/* Applications */}
                <div className="border-t border-gray-700/50 pt-4 group-hover:border-green-500/30 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-12">
                        <Users size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-green-400">
                          {job.candidatesApplied.length} Applications
                        </p>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {job.candidatesApplied.length > 0 ? 'View candidates' : 'No applications yet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 animate-pulse ${
                        new Date(job.deadline) > new Date() ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
                      }`}></div>
                      <span className={`text-xs font-medium transition-all duration-300 ${
                        new Date(job.deadline) > new Date() ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {new Date(job.deadline) > new Date() ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className={`text-center py-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Jobs Found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't created any job postings yet."
                : `No ${filter} jobs found.`
              }
            </p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-green-500/25  active:scale-95 group" onClick={()=>navigate("/admin/job-posting")}>
              <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
              <span>Create Your First Job</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { text-shadow: 0 0 30px rgba(34, 197, 94, 0.8); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.2); }
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-fade-in-up {
          animation: slideInUp 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
};

export default ViewAllJobs;