import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Trash2, X, Check, Move, Edit3 } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { DELETE_PROFILE_PIC, UPLOAD_PROFILE_PIC } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../features/userSlice";
import { setLoading, setLoadingTexts } from "../../features/loaderSlice";
import { setNotify } from "../../features/notifySlice";
import { CircleUserRound } from 'lucide-react';

const ProfilePic = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();

    const [profilePhoto, setProfilePhoto] = useState(userInfo.profilePicture);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    setImageSize({ width: img.width, height: img.height });
                    setOriginalImage(e.target.result);
                    setPreviewPhoto(e.target.result);
                    setPosition({ x: 0, y: 0 });
                    setShowPreview(true);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleDelete = async () => {
        setProfilePhoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        try {
            dispatch(setLoadingTexts(["Erasing warrior image..."]));
            dispatch(setLoading(true));
            const response = await apiClient.delete(DELETE_PROFILE_PIC, {
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log(response.data);
                dispatch(setUserInfo({ ...userInfo, profilePicture: null }));
                dispatch(setLoading(false));
                dispatch(
                    setNotify({
                        message: "Avatar successfully removed!",
                        type: "success",
                    })
                );

                dispatch(setLoadingTexts(null));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging) return;

            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Limit movement to keep image within reasonable bounds
            const maxMove = 100;
            setPosition({
                x: Math.max(-maxMove, Math.min(maxMove, newX)),
                y: Math.max(-maxMove, Math.min(maxMove, newY)),
            });
        },
        [isDragging, dragStart]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const generateCroppedImage = () => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                const outputSize = 400;
                canvas.width = outputSize;
                canvas.height = outputSize;

                // Create circular clipping path
                ctx.beginPath();
                ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
                ctx.clip();

                // Calculate scaling to fit the circular area
                const containerSize = 280;
                const minDimension = Math.min(img.width, img.height);
                const scale =
                    (outputSize / containerSize) * (containerSize / minDimension);

                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;

                // Center and apply position offset
                const centerX = outputSize / 2;
                const centerY = outputSize / 2;
                const offsetScale = outputSize / containerSize;

                const x = centerX - scaledWidth / 2 + position.x * offsetScale;
                const y = centerY - scaledHeight / 2 + position.y * offsetScale;

                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

                // Convert canvas to blob directly (no base64 conversion)
                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    "image/jpeg",
                    0.9
                );
            };

            img.src = originalImage;
        });
    };

    const handleConfirmPhoto = async () => {
        const croppedImageBlob = await generateCroppedImage(); // Now returns a Blob directly

        // Convert blob to base64 for preview display
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfilePhoto(e.target.result);
        };
        reader.readAsDataURL(croppedImageBlob);

        setShowPreview(false);
        setPreviewPhoto(null);
        setOriginalImage(null);
        setPosition({ x: 0, y: 0 });

        // CREATE FORMDATA FOR MULTER - Direct Blob, no conversion needed!
        const formData = new FormData();
        formData.append("profilePic", croppedImageBlob, "profile-photo.jpg");
        // formData.append('userId', 'your-user-id'); // Add any additional data you need

        try {
            dispatch(
                setLoadingTexts([
                    "Uploading avatar...",
                    "Processing battle portrait...",
                ])
            );
            dispatch(setLoading(true));
            const response = await apiClient.post(UPLOAD_PROFILE_PIC, formData, {
                withCredentials: true,
            });
            const { profilePicture } = response.data.user;
            dispatch(setUserInfo({ ...userInfo, profilePicture }));
            dispatch(setLoading(false));
            dispatch(
                setNotify({
                    message: "Avatar registered successfully!",
                    type: "success",
                })
            );
            dispatch(setLoadingTexts(null));
        } catch (err) {
            dispatch(
                setNotify({ message: "Avatar registered failed!", type: "error" })
            );
            console.log(err.message);
        }
    };

    const handleCancelPreview = () => {
        setShowPreview(false);
        setPreviewPhoto(null);
        setOriginalImage(null);
        setPosition({ x: 0, y: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getImageStyle = () => {
        if (!imageSize.width || !imageSize.height) return {};

        const containerSize = 280;
        const { width, height } = imageSize;
        const minDimension = Math.min(width, height);
        const scale = containerSize / minDimension;

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        return {
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: `${-scaledHeight / 2}px`,
            marginLeft: `${-scaledWidth / 2}px`,
        };
    };

    return (
        <div className="relative">
            <style>{`
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .rotate-slow {
          animation: rotate360 8s linear infinite;
        }
      `}</style>

            {/* Main Profile Photo Section */}
            <div className="flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CircleUserRound className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Warrior Avatar</h3>
                </div>

                {/* Profile Photo Container */}
                <div className="relative group">
                    <div
                        className={`relative w-40 h-40 rounded-full overflow-hidden border-4 cursor-pointer transition-all duration-500 ${isHovered
                                ? "border-green-400 shadow-2xl shadow-green-500/30 scale-105"
                                : profilePhoto
                                    ? "border-gray-600 shadow-xl"
                                    : "border-dashed border-gray-500"
                            }`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleEditClick}
                    >
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>

                        {/* Profile Image or Upload Zone */}
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover relative z-10"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                                <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-3 shadow-lg">
                                    <Camera className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">
                                    Upload Photo
                                </p>
                                <p className="text-gray-500 text-xs mt-1">Click to browse</p>
                            </div>
                        )}

                        {/* Improved Hover Overlay with Edit Icon */}
                        <div
                            className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 z-20 ${isHovered ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                                    <Edit3 className="w-6 h-6 text-white" />
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {/* Delete Button */}
                    {profilePhoto && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-110 z-30 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 text-white" />
                        </button>
                    )}
                </div>

                {/* Photo Info */}
                <div className="text-center space-y-2">
                    <p className="text-gray-300 text-sm font-medium">
                        {profilePhoto
                            ? "Your warrior is ready for battle!"
                            : "Show your warrior spirit"}
                    </p>
                    <p className="text-gray-500 text-xs">JPG, PNG or GIF • Max 5MB</p>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    name="profilePic"
                />
            </div>

            {/* Simplified Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-10 max-w-md w-full border border-gray-700/50 shadow-2xl">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Position Your Avatar
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Drag to reposition the image
                            </p>
                        </div>

                        {/* Main Crop Area */}
                        <div className="relative mb-6">
                            <div
                                className="w-70 h-70 mx-auto rounded-full overflow-hidden border-4 border-green-400 shadow-2xl shadow-green-500/30 relative bg-gray-900 cursor-grab active:cursor-grabbing"
                                style={{ width: "280px", height: "280px" }}
                                onMouseDown={handleMouseDown}
                            >
                                {previewPhoto && (
                                    <img
                                        src={previewPhoto}
                                        alt="Preview"
                                        className="select-none pointer-events-none object-cover"
                                        style={getImageStyle()}
                                        draggable={false}
                                    />
                                )}

                                {/* Center guide */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={handleCancelPreview}
                                className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmPhoto}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 shadow-lg shadow-green-500/30"
                            >
                                <Check className="w-4 h-4" />
                                Perfect!
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                                <Move className="w-3 h-3" />
                                Drag to reposition • Image auto-fits to circle
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePic;
