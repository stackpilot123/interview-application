import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Zap } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageContainer from './MessageContainer';
import MessageBar from './MessageBar';

const ChatContainer = ({ 
  profilePic, 
  fullName, 
  messages, 
  currentUserId, 
  onSendMessage 
}) => {
  return (
    <div className="flex flex-col h-[88vh] w-full bg-slate-900 overflow-hidden shadow-2xl border-l border-green-500/10 relative">
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative flex flex-col h-full">
        <ChatHeader 
          profilePic={profilePic} 
          fullName={fullName} 
        />
        
        <MessageContainer 
          messages={messages} 
          currentUserId={currentUserId} 
        />
        
        <MessageBar 
          onSendMessage={onSendMessage} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;