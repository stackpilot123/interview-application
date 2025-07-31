import {
  X,
  Users,
  Hash,
  MessageCircle,
  UserMinus,
  AlertTriangle,
  Video,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeChat,
  setChannels,
  setSelectedChatData,
  setSelectedChatType,
} from "../../../../features/chatSlice";
import { useState } from "react";
import { apiClient } from "../../../../lib/apiClient";
import {
  GET_ALL_CHANNELS,
  REMOVE_CANDIDATE,
} from "../../../../utils/constants";
import { setNotify } from "../../../../features/notifySlice";
import VideoCallButton from "../../../videoCall/VideoButton";

const ChatHeader = ({ profilePic, fullName }) => {
  const { selectedChatData, selectedChatType, onlineUsers, lastSeenData } =
    useSelector((state) => state.chat.chatInfo);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [showAllMembers, setShowAllMembers] = useState(false);

  const handleClose = () => {
    dispatch(closeChat());
  };

  const toggleMembersView = () => {
    setShowAllMembers(!showAllMembers);
  };

  const [confirmRemove, setConfirmRemove] = useState(null);

  const handleRemoveClick = (member) => {
    setConfirmRemove(member);
  };

  const handleConfirmRemove = async (member) => {
    try {
      const channelName = selectedChatData.name;
      const memberLength = selectedChatData.members.length;
      const response = await apiClient.post(
        REMOVE_CANDIDATE,
        {
          channelId: selectedChatData._id,
          memberId: member._id,
          memberLength,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
        setConfirmRemove(null);
        if (memberLength > 1) {
          dispatch(setSelectedChatData(response.data.channel));
        } else {
          dispatch(closeChat());
        }
        dispatch(
          setNotify({
            message: `${
              memberLength > 1
                ? `${member.fullName} warrior removed from ${channelName} channel`
                : `${channelName} channel terminated`
            }`,
            type: "success",
          })
        );
      }
    } catch (err) {
      console.error("error in removing the candidate: ", err.message);
    }
  };

  const handleCancelRemove = () => {
    setConfirmRemove(null);
  };

  const handleDirectMessage = (member) => {
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData({ user: member }));
    setShowAllMembers(false);
  };

  const membersInfo = () => {
    return (
      <div
        className="members-overlay fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={toggleMembersView}
      >
        <div
          className="bg-slate-900 rounded-lg border border-green-500/30 p-6 max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Channel Warriors
            </h3>
            <button
              onClick={toggleMembersView}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* Admin Section */}
          {selectedChatData.admin && (
            <div className="mb-4 pb-4 border-b border-green-500/20">
              <p className="text-xs text-green-400 uppercase tracking-wider mb-2">
                Channel Overlord
              </p>
              <div className="member-item flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-purple-500/20">
                <img
                  src={selectedChatData.admin.profilePicture}
                  alt={selectedChatData.admin.fullName}
                  className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-lg shadow-purple-500/20 bg-green-500"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {selectedChatData.admin.fullName}
                  </p>
                  <p className="text-xs text-purple-400">Supreme Ruler</p>
                </div>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2">
              Members ({selectedChatData.members.length})
            </p>
            {selectedChatData.members.map((member, index) => (
              <div
                key={member._id}
                className="member-item flex items-center gap-3 p-3 rounded-lg bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/50 hover:border-green-500/30 transition-all duration-200"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative">
                  <img
                    src={member.profilePicture}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-full border-2 border-green-500/30 shadow-md"
                  />
                  {onlineUsers.includes(member._id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-lg shadow-green-500/50"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{member.fullName}</p>
                  <p className="text-xs">
                    {onlineUsers.includes(member._id) ? (
                      <span className="text-green-400 flex items-center gap-1">
                        Online
                      </span>
                    ) : (
                      <span className="text-gray-500">Offline</span>
                    )}
                  </p>
                </div>

                {userInfo.id === selectedChatData.admin._id &&
                  member._id !== userInfo.id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDirectMessage(member)}
                        className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                        title="Direct Message"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => handleRemoveClick(member)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                        title="Remove from channel"
                      >
                        <UserMinus className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Confirmation Modal */}
          {confirmRemove && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 rounded-lg">
              <div className="bg-slate-800 border border-red-500/30 rounded-lg p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {selectedChatData.members.length > 1
                      ? "Remove Warrior?"
                      : "Delete Channel?"}
                  </h4>
                </div>
                <p className="text-gray-300 mb-6">
                  {selectedChatData.members.length > 1 ? (
                    <>
                      Are you sure you want to remove{" "}
                      <span className="font-semibold text-white">
                        {confirmRemove.fullName}
                      </span>{" "}
                      from this channel? This action cannot be undone.
                    </>
                  ) : (
                    <>
                      Removing{" "}
                      <span className="font-semibold text-white">
                        {confirmRemove.fullName}
                      </span>{" "}
                      will delete this channel as they are the last member. This
                      action cannot be undone.
                    </>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelRemove}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 border border-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmRemove(confirmRemove)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <style>{`
          /* Slide Down Animation for Header */
          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .header-container {
            animation: slideDown 0.5s ease-out;
          }

          /* Pulse Animation for Online Indicator */
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }

          .online-indicator {
            animation: pulse 2s infinite;
          }

          /* Channel Icon Glow Animation */
          @keyframes channelGlow {
            0% {
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
            }
            100% {
              box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
            }
          }

          .channel-icon {
            animation: channelGlow 3s ease-in-out infinite;
          }

          /* Slide Up Animation for Member Items */
          @keyframes slideUp {
            from {
              transform: translateY(10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .member-item {
            animation: slideUp 0.3s ease-out forwards;
          }

          /* Fade In for Overlay */
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .members-overlay {
            animation: fadeIn 0.2s ease-out;
          }

          /* Avatar Hover Effect */
          .member-avatar {
            transition: all 0.3s ease;
          }

          .member-avatar:hover {
            transform: scale(1.1);
            z-index: 10;
          }
`}</style>

      <div className="header-container bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 p-4 border-b border-green-500/20 backdrop-blur-md">
        {selectedChatType === "contact" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="relative transform transition-transform duration-300 hover:scale-105">
                <img
                  src={selectedChatData.user.profilePicture}
                  alt={fullName}
                  className="w-12 h-12 rounded-full border-2 border-green-500/50 shadow-lg shadow-green-500/20 transition-all duration-300 hover:border-green-400 bg-green-500"
                />
                {onlineUsers.includes(selectedChatData.user._id) ? (
                  <div className="online-indicator absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-600 rounded-full border-2 border-slate-900"></div>
                )}
              </div>

              {/* Name and Status */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <h3 className="text-white font-semibold text-lg">
                  {selectedChatData.user.fullName}
                </h3>
                {onlineUsers.includes(selectedChatData.user._id) ? (
                  <p className="text-green-400 text-sm flex items-center gap-1">
                    Active in BattleWorld
                  </p>
                ) : (
                  <div className="text-xs text-gray-500 font-medium tracking-wide">
                    LAST SEEN{" "}
                    {lastSeenData[selectedChatData.user._id]
                      ? new Date(lastSeenData[selectedChatData.user._id])
                          .toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .toUpperCase()
                      : "IN THE MULTIVERSE"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {/* Video Call Button */}
              <VideoCallButton/>
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 group transform hover:scale-110 cursor-pointer"
              >
                <X className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              </button>
            </div>
          </div>
        )}

        {selectedChatType === "channel" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Channel Icon */}
              <div className="channel-icon relative transform transition-transform duration-300 hover:scale-105 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-700 flex items-center justify-center border-2 border-green-400/50 shadow-lg rounded-full">
                  <Hash className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  {selectedChatData.name}
                </h3>

                {/* Members Preview */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-2">
                    {selectedChatData.members
                      .slice(0, 2)
                      .map((member, index) => (
                        <div
                          key={member._id}
                          className="member-avatar relative"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <img
                            src={member.profilePicture}
                            alt={member.fullName}
                            className="w-6 h-6 rounded-full border-2 border-slate-900 bg-gray-600"
                            title={member.fullName}
                          />
                          {onlineUsers.includes(member._id) && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-900"></div>
                          )}
                        </div>
                      ))}
                    {selectedChatData.members.length > 2 && (
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center">
                        <span className="text-xs text-gray-300">
                          +{selectedChatData.members.length - 2}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={toggleMembersView}
                    className="text-green-400 text-sm hover:text-green-300 transition-colors duration-200 flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{selectedChatData.members.length} warriors</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 group transform hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
            </button>
          </div>
        )}
      </div>

      {/* Members Modal */}
      {showAllMembers && selectedChatType === "channel" && membersInfo()}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.7);
        }
      `}</style>
    </>
  );
};

export default ChatHeader;
