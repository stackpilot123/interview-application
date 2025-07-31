import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, FileSpreadsheet } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../contexts/SocketContext";
import { apiClient } from "../../../../lib/apiClient";
import { UPLOAD_MESSAGE_FILE } from "../../../../utils/constants";

const MessageBar = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.chat.chatInfo
  );

  const socket = useSocket();
  const typingTimeoutRef = useRef(null);
  const typingTimeoutRefChannel = useRef(null);

  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isHoveringEmoji, setIsHoveringEmoji] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview({
            type: "image",
            url: reader.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just store the file info
        setFilePreview({
          type: "file",
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
        });
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFileAndGetUrl = async (file) => {
    try {
      const formData = new FormData();
      formData.append("fileForMessage", file);

      const response = await apiClient.post(UPLOAD_MESSAGE_FILE, formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data.url;
      }
    } catch (err) {
      console.error("error in uploading the message file: ", err.message);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {};
    let channelMessageData = {};
    if (selectedChatType === "contact") {
      if (selectedFile) {
        setIsUploading(true);
        const fileUrl = await uploadFileAndGetUrl(selectedFile);
        removeFile();
        data = {
          sender: userInfo.id,
          receiver: selectedChatData.user._id,
          messageType: "file",
          fileType: filePreview.type === "image" ? "image" : "file",
          content: message.trim(),
          fileUrl: fileUrl,
        };
        setIsUploading(false);
      } else {
        data = {
          sender: userInfo.id,
          receiver: selectedChatData.user._id,
          messageType: "text",
          content: message.trim(),
        };
      }
      setMessage("");
      socket.current.emit("sendMessage", data);
    } else if (selectedChatType === "channel") {
      if (selectedFile) {
        setIsUploading(true);
        const fileUrl = await uploadFileAndGetUrl(selectedFile);
        removeFile();
        channelMessageData = {
          sender: userInfo.id,
          messageType: "file",
          fileType: filePreview.type === "image" ? "image" : "file",
          content: message.trim(),
          fileUrl: fileUrl,
        };
        setIsUploading(false);
      } else {
        channelMessageData = {
          sender: userInfo.id,
          messageType: "text",
          content: message.trim(),
        };
      }
      setMessage("");
      socket.current.emit("sendChannelMessage", {
        channelMessageData,
        channelId: selectedChatData._id,
      });
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current?.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  useEffect(() => {
    
    if (
      selectedChatType === "contact" &&
      selectedChatData &&
      message.trim().length !== 0
    ) {
      socket.current.emit("typing", { anotherUserId: selectedChatData.user._id });
  
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
  
      // Set new timeout to emit "stopTyping" after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit("stopTyping", {
          anotherUserId: selectedChatData.user._id,
        });
      }, 1500);
    } else if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.current.emit("stopTyping", {
        anotherUserId: selectedChatData.user._id,
      });
    }
  
    if (
      selectedChatType === "channel" &&
      selectedChatData &&
      message.trim().length !== 0
    ) {
      socket.current.emit("typingChannel", { channelId: selectedChatData._id, userData: {id: userInfo.id, fullName: userInfo.fullName, profilePicture: userInfo.profilePicture} });
  
      if (typingTimeoutRefChannel.current) {
        clearTimeout(typingTimeoutRefChannel.current);
      }
  
      // Set new timeout to emit "stopTyping" after 1 second of inactivity
      typingTimeoutRefChannel.current = setTimeout(() => {
        socket.current.emit("stopTypingChannel", { channelId: selectedChatData._id, userData: {id: userInfo.id, fullName: userInfo.fullName, profilePicture: userInfo.profilePicture} });
      }, 2000);
    } else if (typingTimeoutRefChannel.current) {
      clearTimeout(typingTimeoutRefChannel.current);
      socket.current.emit("stopTypingChannel", { channelId: selectedChatData._id, userData: {id: userInfo.id, fullName: userInfo.fullName, profilePicture: userInfo.profilePicture} });
    }
  
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingTimeoutRefChannel.current) {
        clearTimeout(typingTimeoutRefChannel.current);
      }

    }
  }, [message, selectedChatData])
  

  const UploadLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative">
        {/* Hexagon loader */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Animated hexagon background */}
          <svg
            className="absolute w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,5 90,25 90,75 50,95 10,75 10,25"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="240"
              strokeDashoffset="0"
              className="animate-dash"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress bar circle */}
          <div className="absolute w-28 h-28 rounded-full border-4 border-slate-800/50">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-purple-500 animate-spin"></div>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-500/30">
              <Paperclip className="w-8 h-8 text-green-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text with glitch effect */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400 glitch-text">
            UPLOADING FILE
          </h3>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-green-500/50 rounded-full overflow-hidden">
              <div className="h-full w-full bg-green-500 rounded-full animate-slide"></div>
            </div>
            <span className="text-sm text-gray-400">Please wait</span>
            <div className="h-1 w-8 bg-purple-500/50 rounded-full overflow-hidden">
              <div className="h-full w-full bg-purple-500 rounded-full animate-slide-reverse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <style>{`
      @keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -480;
  }
}

