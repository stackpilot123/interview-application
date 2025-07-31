import AgoraRTC from 'agora-rtc-sdk-ng';
import { useEffect, useState, useRef } from 'react';
import { agoraConfig } from '../config/agoraConfig';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const VideoCallScreen = ({ roomId, onEndCall }) => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const client = useRef(null);
  
  useEffect(() => {
    // Initialize Agora client
    client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    
    // Start the call
    startCall();
    
    // Cleanup when component unmounts
    return () => {
      leaveCall();
    };
  }, [roomId]);
  
  const startCall = async () => {
    try {
      // 1. Join the Agora channel
      await client.current.join(agoraConfig.appId, roomId, null, null);
      
      // 2. Create local tracks (camera and microphone)
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      // 3. Play local video in your preview
      videoTrack.play('local-video-container');
      
      // 4. Publish your tracks so others can see/hear you
      await client.current.publish([audioTrack, videoTrack]);
      
      // 5. Listen for other users joining
      client.current.on('user-published', async (user, mediaType) => {
        // Subscribe to remote user
        await client.current.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers(prev => [...prev, user]);
          
          // Play remote user's video
          setTimeout(() => {
            user.videoTrack.play(`remote-video-${user.uid}`);
          }, 100);
        }
        
        if (mediaType === 'audio') {
          user.audioTrack.play(); // Audio plays automatically
        }
      });
      
      // Listen for users leaving
      client.current.on('user-left', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });
      
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start video call. Please check your camera/microphone permissions.');
    }
  };
  
  const toggleMute = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(isMuted); // Toggle audio
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(isVideoOff); // Toggle video
      setIsVideoOff(!isVideoOff);
    }
  };
  
  const leaveCall = async () => {
    // Stop all local tracks
    localAudioTrack?.close();
    localVideoTrack?.close();
    
    // Leave the channel
    await client.current?.leave();
    
    onEndCall(); // Call parent's end call function
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Remote user's video (full screen) */}
      <div className="relative h-full w-full">
        {remoteUsers.map(user => (
          <div 
            key={user.uid}
            id={`remote-video-${user.uid}`}
            className="w-full h-full"
          />
        ))}
        
        {/* If no remote user yet, show waiting message */}
        {remoteUsers.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl">Waiting for other person to join...</p>
          </div>
        )}
      </div>
      
      {/* Local video (small, corner) */}
      <div 
        id="local-video-container"
        className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700"
      />
      
      {/* Control buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80`}
        >
          {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </button>
        
        {/* Video toggle */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
        </button>
        
        {/* End call */}
        <button
          onClick={leaveCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCallScreen;