import {
  Search,
  X,
  Plus,
  Hash,
  Check,
} from "lucide-react";
import { apiClient } from "../../../lib/apiClient";
import { CREATE_CHANNEL } from "../../../utils/constants";
import { useDispatch } from "react-redux";
import { addChannel, setSelectedChatData, setSelectedChatType } from "../../../features/chatSlice";



const CreateChannelModal = ({
  showCreateChannel,
  setShowCreateChannel,
  channelName,
  setChannelName,
  channelSearchText,
  setChannelSearchText,
  selectedChannelMembers,
  setSelectedChannelMembers,
  isCreatingChannel,
  setIsCreatingChannel,
  allCandidatesForChannel,
}) => {

  const dispatch = useDispatch();

  // Filter candidates based on search
  const filteredCandidates = allCandidatesForChannel.filter(
    (candidate) =>
      candidate.user.fullName
        .toLowerCase()
        .includes(channelSearchText.toLowerCase()) ||
      candidate.user.username.toLowerCase().includes(channelSearchText.toLowerCase())
  );

  const handleAddMember = (candidate) => {
    if (!selectedChannelMembers.find((m) => m._id === candidate.user._id)) {
      setSelectedChannelMembers([...selectedChannelMembers, candidate]);
    }
  };

  const handleRemoveMember = (candidateId) => {
    setSelectedChannelMembers(
      selectedChannelMembers.filter((m) => m._id !== candidateId)
    );
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      alert("Please enter a channel name");
      return;
    }

    if (selectedChannelMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }

    setIsCreatingChannel(true);

    // Call your API here
    const channelData = {
      name: channelName,
      members: selectedChannelMembers.map((m) => m.user._id),
      memberDetails: selectedChannelMembers,
    };

    console.log("Creating channel with data:", channelData);

    try{
      const response = await apiClient.post(
        CREATE_CHANNEL,
        {name: channelName, members: selectedChannelMembers.map((m) => m.user._id)},
        {withCredentials: true }
      );

      if(response.status === 201){
        console.log(response.data);
        dispatch(addChannel(response.data.channel));
        dispatch(setSelectedChatType("channel"));
        dispatch(setSelectedChatData(response.data.channel));
        setChannelName("");
        setChannelSearchText("");
        setSelectedChannelMembers([]);
        setShowCreateChannel(false);
        setIsCreatingChannel(false);
      }
    } catch(err){
      console.error("error in creating the channel ",err.message);
    }

    // Reset states
  };

  
  
  
  if (!showCreateChannel) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Create New Channel
            </h2>
            <button
              onClick={() => setShowCreateChannel(false)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar">
          {/* Channel Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="e.g. battleworld-tactics"
              className="w-full bg-gray-800/60 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2.5
                       focus:outline-none focus:bg-gray-800/80 focus:ring-2 focus:ring-emerald-500/30
                       transition-all duration-300 border border-gray-700 hover:border-gray-600"
            />
          </div>

          {/* Selected Members */}
          {selectedChannelMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Members ({selectedChannelMembers.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedChannelMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 
                             rounded-full px-3 py-1.5 animate-scaleIn"
                  >
                    <img
                      src={member.user.profilePicture}
                      alt={member.user.fullName}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm text-gray-300">
                      {member.user.fullName}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Members
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={channelSearchText}
                onChange={(e) => setChannelSearchText(e.target.value)}
                placeholder="Search warriors..."
                className="w-full bg-gray-800/60 text-gray-100 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5
                         focus:outline-none focus:bg-gray-800/80 focus:ring-2 focus:ring-emerald-500/30
                         transition-all duration-300 border border-gray-700 hover:border-gray-600"
              />
            </div>

            {/* Candidates List */}
            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredCandidates.map((candidate) => {
                const isSelected = selectedChannelMembers.find(
                  (m) => m._id === candidate._id
                );
                return (
                  <div
                    key={candidate._id}
                    onClick={() => !isSelected && handleAddMember(candidate)}
                    className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200
                              ${isSelected
                        ? "bg-emerald-500/20 border-emerald-500/30"
                        : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60"
                      } border`}
                  >
                    <img
                      src={candidate.user.profilePicture}
                      alt={candidate.user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {candidate.user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{candidate.user.username}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateChannel(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 
                       rounded-lg py-2.5 font-medium transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChannel}
              disabled={
                isCreatingChannel ||
                !channelName.trim() ||
                selectedChannelMembers.length === 0
              }
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white 
                       rounded-lg py-2.5 font-medium transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isCreatingChannel ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Channel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;