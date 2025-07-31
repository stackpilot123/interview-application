import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Calendar,
  MapPin,
  Users,
  Zap,
  Clock,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../lib/apiClient";
import { GET_JOB, GET_USER_INFO, UPLOAD_RESUME } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../features/userSlice";
import { setNotify } from "../../features/notifySlice";

const JobApplication = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const getJob = async () => {
    try {
      const response = await apiClient.post(
        GET_JOB,
        { jobId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setJob(response.data.job);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getJob();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadFile = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSubmit = async () => {
    console.log(uploadedFile);
    setIsSubmitting(true);
    // Simulate API call
    const formData = new FormData();
    formData.append("jobId", jobId);
    if (uploadedFile) {
      formData.append("resume", uploadedFile);
    }
    if (resumeText) {
      formData.append("resumeText", resumeText);
    }
    console.log(formData);
    const response = await apiClient.post(UPLOAD_RESUME, formData, {
      withCredentials: true,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });

    if (response.status === 200) {
      console.log(response.data);

      const refereshedUserInfo = await apiClient.get(
        GET_USER_INFO,
        {withCredentials: true}
      );
      dispatch(setUserInfo(refereshedUserInfo.data.user));

      console.log(refereshedUserInfo.data);
      setIsSubmitting(false);
      dispatch(setNotify({message: `Application sent for ${job.title}!`,type:"success"}));
      navigate("/candidate/my-applications");
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {job && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center transform transition-all duration-1000">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent">
                Apply for Mission
              </h1>
              <p className="text-gray-400 text-lg">
                Submit your application to join Doom's elite forces
              </p>
            </div>

            {/* Job Details Card */}
            <div className="bg-gray-800/40 backdrop-blur-lg border border-green-500/20 rounded-2xl p-6 mb-8 shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] transform">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 animate-pulse">
                  {job.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {job.description}
                </p>
              </div>

              {/* Job Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center text-green-400 mb-2">
                    <Clock className="w-5 h-5 mr-2 animate-pulse" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {job.experienceLevel}
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center text-green-400 mb-2">
                    <MapPin className="w-5 h-5 mr-2 animate-pulse" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-white font-bold text-lg">{job.location}</p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center text-green-400 mb-2">
                    <Users className="w-5 h-5 mr-2 animate-pulse" />
                    <span className="text-sm font-medium">Openings</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {job.openings} positions
                  </p>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center text-green-400 mb-2">
                    <Calendar className="w-5 h-5 mr-2 animate-pulse" />
                    <span className="text-sm font-medium">Deadline</span>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {formatDate(new Date(job.deadline))}
                  </p>
                </div>
              </div>

              {/* Required Powers */}
              <div>
                <div className="flex items-center text-green-400 mb-4">
                  <Zap className="w-5 h-5 mr-2 animate-pulse" />
                  <span className="font-bold text-lg">Required Powers</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.requiredPowers.map((power, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-900/30 text-green-300 rounded-full text-sm font-medium border border-green-500/30 hover:bg-green-900/50 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {power}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-gray-800/40 backdrop-blur-lg border border-green-500/20 rounded-2xl p-6 shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center">
                Your Application
              </h3>

              {/* Resume Text Area */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Mission Resume{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Explain why you're the perfect candidate for this mission. Detail your relevant experience, powers, and what makes you suitable for this role in Doom's army..."
                  className="w-full h-32 sm:h-40 px-4 py-3 bg-gray-700/50 border border-green-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/70 transition-all duration-300 hover:bg-gray-700/70 hover:border-green-500/50 resize-none"
                  rows="6"
                  name="resumeText"
                />
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    {resumeText.length} characters
                  </p>
                  <div className="text-sm text-gray-500">
                    {resumeText.length > 500 ? "✓" : ""}{" "}
                    {resumeText.length > 500
                      ? "Good length"
                      : "Consider adding more detail"}
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Upload Resume File{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>

                {!uploadedFile ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                      isDragOver
                        ? "border-green-400 bg-green-900/20 scale-105"
                        : "border-green-500/30 hover:border-green-500/50 hover:bg-gray-700/20"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      name="resume"
                    />
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Upload className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <ChevronUp
                            className="w-6 h-6 text-green-400 animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <ChevronDown
                            className="w-6 h-6 text-green-400 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2 text-lg font-medium">
                        Drop your resume here or click to upload
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-green-500/30 rounded-xl p-4 bg-gray-700/20 hover:bg-gray-700/30 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-green-400 mr-3 animate-pulse" />
                        <div>
                          <p className="text-white font-medium">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={downloadFile}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Application to Doom"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default JobApplication;
