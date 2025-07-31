import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Users,
  Settings,
  Search,
  Star,
  X,
  Plus,
  Hash,
  Check,
} from "lucide-react";
import EmptySearchState from "./EmptySearchState";
import debounce from "lodash/debounce";
import { apiClient } from "../../../lib/apiClient";
import {
  GET_ALL_CONTACTS,
  SEARCH_CONTACTS,
  GET_ALL_CANDIDATES_FOR_CHANNEL,
  GET_ALL_CHANNELS,
} from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannels,
  setDirectMessagesContact,
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "../../../features/chatSlice";
import { useSocket } from "../../../contexts/SocketContext";
import CreateChannelModal from "./CreateChannelModal";
import ChannelContainer from "./ChannelContainer";

const Sidebar = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    directMessagesContact,
    onlineUsers,
    lastSeenData,
    channels,
  } = useSelector((state) => state.chat.chatInfo);
  const dispatch = useDispatch();

  const socket = useSocket();

  const [searchText, setSearchText] = useState("");
  const [searchedCandidates, setSearchedCandidates] = useState([]);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelSearchText, setChannelSearchText] = useState("");
  const [selectedChannelMembers, setSelectedChannelMembers] = useState([]);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  const [allCandidatesForChannel, setAllCandidatesForChannel] = useState([]);

  const handleChatSelect = (chat) => {};

  const handleSearchSelectCandidate = (data) => {
    console.log(data);
    setSearchText("");
    setIsSearching(false);
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedChatData(data));
  };

  const getAllChannels = async () => {
    try {
      const response = await apiClient.get(GET_ALL_CHANNELS, {
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(setChannels(response.data.channels));
        console.log(response.data.channels);
      }
    } catch (err) {
      console.error("error in getting all the channels : ", err.message);
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  const getAllContactsData = useCallback(async (req, res) => {
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log(response.data);
        dispatch(setDirectMessagesContact(response.data.contacts));
      }
    } catch (err) {
      console.error("error in getting all contacts: ", err.message);
    }
  }, []);

  useEffect(() => {
    getAllContactsData();
  }, [
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    onlineUsers,
    lastSeenData,
  ]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("triggerRender", () => {
        getAllContactsData();
      });
    }

    if (socket?.current) {
      socket.current.on("triggerRenderChannel", () => {
        getAllChannels();
      });
    }

    return () => {
      socket.current.off("triggerRender");
      socket.current.off("triggerRenderChannel");
    };
  }, [socket.current]);

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.trim()) {
        try {
          const response = await apiClient.post(
            SEARCH_CONTACTS,
            { searchTerm: value },
            { withCredentials: true }
          );

          if (response.status === 200) {
            setSearchedCandidates(response.data.candidates);
            console.log(response.data.candidates);
          }
        } catch (err) {
          console.error("error in searching the contacts: ", err.message);
        }
      } else {
        setSearchedCandidates([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchedCandidates([]);
    setIsSearching(false);
    setIsSearchFocused(false);
  };

  const animatedStyles = `


    @keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.check-icon {
  animation: rotateIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(30, 41, 59, 0.3);
      border-radius: 2px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(52, 211, 153, 0.3);
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(52, 211, 153, 0.5);
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(52, 211, 153, 0.3) rgba(30, 41, 59, 0.3);
    }
    
    @keyframes slideInFromLeft {
      0% {
        opacity: 0;
        transform: translateX(-20px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    @keyframes statusPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }
    
    @keyframes messageSlide {
      0% {
        opacity: 0;
        transform: translateX(-10px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes rotateIn {
      0% {
        opacity: 0;
        transform: rotate(-180deg) scale(0.5);
      }
      100% {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }
    }
    
    @keyframes elasticScale {
      0% {
        transform: scale(0);
      }
      60% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .animate-slideInLeft {
      animation: slideInFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-scaleIn {
      animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-shimmer {
      background: linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.03) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmer 6s infinite;
    }
    
    .animate-statusPulse {
      animation: statusPulse 2s infinite;
    }
    
    .animate-messageSlide {
      animation: messageSlide 0.4s ease-out forwards;
    }
    
    .animate-rotateIn {
      animation: rotateIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-elasticScale {
      animation: elasticScale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    .chat-item {
      opacity: 0;
      animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      position: relative;
      overflow: hidden;
    }
    
    .chat-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.02), transparent);
      transition: left 0.5s ease;
    }
    
    .chat-item:hover::before {
      left: 100%;
    }
    
    .hover-lift {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .icon-rotate {
      transition: transform 0.3s ease;
    }
    
    .icon-rotate:hover {
      transform: rotate(15deg);
    }
    
    .search-glow {
      transition: all 0.3s ease;
    }
    
    .search-glow:focus {
      box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
    }
    
    .unread-badge-pop {
      animation: elasticScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    .star-spin {
      animation: rotateIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .selected-highlight {
      background: linear-gradient(to right, rgba(52, 211, 153, 0.08), transparent);
      border-left: 2px solid #34d399;
    }

    @keyframes slideRight {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(200%);
    }
    100% {
      transform: translateX(-100%);
    }
}
  `;

  const formatTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to start of day for comparison
    const messageDateOnly = new Date(messageDate.toDateString());
    const todayDateOnly = new Date(today.toDateString());
    const yesterdayDateOnly = new Date(yesterday.toDateString());

    if (messageDateOnly.getTime() === todayDateOnly.getTime()) {
      // Today - show time in AM/PM
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (messageDateOnly.getTime() === yesterdayDateOnly.getTime()) {
      // Yesterday
      return "Yesterday";
    } else {
      // Older - show date as DD/MM/YYYY
      const day = messageDate.getDate().toString().padStart(2, "0");
      const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
      const year = messageDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };

  const hanleDmContactClick = (data) => {
    console.log(data);
    setSelectedChat(data);

    dispatch(setSelectedChatType("contact"));
    dispatch(
      setSelectedChatData({
        user: {
          _id: data._id,
          fullName: data.fullName,
          profilePicture: data.profilePicture,
        },
      })
    );
  };

  useEffect(() => {
    if (selectedChatData) {
      if (selectedChatType === "contact") {
        setSelectedChat(selectedChatData.user);
      }
    } else {
      setSelectedChat(null);
    }
  }, [selectedChatData, selectedChatType, setSelectedChat]);

  const getAllCandidatesData = async () => {
    if (userInfo.role === "candidate") return;
    try {
      const response = await apiClient.get(GET_ALL_CANDIDATES_FOR_CHANNEL, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setAllCandidatesForChannel(response.data.shortlistedCandidatesData);
      }
    } catch (err) {
      console.error(
        "error in getting all candidates for channel : ",
        err.message
      );
    }
  };
  useEffect(() => {
    getAllCandidatesData();
  }, []);

  useEffect(() => {
    getAllChannels();
  }, [
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    onlineUsers,
    lastSeenData,
  ]);

  const handleChannelClick = (channel) => {
    dispatch(setSelectedChatType("channel"));
    dispatch(setSelectedChatData(channel));
    dispatch(setSelectedChatMessages(channel.messages));
    setSelectedChat(channel);
  };
  return (
    <div
      className={`w-full max-w-full md:w-96 bg-gray-900 border-r border-gray-800 flex flex-col h-[88vh] relative overflow-hidden ${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 ${
        selectedChatData ? "hidden" : ""
      } md:block`}
    >
      <style dangerouslySetInnerHTML={{ __html: animatedStyles }} />

      {/* Header */}
      <div className="relative z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 animate-scaleIn">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-emerald-400 flex items-center gap-2 animate-slideInLeft">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              Chat
            </h1>
            <div
              className="flex gap-2 animate-slideInLeft"
              style={{ animationDelay: "0.1s" }}
            >
              <Users className="w-4 h-4 text-gray-400 hover:text-emerald-400 transition-all duration-300 cursor-pointer icon-rotate" />
              <Settings className="w-4 h-4 text-gray-400 hover:text-emerald-400 transition-all duration-300 cursor-pointer hover:rotate-180" />
            </div>
          </div>
          {
            //search bar for admin only
            userInfo.role === "admin" && (
              <div
                className={`relative transition-all duration-300 animate-fadeInUp ${
                  isSearchFocused ? "scale-[1.02]" : "scale-100"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-all duration-300 ${
                    isSearchFocused
                      ? "text-emerald-400 rotate-12"
                      : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search shortlisted warriors..."
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-gray-800/60 text-gray-100 placeholder-gray-500 rounded-lg pl-9 pr-10 py-2.5 text-sm
                       focus:outline-none focus:bg-gray-800/80 search-glow
                       transition-all duration-300 border border-gray-700 hover:border-gray-600"
                />
                {isSearching && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 
                         transition-all duration-300 z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearchFocused && (
                  <div className="absolute inset-0 -z-10 bg-emerald-500/5 blur-xl rounded-lg animate-scaleIn"></div>
                )}
              </div>
            )
          }
          {userInfo.role === "admin" && (
            <button
              onClick={() => setShowCreateChannel(true)}
              className="w-full mt-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 
               text-emerald-400 rounded-lg py-2.5 text-sm font-medium
               flex items-center justify-center gap-2 transition-all duration-300
               hover:scale-[1.02] active:scale-[0.98] animate-fadeInUp cursor-pointer"
              style={{ animationDelay: "0.3s" }}
            >
              <Plus className="w-4 h-4" />
              Create Channel
            </button>
          )}
        </div>
      </div>

      {/* Search Results or Chat List */}
      {
        <div className="flex-1 overflow-hidden flex flex-col">
          <div
            className={`flex flex-col ${
              directMessagesContact.length < 4 ? "" : "h-[44vh] "
            }`}
          >
            <div className="px-4 py-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Direct Messages
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
              <div className="p-2">
                {userInfo.role === "admin" && isSearching ? (
                  // Search Results
                  searchedCandidates.length > 0 ? (
                    searchedCandidates.map((data, index) => (
                      <div
                        key={data._id}
                        className="flex items-center p-3 mb-1.5 cursor-pointer transition-all duration-300 rounded-lg
                  bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/50
                  hover-lift animate-fadeInUp relative overflow-hidden"
                        style={{ animationDelay: `${index * 60}ms` }}
                        onClick={() => handleSearchSelectCandidate(data)}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={data.user.profilePicture}
                            alt={data.user.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-3 flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-200 truncate">
                            {data.user.fullName}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {data.user.username}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {data.user.email}
                          </p>
                        </div>

                        {/* Elite Badge */}
                        {data.user.isLiked && (
                          <div className="absolute -top-1 -right-1 z-10 animate-slide-up">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-600 blur-lg opacity-75 glow-pulse"></div>
                              <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 p-1.5 rounded-bl-2xl rounded-tr-2xl shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                <div className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-crown w-4 h-4 text-white"
                                    aria-hidden="true"
                                  >
                                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                                    <path d="M5 21h14"></path>
                                  </svg>
                                  <span className="text-xs font-bold text-white">
                                    ELITE
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <style>{`
                      .glow-amber {
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
                      }
                    `}</style>
                      </div>
                    ))
                  ) : (
                    <EmptySearchState />
                  )
                ) : (
                  // Regular Chat List
                  directMessagesContact &&
                  directMessagesContact.map((chat, index) => (
                    <div
                      key={chat._id}
                      onClick={() => hanleDmContactClick(chat)}
                      onMouseEnter={() => setHoveredChat(chat._id)}
                      onMouseLeave={() => setHoveredChat(null)}
                      className={`chat-item relative flex items-center p-3 mb-1.5 cursor-pointer transition-all duration-300 rounded-lg
                           bg-gray-800/40 border border-gray-700/50
                           ${
                             selectedChat?._id === chat._id
                               ? "selected-highlight border-emerald-500/30"
                               : "hover:bg-gray-800/60 hover:border-gray-600/50"
                           }
                           ${
                             hoveredChat === chat._id
                               ? "translate-x-1"
                               : "translate-x-0"
                           }
                           group hover-lift`}
                      style={{
                        animationDelay: `${index * 60}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      {/* Avatar with Status */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden transition-all duration-300 ${
                            hoveredChat === chat.id
                              ? "scale-110 rotate-3"
                              : "scale-100"
                          } ${
                            selectedChat?._id === chat._id
                              ? "ring-2 ring-emerald-500/50"
                              : ""
                          }`}
                        >
                          <img
                            src={chat.profilePicture}
                            alt={chat.fullName}
                            className="w-full h-full object-cover bg-green-400"
                          />
                          {hoveredChat === chat._id && (
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent animate-fadeInUp"></div>
                          )}
                        </div>
                        {onlineUsers.includes(chat._id) && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900 animate-statusPulse"></div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="ml-3 flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-medium text-sm transition-all duration-300 truncate ${
                              selectedChat?._id === chat._id
                                ? "text-emerald-400"
                                : "text-gray-200"
                            } ${
                              hoveredChat === chat._id
                                ? "text-gray-100 translate-x-1"
                                : ""
                            }`}
                          >
                            {chat.fullName}
                          </h3>
                          <span
                            className={`text-xs text-gray-500 whitespace-nowrap ml-2 transition-all duration-300 ${
                              hoveredChat === chat._id ? "text-gray-400" : ""
                            }`}
                          >
                            {formatTime(chat.latestMessageTime)}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-0.5 truncate transition-all duration-300 ${
                            hoveredChat === chat._id ? "text-gray-400" : ""
                          }`}
                        >
                          {chat.username}
                        </p>
                        <p
                          className={`text-sm text-gray-400 mt-0.5 truncate animate-messageSlide ${
                            hoveredChat === chat._id ? "text-gray-300" : ""
                          }`}
                          style={{ animationDelay: `${index * 60 + 100}ms` }}
                        >
                          {chat.latestMessage}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {chat.totalUnreadMessages > 0 && (
                        <div
                          className={`ml-2 bg-emerald-500 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 unread-badge-pop ${
                            hoveredChat === chat.id ? "scale-110" : ""
                          } transition-transform duration-300`}
                        >
                          {chat.totalUnreadMessages}
                        </div>
                      )}

                      {/* Hover shimmer effect */}
                      {hoveredChat === chat._id && (
                        <div className="absolute inset-0 animate-shimmer pointer-events-none rounded-lg"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <ChannelContainer
            channels={channels}
            handleChannelClick={handleChannelClick}
            setHoveredChat={setHoveredChat}
            hoveredChat={hoveredChat}
            selectedChat={selectedChat}
            selectedChatType={selectedChatType}
            formatTime={formatTime}
          />
        </div>
      }

      <CreateChannelModal
        showCreateChannel={showCreateChannel}
        setShowCreateChannel={setShowCreateChannel}
        channelName={channelName}
        setChannelName={setChannelName}
        channelSearchText={channelSearchText}
        setChannelSearchText={setChannelSearchText}
        selectedChannelMembers={selectedChannelMembers}
        setSelectedChannelMembers={setSelectedChannelMembers}
        isCreatingChannel={isCreatingChannel}
        setIsCreatingChannel={setIsCreatingChannel}
        allCandidatesForChannel={allCandidatesForChannel}
      />
    </div>
  );
};

export default Sidebar;
