import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  X,
  Check,
  RotateCcw,
  UserRoundCheck,
  Clock,
  MapPin,
  Award,
  Users,
} from "lucide-react";
import CandidateCard from "./CandidateCard";
import { apiClient } from "../../lib/apiClient";

import { useNavigate } from "react-router-dom";
import { GET_SAVED_CANDIDATES, LEFT_SWIPE_ROUTE, RIGHT_SWIPE_ROUTE, UNDO_SWIPE_ROUTE } from "../../utils/constants";

const SavedCandidates = ({ onBack }) => {
  const navigate = useNavigate();

  const [savedCandidates, setSavedCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  const getSavedCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(GET_SAVED_CANDIDATES, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSavedCandidates(response.data.savedCandidatesData.reverse() || []);
        console.log(response.data.savedCandidatesData)
      }
    } catch (err) {
      console.error("Error fetching saved candidates:", err.message);
      setSavedCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSavedCandidates();
  }, []);

  const currentCandidate = savedCandidates[currentIndex];
  const SWIPE_THRESHOLD = 100;

  // Handle swipe API calls
  const handleSwipeRight = async (candidateData) => {
    try {
      const response = await apiClient.post(
        RIGHT_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.job._id,
          resumeText: candidateData.resume?.resumeText,
          resumeFile: candidateData.resume?.resumeFile,
          status :"saved"
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("✅ Candidate accepted:", response.data);
      }
    } catch (err) {
      console.error("Error in right swipe:", err.message);
    }
  };

  const handleSwipeLeft = async (candidateData) => {
    try {
      const response = await apiClient.post(
        LEFT_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.job._id,
          resumeText: candidateData.resume?.resumeText,
          status: "saved"
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("❌ Candidate rejected:", response.data);
      }
    } catch (err) {
      console.error("Error in left swipe:", err.message);
    }
  };

  const nextCandidate = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const performSwipe = (direction) => {
    if (!currentCandidate || isAnimating) return;

    setIsAnimating(true);

    // Store current state in history
    const historyEntry = {
      candidateIndex: currentIndex,
      candidate: currentCandidate,
      direction: direction,
      timestamp: Date.now(),
    };

    // Call appropriate API
    if (direction === "right") {
      handleSwipeRight(currentCandidate);
    } else if (direction === "left") {
      handleSwipeLeft(currentCandidate);
    }

    // Animate the swipe
    const swipeDistance = direction === "right" ? 1000 : -1000;
    setDragOffset({ x: swipeDistance, y: 0 });

    setTimeout(() => {
      nextCandidate();
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection("");
      setIsAnimating(false);
      setSwipeHistory((prev) => [...prev, historyEntry]);
    }, 300);
  };

  const handleUndo = async () => {
    if (swipeHistory.length === 0 || isAnimating) return;

    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastSwipe.candidateIndex);

    try {
      await apiClient.post(
        UNDO_SWIPE_ROUTE,
        {
          userId: lastSwipe.candidate.user._id,
          jobId: lastSwipe.candidate.job._id,
          direction: lastSwipe.direction,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error undoing swipe:", err);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isAnimating) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = e.clientX - centerX;

    setDragOffset({ x: offsetX, y: 0 });
    setSwipeDirection(offsetX > 0 ? "right" : "left");
  };

  const handleMouseUp = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);

    const { x } = dragOffset;

    if (Math.abs(x) > SWIPE_THRESHOLD) {
      performSwipe(x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection("");
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = touch.clientX - centerX;
    setDragOffset({ x: offsetX, y: 0 });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = touch.clientX - centerX;
    setDragOffset({ x: offsetX, y: 0 });
    setSwipeDirection(offsetX > 0 ? "right" : "left");
  };

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging && !isAnimating) {
        const cardElement = document.getElementById("swipe-card");
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const offsetX = e.clientX - centerX;
          setDragOffset({ x: offsetX, y: 0 });
          setSwipeDirection(offsetX > 0 ? "right" : "left");
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, isAnimating, dragOffset]);
  // Touch event listeners with non-passive option
  useEffect(() => {
    const cardElement = document.getElementById("swipe-card");
    if (!cardElement) return;

    const handleTouchStartNonPassive = (e) => {
      if (isAnimating) return;
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const offsetX = touch.clientX - centerX;
      setDragOffset({ x: offsetX, y: 0 });
    };

    const handleTouchMoveNonPassive = (e) => {
      if (!isDragging || isAnimating) return;
      e.preventDefault(); // This will now work
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const offsetX = touch.clientX - centerX;
      setDragOffset({ x: offsetX, y: 0 });
      setSwipeDirection(offsetX > 0 ? "right" : "left");
    };

    cardElement.addEventListener("touchstart", handleTouchStartNonPassive, {
      passive: false,
    });
    cardElement.addEventListener("touchmove", handleTouchMoveNonPassive, {
      passive: false,
    });

    return () => {
      cardElement.removeEventListener("touchstart", handleTouchStartNonPassive);
      cardElement.removeEventListener("touchmove", handleTouchMoveNonPassive);
    };
  }, [isDragging, isAnimating, dragOffset]);
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading saved candidates...</p>
        </div>
      </div>
    );
  }

  // No candidates state
  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-green-400 rotate-45"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/admin/job-posting")}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all duration-300 group"
            >
              <ChevronLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-semibold">Back to Dashboard</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-green-400">
              Saved Candidates Review
            </h1>
          </div>

          {/* Empty state */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto flex items-center justify-center">
                  <Clock className="w-16 h-16 text-green-400" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                No Saved Candidates
              </h2>

              <p className="text-gray-300 text-lg mb-8">
                You haven't saved any candidates for later review yet.
                <br />
                <span className="text-sm text-gray-400 mt-2 block">
                  Save candidates during the review process to come back to them
                  later.
                </span>
              </p>

              <button
                onClick={() => navigate("/admin")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold text-green-400">
              Saved Candidates Review
            </h1>
            <p className="text-gray-300 text-sm">
              {currentIndex + 1} of {savedCandidates.length} candidates
            </p>
          </div>

          <button
            onClick={handleUndo}
            disabled={swipeHistory.length === 0 || isAnimating}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Undo</span>
          </button>
        </div>

        {/* Job info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-2">
            {currentCandidate.job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{currentCandidate.job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>{currentCandidate.job.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{currentCandidate.job.openings} openings</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / savedCandidates.length) * 100
                  }%`,
              }}
            />
          </div>
        </div>

        {/* Swipe instructions */}
        <div className="mb-6 text-center">
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 rounded-full p-1">
                <X size={12} />
              </div>
              <span>Swipe Left to Reject</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 rounded-full p-1">
                <Check size={12} />
              </div>
              <span>Swipe Right to Accept</span>
            </div>
          </div>
        </div>

        {/* Card container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Swipe overlay */}
            {isDragging && swipeDirection && (
              <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div
                  className={`rounded-full p-4 ${swipeDirection === "right" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {swipeDirection === "right" ? (
                    <Check size={32} className="text-white" />
                  ) : (
                    <X size={32} className="text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Draggable card */}
            <div
              id="swipe-card"
              className={`transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${isDragging ? "scale-105 z-20" : ""
                } ${isAnimating ? "transition-transform duration-300" : ""}`}
              style={{
                transform: `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.03
                  }deg)`,
              }}
              onMouseDown={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              <CandidateCard
                candidateData={{
                  user: {
                    ...currentCandidate.user,
                    
                    jobInfo: currentCandidate.job,
                  },
                  resumeText: currentCandidate.resume?.resumeText,
                  resumeFile: currentCandidate.resume?.resumeFile,
                }}
                jobData={currentCandidate.job}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => performSwipe("left")}
            disabled={isAnimating}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110 shadow-lg"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => performSwipe("right")}
            disabled={isAnimating}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110 shadow-lg"
          >
            <Check size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedCandidates;
