import React, { useState } from "react";
import {
  Eye,
  Download,
  X,
  Users,
  Zap,
  Shield,
  Target,
  FileText,
  Briefcase,
} from "lucide-react";

const CandidateCard = ({ candidateData, jobData }) => {
  const [showFullCV, setShowFullCV] = useState(false);
  const [showJobInfo, setShowJobInfo] = useState(false);

  const candidate = candidateData;
  const job = jobData;

  const FullCVModal = () => (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showFullCV ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-slate-900/95 border border-green-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-green-500/20 transition-all duration-500 ${
          showFullCV ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="sticky top-0 bg-slate-900/95 border-b border-green-500/30 p-6 flex justify-between items-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-green-400 animate-pulse">
            Full Profile - {candidate.user.fullName}
          </h2>
          <button
            onClick={() => setShowFullCV(false)}
            className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)] scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-green-500/50 scrollbar-thumb-rounded-full hover:scrollbar-thumb-green-400">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="relative">
                <img
                  src={candidate.user.profilePicture}
                  alt={candidate.user.fullName}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-500/30 object-cover transition-all duration-300 "
                />
                <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-green-500/20 to-transparent opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {candidate.user.fullName}
              </h3>
              <p className="text-green-400 font-medium">
                @{candidate.user.username}
              </p>
            </div>

            <div className="space-y-4">
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h4 className="text-green-400 font-semibold mb-2">
                  Preferred Role
                </h4>
                <p className="text-gray-300">{candidate.user.preferredRole}</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h4 className="text-green-400 font-semibold mb-2">
                  Combat Style
                </h4>
                <p className="text-gray-300">{candidate.user.combatStyle}</p>
              </div>
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <FileText size={20} className="animate-pulse" />
              Backstory
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {candidate.user.backstory}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                <Zap size={20} className="animate-pulse" />
                Powers & Abilities
              </h4>
              <ul className="space-y-2">
                {candidate.user.powers.map((power, index) => (
                  <li
                    key={index}
                    className="text-gray-300 flex items-center gap-2 transform transition-all duration-300 hover:translate-x-2 hover:text-green-300"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {power}
                  </li>
                ))}
              </ul>
            </div>

            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <Shield size={20} className="animate-pulse" />
                Weaknesses
              </h4>
              <ul className="space-y-2">
                {candidate.user.weakness.map((weakness, index) => (
                  <li
                    key={index}
                    className="text-gray-300 flex items-center gap-2 transform transition-all duration-300 hover:translate-x-2 hover:text-red-300"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <Target size={20} className="animate-pulse" />
              Key Battles
            </h4>
            <ul className="space-y-2">
              {candidate.user.keyBattles.map((battle, index) => (
                <li
                  key={index}
                  className="text-gray-300 flex items-center gap-2 transform transition-all duration-300 hover:translate-x-2 hover:text-yellow-300"
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  {battle}
                </li>
              ))}
            </ul>
          </div>

          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <Users size={20} className="animate-pulse" />
              Team Affiliations
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.user.teams.map((team, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-800 text-green-400 rounded-full text-sm border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:bg-green-500/20 hover:border-green-400"
                >
                  {team}
                </span>
              ))}
            </div>
          </div>

          {candidate.resumeText && (
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <h4 className="text-green-400 font-semibold mb-3">
                Resume Summary
              </h4>
              <div className="bg-slate-800 p-4 rounded-lg border border-green-500/30 hover:border-green-400 transition-all duration-300">
                <p className="text-gray-300 leading-relaxed">
                  {candidate.resumeText}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const JobInfoModal = () => (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showJobInfo ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-slate-900/95 border border-green-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-500/20 transition-all duration-500 ${
          showJobInfo ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="sticky top-0 bg-slate-900/95 border-b border-green-500/30 p-6 flex justify-between items-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-green-400 animate-pulse">
            Job Details
          </h2>
          <button
            onClick={() => setShowJobInfo(false)}
            className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-green-500/50 scrollbar-thumb-rounded-full hover:scrollbar-thumb-green-400">
          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
            <p className="text-green-400 font-medium">{job.location}</p>
          </div>

          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <h4 className="text-green-400 font-semibold mb-3">Description</h4>
            <p className="text-gray-300 leading-relaxed">{job.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <h4 className="text-green-400 font-semibold mb-3">
                Required Powers
              </h4>
              <ul className="space-y-2">
                {job.requiredPowers.map((power, index) => (
                  <li
                    key={index}
                    className="text-gray-300 flex items-center gap-2 transform transition-all duration-300 hover:translate-x-2 hover:text-green-300"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {power}
                  </li>
                ))}
              </ul>
            </div>

            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <h4 className="text-green-400 font-semibold mb-3">Details</h4>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="text-green-400">Experience:</span>{" "}
                  {job.experienceLevel}
                </p>
                <p>
                  <span className="text-green-400">Openings:</span>{" "}
                  {job.openings}
                </p>
                <p>
                  <span className="text-green-400">Deadline:</span>{" "}
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-slate-900/95 border border-green-500/30 rounded-2xl p-6 max-w-md mx-auto backdrop-blur-sm transform transition-all duration-300  hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20">
        {/* Profile Picture */}
        <div className="text-center mb-6">
          <div className="relative">
            <img
              src={candidate.user.profilePicture}
              alt={candidate.user.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-500/30 object-cover transition-all duration-300 "
            />
            <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-green-500/20 to-transparent opacity-0 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 transition-all duration-300 ">
            {candidate.user.fullName}
          </h3>
          <p className="text-green-400 font-medium animate-pulse">
            @{candidate.user.username}
          </p>
        </div>

        {/* Key Info */}
        <div className="space-y-4 mb-6">
          <div className="transform transition-all duration-300 hover:translate-x-2">
            <h4 className="text-green-400 font-semibold mb-2">
              Preferred Role
            </h4>
            <p className="text-gray-300 text-sm">
              {candidate.user.preferredRole}
            </p>
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <h4 className="text-green-400 font-semibold mb-2">Top Powers</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.user.powers.slice(0, 3).map((power, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-800 text-green-400 rounded-full text-xs border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:bg-green-500/20 hover:border-green-400"
                >
                  {power}
                </span>
              ))}
              {candidate.user.powers.length > 3 && (
                <span className="px-2 py-1 bg-slate-800 text-gray-400 rounded-full text-xs border border-gray-500/30 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600/20">
                  +{candidate.user.powers.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-green-500/20 transform transition-all duration-300 hover:bg-slate-800/70 hover:border-green-400 hover:translate-y-[-2px]">
          <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
            <Briefcase size={16} className="animate-pulse" />
            Applying For
          </h4>
          <p className="text-white font-medium">{job.title}</p>
          <p className="text-gray-400 text-sm">{job.location}</p>
        </div>

        {/* Resume File - Only show if exists */}
        {candidate.resumeFile && (
          <div className="mb-6 p-3 bg-slate-800/30 rounded-lg border border-green-500/20 flex items-center justify-between transform transition-all duration-300 hover:bg-slate-800/50 hover:border-green-400 hover:translate-y-[-2px]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-sm flex items-center justify-center shadow-md">
                  <FileText size={14} className="text-slate-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <span className="text-sm text-gray-300 block">
                  Resume Attached
                </span>
                <span className="text-xs text-green-400">{"resume.pdf"}</span>
              </div>
            </div>
            <button className="text-green-400 hover:text-green-300 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-green-500/20">
              <Download size={16} />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowFullCV(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-300 border border-green-500/30 hover:border-green-400 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <Eye size={16} />
            View Full CV
          </button>

          <button
            onClick={() => setShowJobInfo(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg transition-all duration-300 border border-gray-500/30 hover:border-gray-400 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
          >
            <FileText size={16} />
            Job Details
          </button>
        </div>
      </div>

      {/* Modals */}
      {showFullCV && <FullCVModal />}
      {showJobInfo && <JobInfoModal />}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-track-slate-800::-webkit-scrollbar-track {
          background-color: #1e293b;
          border-radius: 9999px;
        }
        .scrollbar-thumb-green-500\/50::-webkit-scrollbar-thumb {
          background-color: rgba(34, 197, 94, 0.5);
          border-radius: 9999px;
        }
        .scrollbar-thumb-green-500\/50::-webkit-scrollbar-thumb:hover {
          background-color: rgba(34, 197, 94, 0.7);
        }
        .scrollbar-thumb-rounded-full::-webkit-scrollbar-thumb {
          border-radius: 9999px;
        }
      `}</style>
    </>
  );
};

// Demo with sample data
// const Demo = () => {
//   const sampleCandidate = {
//     username: "blackwidow",
//     fullName: "Natasha Romanova",
//     backstory: "Raised in the Red Room as a child assassin, transformed into an elite operative seeking redemption through heroic acts.",
//     combatStyle: "Close-quarters combat with acrobatics and precision strikes",
//     keyBattles: [
//       "Infiltration of the Red Room Archives",
//       "Battle of New York",
//       "Mission: Doomstadt Silent Strike"
//     ],
//     powers: [
//       "Peak human conditioning",
//       "Expert martial artist",
//       "Multilingual intelligence operative",
//       "Master of disguise and espionage"
//     ],
//     preferredRole: "Covert Operations Specialist",
//     teams: ["Avengers", "S.H.I.E.L.D.", "Winter Guard"],
//     weaknesses: [
//       "No superhuman abilities",
//       "Past trauma from Red Room conditioning",
//       "Limited defense against heavy supernatural forces"
//     ],
//     profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
//     resumeFile: "natasha_romanova_resume.pdf",
//     resumeText: "Experienced operative with 15+ years in covert operations. Skilled in infiltration, intelligence gathering, and tactical combat. Successfully completed over 200 missions with 98% success rate. Specialized in high-risk extractions and counter-intelligence operations."
//   };

//   const sampleJob = {
//     title: "BattleWorld Tactician",
//     description: "Reinforce elite Doom squads in high-priority zones. Analyze enemy patterns and issue real-time countermeasures.",
//     requiredPowers: ["Tactical Genius", "Energy Manipulation", "Multiverse Awareness"],
//     experienceLevel: "Intermediate",
//     location: "Sector 44 – Ember Fields",
//     deadline: "2025-08-18T00:00:00.000Z",
//     openings: 2
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center">
//       <CandidateCard candidateData={sampleCandidate} jobData={sampleJob} />
//     </div>
//   );
// };

export default CandidateCard;
