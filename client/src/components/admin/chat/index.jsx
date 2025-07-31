import React, {  useEffect } from "react";
import Sidebar from "./Sidebar";
import EmptyContainer from "./EmptyContainer";
import ChatContainer from "./chatContainer";
import { useSelector } from "react-redux";
import { apiClient } from "../../../lib/apiClient";
import { MARK_MESSAGES_SEEN } from "../../../utils/constants";

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.5);
  }
`;

// Main Chat Component
const ChatComponent = () => {
  const { selectedChatType , selectedChatData, selectedChatMessages} = useSelector((state) => state.chat.chatInfo);


  const markMessagesAsSeen = async ()=>{
    try{
      const response = await apiClient.post(
        MARK_MESSAGES_SEEN,
        {anotherUserId: selectedChatData.user._id},
        {withCredentials: true}
      );

      if(response.status === 200){
        console.log(response.data);
      }
    } catch(err){
      console.error("error in marking the messages as seen : ",err.message);
    }
  }
  useEffect(() => {
      if(selectedChatData){
        if(selectedChatType==="contact"){
          markMessagesAsSeen();
        }
      }
  }, [selectedChatData, selectedChatMessages])
  


  

  return (
    <>
      <div className="flex max-h-[88vh] bg-black rounded-xl overflow-hidden">
        <Sidebar  />
        {selectedChatType ? (
          <div className="flex-1">
            <ChatContainer
              profilePic="https://i.pravatar.cc/150?img=68"
              fullName="Dr. Victor Von Doom"
            />
          </div>
        ) : (
          <EmptyContainer />
        )}
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-floatSlow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-bounceIn { animation: bounceIn 0.5s ease-out; }
      `}</style>
    </>
  );
};

export default ChatComponent;