.animate-dash {
  animation: dash 3s linear infinite;
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-slide {
  animation: slide 1.5s ease-in-out infinite;
}

@keyframes slide-reverse {
  0% {
    transform: translateX(200%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-slide-reverse {
  animation: slide-reverse 1.5s ease-in-out infinite;
}

/* Glitch effect */
@keyframes glitch {
  0%, 100% {
    text-shadow: 
      0.05em 0 0 rgba(34, 197, 94, 0.75),
      -0.05em -0.025em 0 rgba(168, 85, 247, 0.75),
      0.025em 0.05em 0 rgba(59, 130, 246, 0.75);
  }
  15% {
    text-shadow: 
      0.05em 0 0 rgba(34, 197, 94, 0.75),
      -0.05em -0.025em 0 rgba(168, 85, 247, 0.75),
      0.025em 0.05em 0 rgba(59, 130, 246, 0.75);
  }
  16% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(34, 197, 94, 0.75),
      0.025em 0.025em 0 rgba(168, 85, 247, 0.75),
      -0.05em -0.05em 0 rgba(59, 130, 246, 0.75);
  }
  49% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(34, 197, 94, 0.75),
      0.025em 0.025em 0 rgba(168, 85, 247, 0.75),
      -0.05em -0.05em 0 rgba(59, 130, 246, 0.75);
  }
  50% {
    text-shadow: 
      0.025em 0.05em 0 rgba(34, 197, 94, 0.75),
      0.05em 0 0 rgba(168, 85, 247, 0.75),
      0 -0.05em 0 rgba(59, 130, 246, 0.75);
  }
  99% {
    text-shadow: 
      0.025em 0.05em 0 rgba(34, 197, 94, 0.75),
      0.05em 0 0 rgba(168, 85, 247, 0.75),
      0 -0.05em 0 rgba(59, 130, 246, 0.75);
  }
}

.glitch-text {
  animation: glitch 2s infinite;
}



              @keyframes filePreviewSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .file-preview {
          animation: filePreviewSlide 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .message-bar-container {
          animation: slideUp 0.5s ease-out;
        }
        
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }
        
        .input-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        @keyframes sendPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .send-button-active:active {
          animation: sendPulse 0.3s ease-out;
        }
        
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        .icon-hover:hover {
          animation: iconFloat 0.5s ease-in-out infinite;
        }
        
        @keyframes emojiPopIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .emoji-picker-wrapper {
          animation: emojiPopIn 0.3s ease-out;
        }
        
        /* Hide emoji icon on mobile devices */
        @media (max-width: 640px) {
          .emoji-icon-wrapper {
            display: none;
          }
        }
        
        /* Custom emoji picker theme overrides */
        .emoji-picker-wrapper .EmojiPickerReact {
          --epr-bg-color: #1e293b !important;
          --epr-category-label-bg-color: #1e293b !important;
          --epr-text-color: #fff !important;
          --epr-search-input-bg-color: #334155 !important;
          --epr-search-border-color: #22c55e33 !important;
          --epr-skin-tone-picker-menu-color: #334155 !important;
          --epr-group-title-text-color: #22c55e !important;
          --epr-picker-border-color: #22c55e33 !important;
          --epr-hover-bg-color: #22c55e33 !important;
          --epr-focus-bg-color: #22c55e44 !important;
          --epr-search-input-bg-color-active: #475569 !important;
          --epr-category-icon-active-color: #22c55e !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(34, 197, 94, 0.1) !important;
          border-radius: 12px !important;
        }
        
        .emoji-picker-wrapper .EmojiPickerReact .epr-search {
          background-color: #334155 !important;
          border-color: #22c55e33 !important;
        }
        
        .emoji-picker-wrapper .EmojiPickerReact .epr-emoji-category-label {
          background-color: #1e293b !important;
          backdrop-filter: blur(10px);
        }
        
        @keyframes attachmentPulse {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-5deg) scale(1.05);
          }
          75% {
            transform: rotate(5deg) scale(1.05);
          }
        }
        
        .attachment-hover:hover {
          animation: attachmentPulse 0.5s ease-in-out;
        }
        
        /* Doom-style glow effects */
        .emoji-picker-wrapper::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #22c55e, #a855f7);
          border-radius: 12px;
          opacity: 0.5;
          filter: blur(10px);
          z-index: -1;
        }

                  /* Customize the Scrollbar for Webkit-based browsers (Chrome, Safari) */
          .emoji-picker-wrapper .EmojiPickerReact::-webkit-scrollbar {
            width: 8px; /* Set the width of the scrollbar */
          }

          .emoji-picker-wrapper .EmojiPickerReact::-webkit-scrollbar-track {
            background: #1e293b; /* Set the background of the scrollbar track */
            border-radius: 10px; /* Optional: Round the corners of the track */
          }

          .emoji-picker-wrapper .EmojiPickerReact::-webkit-scrollbar-thumb {
            background: #22c55e; /* Set the color of the scrollbar thumb */
            border-radius: 10px; /* Optional: Round the corners of the thumb */
            border: 3px solid #1e293b; /* Optional: Add a border around the thumb */
          }

          .emoji-picker-wrapper .EmojiPickerReact::-webkit-scrollbar-thumb:hover {
            background: #4caf50; /* Hover effect for the scrollbar thumb */
          }

          /* Customize the Scrollbar for Firefox */
          .emoji-picker-wrapper .EmojiPickerReact {
            scrollbar-width: thin; /* Makes the scrollbar thinner */
            scrollbar-color: #22c55e #1e293b; /* Set the thumb and track color for Firefox */
          }
      `}</style>

      <div className="message-bar-container p-4 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/80 backdrop-blur-lg border-t border-green-500/20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div
              className={`relative flex items-center transition-all duration-300 ${
                isFocused ? "input-glow" : ""
              }`}
            >
              {/* Glowing Border Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl blur-sm transition-opacity duration-300 ${
                  isFocused ? "opacity-100" : "opacity-50"
                }`}
              ></div>

              {/* File Preview */}
              {filePreview && (
                <div className="absolute file-preview bottom-full left-0 mb-2 p-3 bg-slate-800/95 border border-green-500/30 rounded-lg shadow-lg shadow-green-500/10 min-w-[200px] max-w-[300px]">
                  <div className="flex items-start gap-3">
                    {filePreview.type === "image" ? (
                      <img
                        src={filePreview.url}
                        alt={filePreview.name}
                        className="w-3/4 h-3/4 max-h-[300px] object-cover rounded border border-slate-600"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-green-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {filePreview.type === "file" && (
                        <>
                          <p className="text-sm text-white truncate">
                            {filePreview.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {filePreview.size}
                          </p>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input Container */}
              <div className="relative flex-1 flex items-center bg-slate-800/90 rounded-xl border border-slate-700/50 focus-within:border-green-500/50 transition-all duration-300 hover:bg-slate-800">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your message for the multiverse..."
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                />

                {/* Icon Container */}
                <div className="flex items-center gap-1 px-2">
                  {/* Emoji Picker Button */}
                  <div className="emoji-icon-wrapper relative">
                    <button
                      ref={emojiButtonRef}
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      onMouseEnter={() => setIsHoveringEmoji(true)}
                      onMouseLeave={() => setIsHoveringEmoji(false)}
                      className={`
                        icon-hover p-2 rounded-lg transition-all duration-300 group
                        ${
                          showEmojiPicker
                            ? "bg-green-500/20 text-green-400"
                            : "text-gray-400 hover:text-green-400 hover:bg-slate-700/50"
                        }
                      `}
                    >
                      <Smile
                        className={`w-5 h-5 transition-all duration-300 ${
                          isHoveringEmoji ? "scale-110" : ""
                        }`}
                      />

                      {/* Hover Tooltip */}
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        Add emoji
                      </span>
                    </button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="emoji-picker-wrapper absolute bottom-full right-0 mb-2 z-50"
                      >
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          theme="dark"
                          height={400}
                          width={350}
                          searchPlaceHolder="Search emoji..."
                          skinTonesDisabled={false}
                          previewConfig={{
                            showPreview: false,
                          }}
                          lazyLoadEmojis={true}
                          emojiStyle="native"
                        />
                      </div>
                    )}
                  </div>

                  {/* File Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="attachment-hover p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-slate-700/50 transition-all duration-300 group relative"
                  >
                    <Paperclip className="w-5 h-5" />

                    {/* Hover Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Attach file
                    </span>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={
                    selectedFile ? false : message.trim() ? false : true
                  }
                  className={`
                    send-button-active m-1 p-2.5 rounded-lg transition-all duration-300 transform
                    ${
                      message.trim() || selectedFile
                        ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/25 hover:scale-110 hover:shadow-green-500/40"
                        : "bg-slate-700 text-gray-500 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  <Send
                    className={`w-5 h-5 transition-transform duration-300 ${
                      message.trim() ? "hover:translate-x-1" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </form>
          <input
            ref={fileInputRef}
            type="file"
            name="fileForMessage"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
          />
        </div>
      </div>

      {/* Upload Loader */}
      {isUploading && <UploadLoader />}
    </>
  );
};

export default MessageBar;
