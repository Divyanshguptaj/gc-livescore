import React from "react";

const CricketProfile = ({ user }) => {
  const defaultUser = {
    name: "Guest User",
    email: "abc@gmail.com",
    playingType: "All Rounder",
    totalRunsScored: 0,
    totalWicketsTaken: 0,
    matchesPlayed: [],
    profile: {
      profileImage: "/default-avatar.png",
      gender: "Not specified",
      contactNumber: "N/A",
      bio: "This is a passionate cricketer.",
    },
  };

  const finalUser = user || defaultUser;
  const {
    name,
    email,
    playingType,
    totalRunsScored,
    totalWicketsTaken,
    matchesPlayed,
    profile,
  } = finalUser;
  const { profileImage, gender, contactNumber, bio } = profile;

  return (
    <div className="h-[90%] bg-white text-black py-10 px-4 font-sans flex justify-center items-center">
      <div className="w-auto h-[60%] mx-auto bg-white text-black rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* Left Profile Card */}
        <div className="bg-black text-white p-6 flex flex-col items-center justify-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white mb-4"
          />
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-300">{email}</p>
          <p className="mt-2 text-sm">{contactNumber}</p>
          <p className="text-sm italic mt-4 text-gray-400 text-center">{bio}</p>
        </div>

        {/* Middle Info Block */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-300 flex flex-col gap-4 bg-gray-100">
          <div>
            <h3 className="text-sm text-gray-600">Playing Role</h3>
            <p className="font-semibold text-lg">{playingType}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Gender</h3>
            <p className="font-semibold">{gender}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-600">Matches Played</h3>
            <p className="font-semibold">{matchesPlayed.length}</p>
          </div>
        </div>

        {/* Right Stats Block */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-300 flex flex-col gap-4 justify-center bg-gray-100">
          <div className="flex justify-between items-center">
            <h4 className="text-gray-600 text-sm">Total Runs</h4>
            <span className="text-lg font-bold text-green-600">{totalRunsScored}</span>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="text-gray-600 text-sm">Total Wickets</h4>
            <span className="text-lg font-bold text-blue-600">{totalWicketsTaken}</span>
          </div>
          <button className="mt-6 self-end bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CricketProfile;
