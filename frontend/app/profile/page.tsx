"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiSave,
  FiUpload,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAward,
  FiUsers,
  FiActivity,
} from "react-icons/fi";
import { MdSportsCricket } from "react-icons/md";
import { FaSpinner, FaTshirt } from "react-icons/fa";
import { GiCricketBat, GiGoalKeeper } from "react-icons/gi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Profile {
  _id: string;
  gender?: string;
  profileImage?: string;
  bio?: string;
  contactNumber?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playingType?: string;
  totalRunsScored: number;
  totalWicketsTaken: number;
  profile?: Profile;
  teams: any[];
  matchesPlayed: any[];
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User & Profile>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token") || "null");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/getProfile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setFormData({
          ...response.data,
          ...response.data.user,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();

      // Append user fields
      if (formData.name) formDataToSend.append("name", formData.name);
      if (formData.playingType)
        formDataToSend.append("playingType", formData.playingType);

      // Append profile fields
      if (formData.bio) formDataToSend.append("bio", formData.bio);
      if (formData.contactNumber)
        formDataToSend.append("contactNumber", formData.contactNumber);
      if (formData.gender) formDataToSend.append("gender", formData.gender);

      // Append image if changed
      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append("profileImage", fileInputRef.current.files[0]);
      }
      console.log("divyasnh")
      const response = await axios.put(
        `${BASE_URL}/user/updateProfile`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setFormData({
        ...response.data,
        ...response.data.user,
      });
      setPreviewImage(null);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const playingTypeOptions = [
    {
      value: "Batsman",
      label: "Batsman",
      icon: <GiCricketBat className="mr-2" />,
    },
    {
      value: "Bowler",
      label: "Bowler",
      icon: <MdSportsCricket className="mr-2" />,
    },
    {
      value: "All-Rounder",
      label: "All-Rounder",
      icon: <FiActivity className="mr-2" />,
    },
    {
      value: "WicketKeeper",
      label: "Wicket Keeper",
      icon: <GiGoalKeeper className="mr-2" />,
    },
    {
      value: "WicketKeeperBatsman",
      label: "WK-Batsman",
      icon: (
        <>
          <GiGoalKeeper className="mr-2" />
          <GiCricketBat className="mr-2" />
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <img
                    src={
                      previewImage ||
                      user.profile?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=random&rounded=true`
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=random&rounded=true`;
                    }}
                  />
                  {editing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                    >
                      <FiUpload size={16} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                  )}
                </div>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="mt-2 text-2xl font-bold text-center border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                )}

                {user.role === "admin" && (
                  <span className="mt-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    Admin
                  </span>
                )}

                <div className="mt-4">
                  {editing ? (
                    <button
                      onClick={handleSubmit}
                      disabled={uploading}
                      className="flex items-center px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 transition-colors shadow-md"
                    >
                      {uploading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Profile
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
                    >
                      <FiEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <FiMail className="text-gray-500 mr-3" size={18} />
                  <p className="text-gray-700">{user.email}</p>
                </div>

                <div className="flex items-center">
                  <FiCalendar className="text-gray-500 mr-3" size={18} />
                  <p className="text-gray-700">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </div>

                {user.profile?.gender && (
                  <div className="flex items-center">
                    <FaTshirt className="text-gray-500 mr-3" size={18} />
                    <p className="text-gray-700 capitalize">
                      {user.profile.gender.toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Column - Cricket Stats */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden h-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <MdSportsCricket className="mr-2 text-blue-500" />
                Cricket Statistics
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Runs</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {user.totalRunsScored}
                      </p>
                    </div>
                    <GiCricketBat className="text-blue-400 text-3xl" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Wickets</p>
                      <p className="text-3xl font-bold text-green-600">
                        {user.totalWicketsTaken}
                      </p>
                    </div>
                    <MdSportsCricket className="text-green-400 text-3xl" />
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Playing Role
                  </label>
                  {editing ? (
                    <select
                      name="playingType"
                      value={formData.playingType || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select your role</option>
                      {playingTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center">
                      {playingTypeOptions.find(
                        (o) => o.value === user.playingType
                      )?.icon || <FiUser className="mr-2" />}
                      <p className="text-gray-700">
                        {user.playingType || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Teams</p>
                      <p className="text-xl font-bold text-purple-600">
                        {user.teams.length}
                      </p>
                    </div>
                    <FiUsers className="text-purple-400 text-3xl" />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Matches Played</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {user.matchesPlayed.length}
                      </p>
                    </div>
                    <FiActivity className="text-yellow-400 text-3xl" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Bio and Contact */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden h-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                About
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {user.profile?.bio || "No bio provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {user.profile?.contactNumber || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="text-gray-700 capitalize">
                      {user.profile?.gender?.toLowerCase() || "Not specified"}
                    </p>
                  )}
                </div>

                {user.teams.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teams
                    </label>
                    <div className="mt-1 space-y-2">
                      {user.teams.map((team) => (
                        <div
                          key={team._id}
                          className="flex items-center bg-gray-50 p-2 rounded"
                        >
                          <FiUsers className="text-gray-500 mr-2" />
                          <span className="text-gray-700">{team.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
