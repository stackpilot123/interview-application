import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Heart,
  X,
  Check,
  Bookmark,
  MapPin,
  Award,
  Users,
  RotateCcw,
  UserRoundCheck,
  AlertCircle,
  FileText,
  Eye,
  PlusCircle
} from "lucide-react";
import CandidateCard from "./CandidateCard";
import { apiClient } from "../../lib/apiClient";
import {
  DOWN_SWIPE_ROUTE,
  GET_JOBS_APPLICATIONS,
  LEFT_SWIPE_ROUTE,
  RIGHT_SWIPE_ROUTE,
  UNDO_SWIPE_ROUTE,
  UP_SWIPE_ROUTE,
} from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const SwipeCandidates = ({ onBack }) => {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [swipeHistory, setSwipeHistory] = useState([]);

  const getData = async () => {
    try {
      console.log("called");
      const response = await apiClient.get(GET_JOBS_APPLICATIONS, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setJobData(response.data.jobData);
        console.log(response.data.jobData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Demo job data for fallback
  const demoJob = {
    title: "BattleWorld Tactician",
    description:
      "Reinforce elite Doom squads in high-priority zones. Analyze enemy patterns and issue real-time countermeasures.",
    requiredPowers: [
      "Tactical Genius",
      "Energy Manipulation",
      "Multiverse Awareness",
    ],
    experienceLevel: "Intermediate",
    location: "Sector 44 – Ember Fields",
    deadline: "2025-08-18T00:00:00.000Z",
    openings: 2,
    visibility: true,
    createdAt: new Date().toISOString(),
    candidatesApplied: [
      {
        username: "blackwidow",
        fullName: "Natasha Romanova",
        backstory:
          "Raised in the Red Room as a child assassin, transformed into an elite operative seeking redemption through heroic acts.",
        combatStyle:
          "Close-quarters combat with acrobatics and precision strikes",
        keyBattles: [
          "Infiltration of the Red Room Archives",
          "Battle of New York",
          "Mission: Doomstadt Silent Strike",
        ],
        powers: [
          "Peak human conditioning",
          "Expert martial artist",
          "Multilingual intelligence operative",
          "Master of disguise and espionage",
        ],
        preferredRole: "Covert Operations Specialist",
        teams: ["Avengers", "S.H.I.E.L.D.", "Winter Guard"],
        weaknesses: [
          "No superhuman abilities",
          "Past trauma from Red Room conditioning",
          "Limited defense against heavy supernatural forces",
        ],
        profilePicture:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        resumeFile: "natasha_romanova_resume.pdf",
        resumeText:
          "Experienced operative with 15+ years in covert operations. Skilled in infiltration, intelligence gathering, and tactical combat. Successfully completed over 200 missions with 98% success rate. Specialized in high-risk extractions and counter-intelligence operations.",
      },
      {
        username: "spiderman",
        fullName: "Peter Parker",
        backstory:
          "Bitten by a radioactive spider, uses great power with great responsibility to protect the innocent.",
        combatStyle:
          "Agile web-slinging combat with scientific problem-solving",
        keyBattles: [
          "Green Goblin Confrontation",
          "Sinister Six Showdown",
          "Multiverse Crisis Management",
        ],
        powers: [
          "Spider-sense precognition",
          "Superhuman strength and agility",
          "Wall-crawling abilities",
          "Genius-level intellect",
        ],
        preferredRole: "Rapid Response Specialist",
        teams: ["Avengers", "Fantastic Four", "Future Foundation"],
        weaknesses: [
          "Vulnerability to sonic attacks",
          "Chemical pesticides",
          "Emotional burden of responsibility",
        ],
        profilePicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        resumeFile: null,
        resumeText:
          "Friendly neighborhood hero with multiverse experience. Proven track record in crisis management and rapid response scenarios. Combines scientific knowledge with superhuman abilities for innovative problem-solving approaches.",
      },
      {
        username: "doctorstrange",
        fullName: "Stephen Strange",
        backstory:
          "Former surgeon turned Master of the Mystic Arts, protector of reality itself.",
        combatStyle:
          "Mystical combat with reality-bending spells and artifacts",
        keyBattles: [
          "Dormammu Bargain",
          "Infinity War Timeline Management",
          "Multiverse of Madness",
        ],
        powers: [
          "Master of Mystic Arts",
          "Time manipulation",
          "Astral projection",
          "Dimensional portal creation",
        ],
        preferredRole: "Mystic Operations Commander",
        teams: ["Avengers", "Defenders", "Illuminati"],
        weaknesses: [
          "Damaged hands affect fine motor skills",
          "Vulnerable without magical artifacts",
          "Oath-bound limitations",
        ],
        profilePicture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        resumeFile: "stephen_strange_credentials.pdf",
        resumeText:
          "Sorcerer Supreme with extensive multiverse experience. Former neurosurgeon with unparalleled precision and analytical skills. Mastery over time, space, and reality manipulation. Guardian of the Time Stone and protector of Earth's dimension.",
      },
    ],
  };

  // Flatten all candidates from all jobs with job info attached
  const getAllCandidates = () => {
    const dataToUse = jobData && jobData.length > 0 ? jobData : [demoJob];

    const allCandidates = [];

    dataToUse.forEach((job) => {
      if (job.candidatesApplied && job.candidatesApplied.length > 0) {
        job.candidatesApplied.forEach((candidate) => {
          // Attach job info to each candidate
          allCandidates.push({
            ...candidate,
            jobInfo: {
              title: job.title,
              description: job.description,
              requiredPowers: job.requiredPowers,
              experienceLevel: job.experienceLevel,
              location: job.location,
              deadline: job.deadline,
              openings: job.openings,
              visibility: job.visibility,
              createdAt: job.createdAt,
              _id: job._id,
            },
          });
        });
      }
    });

    return allCandidates;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Get all candidates from all jobs
  const candidates = getAllCandidates();
  const currentCandidate = candidates[currentIndex];

  // Swipe threshold
  const SWIPE_THRESHOLD = 80;

  // Handle swipe functions
  const handleSwipeRight = async (candidateData) => {
    console.log(
      candidateData.user._id,
      candidateData.jobInfo._id,
      candidateData.resumeFile,
      candidateData.resumeText
    );
    try {
      const response = await apiClient.post(
        RIGHT_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.jobInfo._id,
          resumeFile: candidateData.resumeFile,
          resumeText: candidateData.resumeText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.error("error in swipe right api: ", err.message);
    }
  };

  const handleSwipeLeft = async (candidateData) => {
    console.log(
      candidateData.user._id,
      candidateData.jobInfo._id,
      candidateData.resumeFile,
      candidateData.resumeText
    );
    try {
      const response = await apiClient.post(
        LEFT_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.jobInfo._id,
          resumeFile: candidateData.resumeFile,
          resumeText: candidateData.resumeText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.error("error in swipe left api: ", err.message);
    }
  };

  const handleSwipeUp = async (candidateData) => {
    console.log(
      candidateData.user._id,
      candidateData.jobInfo._id,
      candidateData.resumeFile,
      candidateData.resumeText
    );
    try {
      const response = await apiClient.post(
        UP_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.jobInfo._id,
          resumeFile: candidateData.resumeFile,
          resumeText: candidateData.resumeText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.error("error in swipe up api: ", err.message);
    }
  };

  const handleSwipeDown = async (candidateData) => {
    console.log(
      candidateData.user._id,
      candidateData.jobInfo._id,
      candidateData.resumeFile,
      candidateData.resumeText
    );
    try {
      const response = await apiClient.post(
        DOWN_SWIPE_ROUTE,
        {
          userId: candidateData.user._id,
          jobId: candidateData.jobInfo._id,
          resumeFile: candidateData.resumeFile,
          resumeText: candidateData.resumeText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.error("error in swipe down api: ", err.message);
    }
  };

  const nextCandidate = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const performSwipe = (direction) => {
    if (!currentCandidate || isAnimating) return;

    setIsAnimating(true);

    // Store current state in history before swiping
    const historyEntry = {
      candidateIndex: currentIndex,
      candidate: currentCandidate,
      direction: direction,
      timestamp: Date.now(),
    };

    switch (direction) {
      case "right":
        handleSwipeRight(currentCandidate);
        break;
      case "left":
        handleSwipeLeft(currentCandidate);
        break;
      case "up":
        handleSwipeUp(currentCandidate);
        break;
      case "down":
        handleSwipeDown(currentCandidate);
        break;
    }

    // Animate the swipe
    const swipeDistance = 1000;
    const swipeOffsets = {
      right: { x: swipeDistance, y: 0 },
      left: { x: -swipeDistance, y: 0 },
      up: { x: 0, y: -swipeDistance },
      down: { x: 0, y: swipeDistance },
    };

    setDragOffset(swipeOffsets[direction]);

    setTimeout(() => {
      nextCandidate();
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection("");
      setIsAnimating(false);

      // Add to history after animation completes
      setSwipeHistory((prev) => [...prev, historyEntry]);
    }, 300);
  };

  const handleUndo = async () => {
    if (swipeHistory.length === 0 || isAnimating) return;

    const lastSwipe = swipeHistory[swipeHistory.length - 1];

    // Remove the last swipe from history
    setSwipeHistory((prev) => prev.slice(0, -1));

    // Go back to the previous candidate
    setCurrentIndex(lastSwipe.candidateIndex);

    console.log(
      "⏪ Undo swipe:",
      lastSwipe.direction,
      "for candidate:",
      lastSwipe.candidate.user._id,
      lastSwipe.candidate.jobInfo._id
    );

    try {
      const response = await apiClient.post(
        UNDO_SWIPE_ROUTE,
        {
          userId: lastSwipe.candidate.user._id,
          jobId: lastSwipe.candidate.jobInfo._id,
          direction: lastSwipe.direction,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mouse events
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isAnimating) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    setDragOffset({ x: offsetX, y: offsetY });

    // Determine swipe direction
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      setSwipeDirection(offsetX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(offsetY < 0 ? "up" : "down");
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);

    const { x, y } = dragOffset;

    if (Math.abs(x) > SWIPE_THRESHOLD || Math.abs(y) > SWIPE_THRESHOLD) {
      if (Math.abs(x) > Math.abs(y)) {
        performSwipe(x > 0 ? "right" : "left");
      } else {
        performSwipe(y < 0 ? "up" : "down");
      }
    } else {
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection("");
    }
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setIsDragging(true);

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = touch.clientX - centerX;
    const offsetY = touch.clientY - centerY;

    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = touch.clientX - centerX;
    const offsetY = touch.clientY - centerY;

    setDragOffset({ x: offsetX, y: offsetY });

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      setSwipeDirection(offsetX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(offsetY < 0 ? "up" : "down");
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Add global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging && !isAnimating) {
        const cardElement = document.getElementById("swipe-card");
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const offsetX = e.clientX - centerX;
          const offsetY = e.clientY - centerY;

          setDragOffset({ x: offsetX, y: offsetY });

          if (Math.abs(offsetX) > Math.abs(offsetY)) {
            setSwipeDirection(offsetX > 0 ? "right" : "left");
          } else {
            setSwipeDirection(offsetY < 0 ? "up" : "down");
          }
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
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

  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white relative overflow-hidden rounded-xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-green-400 rotate-45"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-green-400 rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/admin/job-posting")}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all duration-300 hover:scale-105 group"
            >
              <ChevronLeft
                size={24}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-semibold">Back to Job Posting</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="md:text-2xl font-bold text-green-400 text-sm">
                Recruitment Complete
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl mx-auto">
              {/* Main icon with glow effect */}
              <div className="relative mb-8">
                <div className="relative  rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-2xl">
                  <UserRoundCheck className="w-3/4 h-3/4 text-green-400" />
                </div>
              </div>

              {/* Main heading with gradient text */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-green-300 to-green-400 bg-clip-text text-transparent">
                All Candidates Reviewed!
              </h2>

              {/* Subtitle with emphasis */}
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                <span className="text-green-400 font-semibold">
                  Doom has spoken!
                </span>{" "}
                You've meticulously reviewed all{" "}
                <span className="text-green-400 font-bold">
                  {candidates.length}
                </span>{" "}
                applicants across all positions.
                <br />
                <span className="text-sm text-gray-400 mt-2 block">
                  The worthy shall serve. The unworthy have been dismissed.
                </span>
              </p>

              {/* Call to action button */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-green-500/25 border border-green-500/50"
                >
                  Return to Dashboard
                </button>

                <div className="text-sm text-gray-400">
                  <p className="italic">
                    "The selection is complete. Now, BattleWorld awaits its
                    champions."
                  </p>
                  <p className="text-green-400 font-semibold mt-1">
                    - Victor Von Doom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!jobData || jobData.length === 0) {
    // here in last of the time attache a good component
    // means no candidate has applied for any job
    return (
      <div className="min-h-[88vh] bg-gray-950/30 flex items-center justify-center p-4 rounded-xl">
        <div className="max-w-md w-full text-center">
          {/* Icon Section */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700 mx-auto shadow-2xl">
              <Users size={48} className="text-gray-500" />
            </div>
            <div className="absolute -top-2 -right-4 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/30">
              <AlertCircle size={20} className="text-red-400" />
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            No Worthy Candidates Yet
          </h2>

          <p className="text-gray-400 mb-2 text-lg leading-relaxed">
            The BattleWorld remains silent. No candidates have dared to apply
            for your posted positions.
          </p>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Perhaps lower beings need more time to comprehend the honor of
            serving Doom.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25" onClick={()=>navigate("/admin/job-posting")}>
              <PlusCircle size={18} />
              <span>Post New Job</span>
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-500" onClick={()=>navigate("/admin/view-all-jobs")}>
              <FileText size={18} />
              <span>View All Jobs</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">
              Waiting for candidates to discover your job postings...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
              <span>Monitoring applications</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {jobData && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black text-white">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <ChevronLeft size={24} />
                Back to Jobs
              </button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-green-400">
                  All Candidates
                </h1>
                <p className="text-gray-300 text-sm">
                  {currentIndex + 1} of {candidates.length} candidates
                </p>
              </div>
              <button
                onClick={handleUndo}
                disabled={swipeHistory.length === 0 || isAnimating}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={20} />
                Undo
              </button>
            </div>

            {/* Current Job Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-green-400">
                  Applying for: {currentCandidate.jobInfo.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{currentCandidate.jobInfo.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span>{currentCandidate.jobInfo.experienceLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{currentCandidate.jobInfo.openings} openings</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / candidates.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Swipe Instructions */}
            <div className="mb-6 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-red-500 rounded-full p-1">
                    <X size={12} />
                  </div>
                  <span>Swipe Left to Reject</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-green-500 rounded-full p-1">
                    <Check size={12} />
                  </div>
                  <span>Swipe Right to Accept</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-red-400 rounded-full p-1">
                    <Heart size={12} />
                  </div>
                  <span>Swipe Up to Like</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Bookmark size={12} />
                  </div>
                  <span>Swipe Down to Save</span>
                </div>
              </div>
            </div>

            {/* Card Container */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Swipe overlay indicators */}
                {isDragging && swipeDirection && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <div
                      className={`rounded-full p-4 ${
                        swipeDirection === "right"
                          ? "bg-green-500"
                          : swipeDirection === "left"
                          ? "bg-red-500"
                          : swipeDirection === "up"
                          ? "bg-red-400"
                          : "bg-blue-500"
                      }`}
                    >
                      {swipeDirection === "right" && (
                        <Check size={40} className="text-white" />
                      )}
                      {swipeDirection === "left" && (
                        <X size={40} className="text-white" />
                      )}
                      {swipeDirection === "up" && (
                        <Heart size={40} className="text-white" />
                      )}
                      {swipeDirection === "down" && (
                        <Bookmark size={40} className="text-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Draggable Card */}
                <div
                  id="swipe-card"
                  className={`transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    isDragging ? "scale-105 z-20" : ""
                  } ${isAnimating ? "transition-transform duration-300" : ""}`}
                  style={{
                    transform: `translate(${dragOffset.x}px, ${
                      dragOffset.y
                    }px) rotate(${dragOffset.x * 0.05}deg)`,
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <CandidateCard
                    candidateData={currentCandidate}
                    jobData={currentCandidate.jobInfo}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => performSwipe("left")}
                disabled={isAnimating}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110"
              >
                <X size={24} />
              </button>
              <button
                onClick={() => performSwipe("down")}
                disabled={isAnimating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110"
              >
                <Bookmark size={24} />
              </button>
              <button
                onClick={() => performSwipe("up")}
                disabled={isAnimating}
                className="bg-red-400 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110"
              >
                <Heart size={24} />
              </button>
              <button
                onClick={() => performSwipe("right")}
                disabled={isAnimating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-4 transition-all duration-200 transform hover:scale-110"
              >
                <Check size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwipeCandidates;
