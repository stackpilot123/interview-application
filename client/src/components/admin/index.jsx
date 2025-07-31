import { useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import AdminPanel from "./AdminPanel"; // <-- Import the AdminPanel
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import Background from "../candidate/Background";
import SwipeCandidates from "./SwipeCandidates";
import CandidateCard from "./CandidateCard";
import { Outlet } from "react-router-dom";

const Admin = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "candidate") {
        navigate("/candidate");
      }
    }
  }, []);

  const sampleCandidate = {
    username: "blackwidow",
    fullName: "Natasha Romanova",
    backstory:
      "Raised in the Red Room as a child assassin, transformed into an elite operative seeking redemption through heroic acts.",
    combatStyle: "Close-quarters combat with acrobatics and precision strikes",
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
  };

  const sampleJob = {
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
  };

  const jobData = [
    {
      title: "Mutant Frontline Enforcer",
      description:
        "Deploy into hostile mutant zones. Execute tactical combat operations and manage team-based mutant responses.",
      requiredPowers: ["Regeneration", "Enhanced Senses", "Claw-Based Combat"],
      experienceLevel: "Advanced",
      location: "Sector 17 – Savage Crescent",
      deadline: "2025-08-25T00:00:00.000Z",
      openings: 1,
      visibility: true,
      createdAt: new Date().toISOString(),
      candidatesApplied: [
        {
          user: {
            username: "wolverine",
            fullName: "Logan Howlett",
            backstory:
              "An immortal mutant with a tortured past, claws of adamantium, and a berserker rage that makes him nearly unstoppable.",
            combatStyle:
              "Brutal melee attacks with surgical precision and relentless endurance.",
            keyBattles: [
              "Weapon X Escape",
              "Battle of Utopia",
              "Warzone Alpha",
            ],
            powers: [
              "Regeneration",
              "Adamantium claws",
              "Enhanced senses",
              "Superhuman durability",
            ],
            preferredRole: "Frontline Slayer",
            teams: ["X-Men", "X-Force", "Avengers"],
            weaknesses: [
              "Berserker rage clouding judgment",
              "Vulnerable to telepathy",
              "Post-traumatic memories",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: null,
          resumeText:
            "Decades of combat experience. Elite tracker and infiltrator. Highly resilient in battle and operates well solo or in tactical units.",
          status: "pending"  
        },
        {
          user: {
            username: "deadpool",
            fullName: "Wade Wilson",
            backstory:
              "The Merc with a Mouth. Enhanced by experimentation, unpredictable but lethal. Breaks the fourth wall regularly.",
            combatStyle:
              "Dual-wielding katanas and firearms with unpredictable, chaotic tactics.",
            keyBattles: [
              "Assault on Taskmaster Base",
              "Cable's Time War",
              "Rebellion at Arcade's Murderworld",
            ],
            powers: [
              "Regeneration",
              "Superhuman agility",
              "Marksmanship",
              "Swordsmanship",
            ],
            preferredRole: "Wildcard Mercenary",
            teams: ["X-Force", "Deadpool Corps", "Occasionally the X-Men"],
            weaknesses: [
              "Mentally unstable",
              "Loudmouth liability",
              "Easily distracted",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "deadpool_portfolio.pdf",
          resumeText:
            "You want explosions? I got 'em. Want unpredictability? Bingo. I've killed, danced, healed, and occasionally saved people. You're welcome.",
          status: "accepted"
        },
      ],
    },
    {
      title: "Arcane Rift Specialist",
      description:
        "Stabilize magical rifts tearing through space-time. Coordinate with sorcerers and mystics to protect BattleWorld’s arcane zones.",
      requiredPowers: [
        "Chaos Magic",
        "Dimensional Manipulation",
        "Elemental Control",
      ],
      experienceLevel: "Expert",
      location: "Arcane Zone – Wundagore Crater",
      deadline: "2025-09-01T00:00:00.000Z",
      openings: 3,
      visibility: true,
      createdAt: new Date().toISOString(),
      candidatesApplied: [
        {
          user: {
            username: "scarletwitch",
            fullName: "Wanda Maximoff",
            backstory:
              "Reality-warping mutant-sorceress. Torn between worlds, feared and revered. Controls the very threads of chaos magic.",
            combatStyle:
              "Reality bending, mind manipulation, and chaotic bursts of pure magic.",
            keyBattles: [
              "Westview Incident",
              "Multiverse Convergence",
              "Darkhold Reclamation",
            ],
            powers: [
              "Chaos Magic",
              "Mind control",
              "Energy projection",
              "Reality warping",
            ],
            preferredRole: "Arcane Enforcer",
            teams: ["Avengers", "Brotherhood of Mutants", "Hex Guard"],
            weaknesses: [
              "Emotion-driven powers",
              "Mental instability",
              "Vulnerable to cosmic nullifiers",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "wanda_hex_resume.pdf",
          resumeText:
            "Master of chaos magic and interdimensional sorcery. Experienced in containing rifts, battling corrupted entities, and altering reality itself.",
          status: "pending"  

        },
        {
          user: {
            username: "storm",
            fullName: "Ororo Munroe",
            backstory:
              "Descended from African priestesses, revered as a goddess. Mutant with the power to control weather systems worldwide.",
            combatStyle:
              "Long-range elemental combat with strategic aerial strikes.",
            keyBattles: [
              "Storm Siege of Wakanda",
              "Weatherfront Defense",
              "Doom vs X-Weather Ops",
            ],
            powers: [
              "Weather manipulation",
              "Flight",
              "Lightning generation",
              "Temperature control",
            ],
            preferredRole: "Elemental Vanguard",
            teams: ["X-Men", "Marauders", "Avengers"],
            weaknesses: [
              "Emotion affects climate control",
              "Vulnerable to magic-based attacks",
              "Physical stamina limits",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "ororo_cv.pdf",
          resumeText:
            "Weather goddess and field commander. Experienced in rift storm neutralization, large-scale battlefield disruption, and sky-based scouting.",
          status: "accepted"  

        },
      ],
    },
    {
      title: "Quantum Surveillance Analyst",
      description:
        "Monitor and analyze multiversal data streams. Detect temporal anomalies and recommend intervention strategies to Doom's High Council.",
      requiredPowers: [
        "Time Sensitivity",
        "Quantum Awareness",
        "Analytical Genius",
      ],
      experienceLevel: "Advanced",
      location: "Citadel of Chrono-Control",
      deadline: "2025-09-10T00:00:00.000Z",
      openings: 1,
      visibility: true,
      createdAt: new Date().toISOString(),
      candidatesApplied: [
        {
          user: {
            username: "kangsentry",
            fullName: "Chrono Sentience Unit KX-91",
            backstory:
              "Artificial intelligence born from Kang's discarded tech. Now loyal to Doom, it observes the timestream.",
            combatStyle:
              "Remote energy projections and predictive defense maneuvers.",
            keyBattles: [
              "Collapse of 10th Timeline",
              "Purge of Divergent Nexus",
            ],
            powers: [
              "Temporal Scanning",
              "Chrono-logic Prediction",
              "Quantum Storage",
            ],
            preferredRole: "Temporal Monitor",
            teams: ["Doom's Data Corps"],
            weaknesses: [
              "Overloads from paradox exposure",
              "Requires chrono-core maintenance",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1581093448798-5e8c6a6f9a7e?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "kx91_core_data_packet.pdf",
          resumeText:
            "Designed to parse 1 trillion events/sec. Trusted advisor in 14 successful interventions. AI built on Kang's tech, now reprogrammed to serve Doom.",
        },
        {
          user: {
            username: "vision",
            fullName: "Vision",
            backstory:
              "Synthozoid created from Vibranium and the Mind Stone. Seeks logic and peace through purpose.",
            combatStyle:
              "Phasing, laser beams, high-intellect tactical movement.",
            keyBattles: [
              "Ultron Uprising",
              "Civil War Skirmish",
              "Battle for Wakanda",
            ],
            powers: ["Phasing", "Mind Stone energy", "AI intellect"],
            preferredRole: "Data Strategist",
            teams: ["Avengers", "Young Avengers (mentor)"],
            weaknesses: [
              "Emotion processing flaws",
              "Magnetic disruption",
              "Code instability",
            ],
            profilePicture:
              "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "vision_resume.pdf",
          resumeText:
            "I possess full access to multiversal logic systems and am equipped to handle computational combat modeling. Ideal for prediction-based assignments.",
        },
      ],
    },
    {
      title: "Doom Elite Vanguard – Shadow Strike",
      description:
        "Join Doom’s most covert division. Execute shadow-level missions under full diplomatic immunity in foreign realms.",
      requiredPowers: ["Infiltration", "Stealth Magic", "High Resilience"],
      experienceLevel: "Elite",
      location: "Classified – Doom’s Personal Legion",
      deadline: "2025-09-20T00:00:00.000Z",
      openings: 2,
      visibility: false,
      createdAt: new Date().toISOString(),
      candidatesApplied: [
        {
          user: {
            username: "moonknight",
            fullName: "Marc Spector",
            backstory:
              "Avatar of the Egyptian god Khonshu. A man with many faces and even more ways to deal with threats.",
            combatStyle:
              "Brutal ambush tactics, enhanced by mystic resurrection and moonlight-powered strength.",
            keyBattles: [
              "Siege of the Midnight Temple",
              "Purge of the Shadow Priests",
            ],
            powers: [
              "Mystical resurrection",
              "Martial arts",
              "Split personality unpredictability",
            ],
            preferredRole: "Covert Executor",
            teams: ["Midnight Sons", "Avengers"],
            weaknesses: ["Mental instability", "Power flux under new moons"],
            profilePicture:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "moonknight_shadow_ops.pdf",
          resumeText:
            "Ex-Marine, ex-mercenary, current divine weapon. I follow orders... until the moon says otherwise.",
        },
        {
          user: {
            username: "taskmaster",
            fullName: "Tony Masters",
            backstory:
              "Photographic reflexes let him mimic any combatant. Trained by S.H.I.E.L.D., betrayed them for profit.",
            combatStyle:
              "Perfect mimicry of any fighting style. Uses shield, sword, and bow.",
            keyBattles: [
              "Strike on Wakandan Embassy",
              "Undercover in Atlantis",
              "Solo infiltration of Doomstadt",
            ],
            powers: [
              "Photographic reflexes",
              "Master tactician",
              "Weapons expert",
            ],
            preferredRole: "Combat Doppelganger",
            teams: ["Thunderbolts", "Freelance"],
            weaknesses: ["No original strategy", "Memory degradation"],
            profilePicture:
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face",
          },
          resumeFile: "taskmaster_cv.pdf",
          resumeText:
            "I am whoever you need me to be. I’ve learned from the best — and beat them with their own moves.",
        },
      ],
    },
  ];
  return (
    <>
      <Background>
        <div className="min-h-screen bg-black/60">
          <div className="px-0 sm:px-8 py-3 top-0 z-50 sticky">
            <NavBar />
          </div>
          <div className="flex px-0 sm:px-8">
            <div className="fixed z-100 hidden md:block">
              <SideBar />
            </div>
            <div className="flex-1 md:pl-16">
              <Outlet/>
            </div>
          </div>
        </div>
      </Background>
    </>
  );
};

export default Admin;
