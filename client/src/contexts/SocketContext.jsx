import { useEffect, useRef } from "react";
import { useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";
import {
  addMessage,
  setLastSeenData,
  setOnlineUsers,
} from "../features/chatSlice";
import { setCallStatus, setIncomingCall, setIsInCall } from "../features/videoSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { selectedChatType, selectedChatData, selectedChatMessages } =
    useSelector((state) => state.chat.chatInfo);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (
        selectedChatType !== null &&
        (selectedChatData.user._id === message.receiver._id ||
          selectedChatData.user._id === message.sender._id)
      ) {
        console.log(message);
        dispatch(addMessage(message));
      }
    };

    const handleRecieveChannelMessage = (data) => {
      console.info(data);
      if (selectedChatType && selectedChatData._id === data.channelId) {
        dispatch(addMessage(data));
      }
    };
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("connected to socket server");
      });

      socket.current.on("onlineUserData", (data) => {
        console.log(data);
        dispatch(setOnlineUsers(data.onlineUsers));
        dispatch(setLastSeenData(data.lastSeenData));
      });
      socket.current.on("updateOnlineUserData", (data) => {
        console.log(data);
        dispatch(setOnlineUsers(data.onlineUsers));
        dispatch(setLastSeenData(data.lastSeenData));
      });

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("recieveChannelMessage", handleRecieveChannelMessage);

      //video calling sockets
      // When someone calls you
      socket.current.on("incomingCall", (data) => {
        console.log(`${data.callerFullName} is calling you!`);
        dispatch(
          setIncomingCall({
            callerId: data.callerId,
            callerFullName: data.callerFullName,
            callerProfilePicture: data.callerProfilePicture,
            roomId: data.roomId, // Unique ID for this call
          })
        );
        dispatch(setCallStatus("receiving"));

        // Play ringtone
        // const audio = new Audio("/sounds/ringtone.mp3");
        // audio.loop = true;
        // audio.play();
      });

      // When your call is accepted
      socket.current.on("callAccepted", (data) => {
        console.log("Your call was accepted!");
        dispatch(setCallStatus("connected"));
        // Now both users should join the video room
        joinVideoRoom(data.roomId);
      });

      // When your call is rejected
      socket.current.on("callRejected", () => {
        console.log("Call was rejected");
        dispatch(setCallStatus("idle"));
        alert("Call was declined");
      });

      // When call ends
      socket.current.on("callEnded", () => {
        dispatch(setIsInCall(false));
        dispatch(setCallStatus("idle"));
        leaveVideoRoom();
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userInfo, selectedChatType, selectedChatData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
