import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotify } from "../../features/notifySlice";
import { apiClient } from "../../lib/apiClient";
import { JOB_POSTING } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const experienceLevels = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
];

export default function JobPosting({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredPowers: [""],
    experienceLevel: "",
    location: "",
    deadline: "",
    openings: "",
    visibility: true,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePowerChange = (idx, value) => {
    setForm((prev) => ({
      ...prev,
      requiredPowers: prev.requiredPowers.map((p, i) =>
        i === idx ? value : p
      ),
    }));
  };

  const addPower = () => {
    setForm((prev) => ({
      ...prev,
      requiredPowers: [...prev.requiredPowers, ""],
    }));
  };

  const removePower = (idx) => {
    setForm((prev) => ({
      ...prev,
      requiredPowers: prev.requiredPowers.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.deadline ||
      !form.openings ||
      !form.experienceLevel ||
      form.requiredPowers.some((p) => !p.trim())
    ) {
      dispatch(
        setNotify({ message: "All the fields are required", type: "info" })
      );
      return;
    } else if(new Date(form.deadline) < new Date()){
      dispatch(
        setNotify({ message: "Deadline must be in the future", type: "info" })
      );
      return;
    }

    try {
      const response = await apiClient.post(
        JOB_POSTING,
        { form },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/admin/view-all-jobs");
        dispatch(
          setNotify({ message: `${form.title} Job posted!`, type: "success" })
        );
      }
    } catch (err) {
      console.error("error in job posting : ", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 rounded-xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent mb-4">
            CREATE OPPORTUNITY
          </h1>
          <p className="text-gray-300 text-xl">
            Summon the finest warriors to BattleWorld
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Form Container */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Mission Title<span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg placeholder-slate-400 transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500"
                  placeholder="Enter mission title..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Mission Brief<span className="text-red-400 ml-1">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg placeholder-slate-400 transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500 resize-none"
                  placeholder="Describe the mission objectives and requirements..."
                  required
                />
              </div>

              {/* Required Powers */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Required Powers<span className="text-red-400 ml-1">*</span>
                </label>
                <div className="space-y-3">
                  {form.requiredPowers.map((power, idx) => (
                    <div key={idx} className="flex gap-3">
                      <input
                        type="text"
                        value={power}
                        onChange={(e) => handlePowerChange(idx, e.target.value)}
                        className="flex-1 bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-3 text-white font-medium placeholder-slate-400 transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500"
                        placeholder="Enter required power..."
                        required
                      />
                      {form.requiredPowers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePower(idx)}
                          className="w-12 h-12 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-red-500/30"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPower}
                    className="w-full py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-300 rounded-xl transition-all duration-300 hover:scale-105 border border-green-500/30 hover:border-green-400/50 flex items-center justify-center gap-2 font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Power
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Experience Level - Fixed dropdown z-index */}
              <div className="relative z-50">
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Experience Level<span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg transition-all duration-300 hover:border-slate-500 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none flex justify-between items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span
                      className={
                        form.experienceLevel ? "text-white" : "text-slate-400"
                      }
                    >
                      {form.experienceLevel || "Select experience level"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-[100] mt-2 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-600 shadow-2xl">
                      {experienceLevels.map((lvl) => (
                        <button
                          type="button"
                          key={lvl.value}
                          className="w-full px-6 py-4 text-left text-white font-medium transition-all duration-300 hover:bg-green-500/20 hover:text-green-300 border-b border-slate-600 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => {
                            handleChange("experienceLevel", lvl.value);
                            setDropdownOpen(false);
                          }}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Location<span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg placeholder-slate-400 transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500"
                  placeholder="Enter battleground location..."
                  required
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Mission Deadline<span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500"
                  required
                />
              </div>

              {/* Openings */}
              <div>
                <label className="block mb-3 text-green-300 font-semibold text-lg">
                  Available Positions
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.openings}
                  onChange={(e) => handleChange("openings", e.target.value)}
                  className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-xl px-6 py-4 text-white font-medium text-lg placeholder-slate-400 transition-all duration-300 focus:border-green-400 focus:bg-slate-900/90 focus:shadow-lg focus:shadow-green-400/20 focus:outline-none hover:border-slate-500"
                  placeholder="Number of positions..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 text-xl"
            >
              DEPLOY MISSION
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
