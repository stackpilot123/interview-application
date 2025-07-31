import { Video } from "lucide-react";
import { useSocket } from "../../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setCallStatus } from "../../features/videoSlice";
const VideoCallButton = () => {
    const userInfo = useSelector((state)=>state.user.userInfo);
    const {selectedChatData} = useSelector((state)=>state.chat.chatInfo);
    const dispatch = useDispatch();
    const socket = useSocket();
    
    const handleVideoCall = () => {
        // Generate unique room ID for this call
        const roomId = `call_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        // Tell the other person you're calling them
        socket.current.emit("initiateCall", {
            receiverId: selectedChatData.user._id,
            callerFullName: userInfo.fullName,
            callerProfilePicture: userInfo.profilePicture,
            roomId: roomId,
        });

        dispatch(setCallStatus("calling"));

        
    };

    return (
        <>
            <button
                className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all duration-300 group transform hover:scale-110 mr-2 cursor-pointer"
                onClick={handleVideoCall}
            >
                <Video className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
            </button>
        </>
    );
};

export default VideoCallButton;
