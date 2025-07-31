import { useEffect, useRef, useState } from "react";
import { Shield, Zap, Download, X, FileText, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "../../../../lib/apiClient";
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES,
} from "../../../../utils/constants";
import { setSelectedChatMessages } from "../../../../features/chatSlice";
import { useSocket } from "../../../../contexts/SocketContext";

const MessageContainer = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedChatMessages, selectedChatData, selectedChatType } =
    useSelector((state) => state.chat.chatInfo);
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const socket = useSocket();

  const getChannelMessages = async () => {
    try {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);
        dispatch(setSelectedChatMessages(response.data.messages));
      }
    } catch (err) {
      console.error("error in get channel messages : ", err.message);
    }
  };
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES,
          { receiverId: selectedChatData.user._id },
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log(response.data);
          dispatch(setSelectedChatMessages(response.data.messages));
        }
      } catch (err) {
        console.error("error in getting messages : ", err.message);
      }
    };
    if (selectedChatType === "contact" && selectedChatData.user._id) {
      getMessages();
    }
    if (selectedChatType === "channel" && selectedChatData._id) {
      getChannelMessages();
    }
  }, [selectedChatType, selectedChatData]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatMessages, isTyping]);

  // Function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Function to format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const dateKey = formatDate(message.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(selectedChatMessages || []);

  const downloadFile = async (url, filename = "download") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
  };

  const handleStopTyping = () => {
    setIsTyping(false);
  };

  const handleTypingChannel = (data) => {
    // console.log(`${data.userData.fullName} is typing now `);
    if (selectedChatData._id === data.channelId) {
      setTypingUsers((prev) =>
        prev.find((user) => user.id === data.userData.id)
          ? prev
          : [...prev, data.userData]
      );

      // dispatch(addTypingUser(data.userData));
    }
  };

  const handleStopTypingChannel = (data) => {
    // console.log(`${data.userData.fullName} is stooped typing `)
    if (selectedChatData._id === data.channelId) {
      setTypingUsers((prev) =>
        prev.filter((item) => item.id !== data.userData.id)
      );
      // dispatch(removeTypingUser(data.userData));
    }
  };

  const renderChannelMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-sm">No messages in this channel yet</p>
          <p className="text-xs mt-1">Be the first warrior to speak!</p>
        </div>
      );
    }

    const groupedChannelMessages = groupMessagesByDate(selectedChatMessages);

    return (
      <div className="relative max-w-5xl mx-auto w-full">
        {Object.entries(groupedChannelMessages).map(([date, messages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-700/50">
                <span className="text-xs text-gray-400 font-medium">
                  {date}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {messages.map((message, index) => {
              const isOwnMessage = message.sender._id === userInfo.id;

              // Check if this is a continuation of previous message
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const isContinuation =
                prevMessage &&
                prevMessage.sender._id === message.sender._id &&
                new Date(message.timestamp) - new Date(prevMessage.timestamp) <
                  300000; // 5 minutes

              return (
                <div
                  key={message._id}
                  className={`message-item mb-${isContinuation ? "2" : "4"} ${
                    isOwnMessage ? "flex flex-row-reverse" : "flex"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Avatar Section */}
                  <div
                    className={`flex-shrink-0 ${
                      isOwnMessage ? "ml-3" : "mr-3"
                    }`}
                  >
                    {!isContinuation ? (
                      <div className="relative">
                        <img
                          src={message.sender.profilePicture}
                          alt={message.sender.fullName}
                          className="w-10 h-10 rounded-full border-2 border-slate-800 shadow-md"
                        />
                        {message.sender._id === selectedChatData.admin._id && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <Shield className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-10 h-10" /> // Spacer
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 max-w-[70%] ${
                      isOwnMessage ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    {/* Sender Name (only show if not continuation) */}
                    {!isContinuation && !isOwnMessage && (
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-sm font-medium text-gray-300">
                          {message.sender.fullName}
                        </span>
                        {message.sender._id === selectedChatData.admin._id && (
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`
                      message-bubble px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-sm
                      ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 text-white hover:from-green-600/30 hover:to-green-500/30"
                          : message.sender._id === selectedChatData.admin._id
                          ? "bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 text-white hover:from-purple-600/30 hover:to-purple-500/30"
                          : "bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 text-gray-100 hover:from-slate-800/60 hover:to-slate-700/60"
                      }
                      ${
                        isOwnMessage
                          ? isContinuation
                            ? "rounded-tr-sm"
                            : "rounded-tr-sm rounded-br-sm"
                          : isContinuation
                          ? "rounded-tl-sm"
                          : "rounded-tl-sm rounded-bl-sm"
                      }
                    `}
                    >
                      {/* Message Content */}
                      {message.messageType === "text" ? (
                        <p className="text-sm leading-relaxed break-words">
                          {message.content}
                        </p>
                      ) : message.messageType === "file" ? (
                        <div className="space-y-2">
                          {message.fileType === "image" ? (
                            <div
                              className="relative group cursor-pointer"
                              onClick={() => setPreviewImage(message.fileUrl)}
                            >
                              <img
                                src={message.fileUrl}
                                alt="Shared image"
                                className="max-w-full rounded-lg border border-slate-600/30 group-hover:border-green-500/50 transition-colors"
                                style={{
                                  maxHeight: "300px",
                                  objectFit: "contain",
                                }}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-green-500/30 transition-colors">
                              <FileText className="w-8 h-8 text-green-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">
                                  Document
                                </p>
                                <p className="text-xs text-gray-400">
                                  Click to download
                                </p>
                              </div>
                              <a
                                href={message.fileUrl}
                                download
                                className="p-2 hover:bg-green-500/20 rounded-full transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="w-4 h-4 text-green-400" />
                              </a>
                            </div>
                          )}
                          {message.content && (
                            <p className="text-sm leading-relaxed break-words mt-2">
                              {message.content}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Timestamp */}
                    <div
                      className={`mt-1 px-2 ${
                        isOwnMessage ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 mb-2 animate-fadeInUp">
            {/* Avatars with pulse effect */}
            <div className="flex -space-x-2 relative">
              {typingUsers.slice(0, 3).map((user, index) => (
                <div key={user.id || index} className="relative">
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full border-2 border-slate-800 shadow-lg relative z-10 hover:z-20 transition-all duration-200 hover:scale-110"
                  />
                  {/* Pulse ring animation */}
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </div>
              ))}
              {typingUsers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-gray-300 relative z-10">
                  +{typingUsers.length - 3}
                </div>
              )}
            </div>

            {/* Typing message with gradient text */}
            <div className="flex items-center gap-2 flex-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {typingUsers.length === 1
                    ? typingUsers[0].fullName
                    : typingUsers.length === 2
                    ? `${typingUsers[0].fullName} and ${typingUsers[1].fullName}`
                    : `${typingUsers[0].fullName} and ${
                        typingUsers.length - 1
                      } others`}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">
                    {typingUsers.length === 1 ? "is" : "are"} typing
                  </span>

                  {/* Animated dots with wave effect */}
                  <div className="flex gap-0.5 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-typing-wave"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-typing-wave"
                      style={{ animationDelay: "200ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-typing-wave"
                      style={{ animationDelay: "400ms" }}
                    />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    );
  };

  useEffect(() => {
    socket.current.on("triggerTyping", handleTyping);
    socket.current.on("triggerStopTyping", handleStopTyping);

    socket.current.on("triggerTypingChannel", handleTypingChannel);
    socket.current.on("triggerStopTypingChannel", handleStopTypingChannel);

    return () => {
      socket.current.off("triggerTyping");
      socket.current.off("triggerStopTyping");

      socket.current.off("triggerTypingChannel");
      socket.current.off("triggerStopTypingChannel");
    };
  }, [socket.current]);

  const ImagePreviewModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => downloadFile(imageUrl, "image.jpg")}
            className="absolute bottom-4 right-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* Custom Scrollbar */
        @keyframes typing-wave {
            0%, 60%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.5;
            }
            30% {
              transform: translateY(-10px) scale(1.5);
              opacity: 1;
            }
          }

          .animate-typing-wave {
            animation: typing-wave 1.4s infinite ease-in-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.3s ease-out;
          }



        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 3px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.9);
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(71, 85, 105, 0.8) rgba(51, 65, 85, 0.3);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-item {
          animation: fadeInUp 0.4s ease-out;
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
        
        .bg-pattern {
          animation: glow 4s ease-in-out infinite;
        }
        
        .message-bubble {
          transition: all 0.3s ease;
        }
        
        .message-bubble:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

                @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-content {
          animation: modalFadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 custom-scrollbar">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="bg-pattern absolute inset-0"
            style={{
              backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
            `,
            }}
          ></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Floating Icons Background */}
        <div className="absolute top-10 left-10 text-green-500/5 transform rotate-12">
          <Shield className="w-24 h-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-purple-500/5 transform -rotate-12">
          <Zap className="w-32 h-32" />
        </div>

        {/* Messages */}
        {selectedChatType === "contact" &&
          selectedChatMessages.length > 0 &&
          selectedChatData && (
            <div className="relative max-w-4xl mx-auto w-full">
              {Object.entries(groupedMessages).map(([date, messages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-700/50">
                      <span className="text-xs text-gray-400 font-medium">
                        {date}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === userInfo.id;
                    const otherUser = isOwnMessage
                      ? message.receiver
                      : message.sender;

                    // Check if next message is from the same sender
                    const isLastMessageFromSender =
                      index === messages.length - 1 ||
                      messages[index + 1].sender._id !== message.sender._id;

                    return (
                      <div
                        key={message._id}
                        className={`message-item flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        } mb-4`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Profile Picture for received messages */}
                        {!isOwnMessage && (
                          <div
                            className={`flex-shrink-0 mr-3 ${
                              !isLastMessageFromSender ? "invisible" : ""
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                              {otherUser.profilePicture ? (
                                <img
                                  src={otherUser.profilePicture}
                                  alt={otherUser.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                otherUser.fullName.charAt(0).toUpperCase()
                              )}
                            </div>
                          </div>
                        )}

                        <div className={`max-w-[60%] lg:max-w-[50%]`}>
                          {/* Message Bubble */}
                          <div
                            className={`
                          message-bubble px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm
                          ${
                            isOwnMessage
                              ? "bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 text-white hover:from-green-600/30 hover:to-green-500/30 rounded-br-sm"
                              : "bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 text-gray-100 hover:from-slate-800/60 hover:to-slate-700/60 rounded-bl-sm"
                          }
                        `}
                          >
                            {/* Message Content */}
                            {message.messageType === "text" ? (
                              <p className="text-sm leading-relaxed break-words">
                                {message.content}
                              </p>
                            ) : message.messageType === "file" ? (
                              <div className="space-y-2">
                                {message.fileType === "image" ? (
                                  <div
                                    className="relative group cursor-pointer"
                                    onClick={() =>
                                      setPreviewImage(message.fileUrl)
                                    }
                                  >
                                    <img
                                      src={message.fileUrl}
                                      alt="Shared image"
                                      className="max-w-full rounded-lg border border-slate-600/30 group-hover:border-green-500/50 transition-colors"
                                      style={{
                                        maxHeight: "300px",
                                        objectFit: "contain",
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                      <Eye className="w-8 h-8 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-green-500/30 transition-colors">
                                    <FileText className="w-8 h-8 text-green-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-white truncate">
                                        Document
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Click to download
                                      </p>
                                    </div>
                                    <a
                                      href={`${message.fileUrl}`}
                                      download
                                      className="p-2 hover:bg-green-500/20 rounded-full transition-colors"
                                    >
                                      <Download className="w-4 h-4 text-green-400" />
                                    </a>
                                  </div>
                                )}
                                {message.content && (
                                  <p className="text-sm leading-relaxed break-words mt-2">
                                    {message.content}
                                  </p>
                                )}
                              </div>
                            ) : null}
                          </div>

                          {/* Timestamp */}
                          <div
                            className={`mt-1 px-2 ${
                              isOwnMessage ? "text-right" : "text-left"
                            }`}
                          >
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Profile Picture for sent messages */}
                        {isOwnMessage && (
                          <div
                            className={`flex-shrink-0 ml-3 ${
                              !isLastMessageFromSender ? "invisible" : ""
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                              {userInfo.profilePicture ? (
                                <img
                                  src={userInfo.profilePicture}
                                  alt={userInfo.fullName || "User"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                userInfo.fullName?.charAt(0).toUpperCase() ||
                                "U"
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center">
                  <img
                    src={selectedChatData.user.profilePicture}
                    alt="profilePic"
                    className="w-6 h-6 rounded-full bg-green-400"
                  />
                  <div className="flex flex-col justify-center gap-1 items-center space-x-2 px-4 py-2 max-w-[100px]">
                    <div className="flex space-x-1 items-center bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-600/30">
                      <div
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        {/* if type is channnel then messages here */}
        {selectedChatType === "channel" &&
          selectedChatData &&
          renderChannelMessages()}
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
};

export default MessageContainer;
