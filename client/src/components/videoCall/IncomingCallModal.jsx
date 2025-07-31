const IncomingCallModal = ({ incomingCall, onAccept, onReject }) => {
  if (!incomingCall) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        {/* Caller's Picture with pulse animation */}
        <div className="relative mb-4">
          <img 
            src={incomingCall.callerPicture} 
            alt={incomingCall.callerName}
            className="w-32 h-32 rounded-full mx-auto"
          />
          <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping" />
        </div>
        
        <h2 className="text-white text-xl mb-2">{incomingCall.callerName}</h2>
        <p className="text-gray-400 mb-6">Incoming video call...</p>
        
        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onReject}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOffIcon className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={onAccept}
            className="p-4 rounded-full bg-green-500 hover:bg-green-600 animate-pulse"
          >
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;