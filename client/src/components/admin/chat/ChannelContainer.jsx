import { Hash } from "lucide-react";
import { useSelector } from "react-redux";

const ChannelContainer = ({
  channels,
  handleChannelClick,
  setHoveredChat,
  hoveredChat,
  selectedChat,
  selectedChatType,
  formatTime,
}) => {
  const { directMessagesContact } = useSelector((state) => state.chat.chatInfo);

  const formatMessagePreview = (content, maxLength = 30) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div
      className={`${
        directMessagesContact.length < 4 ? "h-[50vh]" : "h-[22vh]"
      }  flex flex-col border-t border-gray-800`}
    >
      <div className="px-4 py-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Channels
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-2">
          {channels &&
            channels.map((channel, index) => {
              const lastMessage = channel.messages?.at(-1);
              const hasMessages = lastMessage ;

              return (
                <div
                  key={channel._id}
                  onClick={() => handleChannelClick(channel)}
                  onMouseEnter={() => setHoveredChat(channel._id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  className={`chat-item relative flex items-center p-2.5 mb-1 cursor-pointer transition-all duration-300 rounded-lg
                         bg-gray-800/40 border border-gray-700/50
                         ${
                           selectedChat?._id === channel._id &&
                           selectedChatType === "channel"
                             ? "selected-highlight border-emerald-500/30"
                             : "hover:bg-gray-800/60 hover:border-gray-600/50"
                         }
                         ${
                           hoveredChat === channel._id
                             ? "translate-x-1"
                             : "translate-x-0"
                         }
                         group hover-lift`}
                  style={{
                    animationDelay: `${index * 60}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium text-sm transition-all duration-300 truncate ${
                          selectedChat?._id === channel._id &&
                          selectedChatType === "channel"
                            ? "text-emerald-400"
                            : "text-gray-200"
                        }`}
                      >
                        {channel.name}
                      </h3>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          {channel.members.length} members
                        </span>
                        
                      </div>
                    </div>

                    {hasMessages ? (
                      <div className="flex justify-between">
                        <div className="flex items-center mt-1 space-x-1.5">
                          {/* Sender's profile picture */}
                          <img
                            src={
                              lastMessage.sender.profilePicture ||
                              "/default-avatar.png"
                            }
                            alt={lastMessage.sender.fullName}
                            className="w-4 h-4 rounded-full flex-shrink-0"
                          />

                          {/* Last message preview */}
                          <div className="flex items-baseline space-x-1 min-w-0">
                            <span className="text-xs font-medium text-gray-400 flex-shrink-0">
                              {lastMessage.sender.fullName}:
                            </span>
                            <p className="text-xs text-gray-500 truncate">
                              {lastMessage.messageType === "file"
                                ? lastMessage.fileType === "image"
                                  ? "📷 Image"
                                  : "📎 File"
                                : formatMessagePreview(lastMessage.content, 25)}
                            </p>
                          </div>
                        </div>
                        {hasMessages && (
                          <span className="text-xs text-gray-400 mt-0.5">
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}        
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ChannelContainer;
