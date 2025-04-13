'use client';
import React from "react";
import { motion } from "framer-motion";
// import { LampDemo } from "@/components/ui/Lamp"; // Add this at top

const matches = [
  {
    teams: "India vs Australia",
    score: "IND 250/3 (40.2)",
    status: "Live - 2nd ODI",
  },
  {
    teams: "England vs Pakistan",
    score: "ENG 178/7 (34.1)",
    status: "Live - 1st T20I",
  },
];

const upcomingMatches = [
  {
    teams: "Sri Lanka vs New Zealand",
    time: "Tomorrow - 3:30 PM IST",
  },
  {
    teams: "South Africa vs West Indies",
    time: "Sunday - 7:00 PM IST",
  },
];

const News = [
  {
    image: "/images/rohit-century.jpg",
    title: "Rohit Sharma Hits Century in Final",
    description: "Rohit smashed 120 off 90 balls leading India to a big win in the World Cup final.",
  },
  {
    image: "/images/babar-resigns.jpg",
    title: "Babar Azam Steps Down as Captain",
    description: "After the loss, Babar resigns from captaincy in all formats.",
  },
  {
    image: "/images/t20-worldcup.jpg",
    title: "T20 World Cup 2026 Venues Announced",
    description: "ICC reveals multiple host countries for the T20 World Cup 2026.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden relative">
      
      {/* News Ticker */}
      <div className="w-full bg-gradient-to-r from-green-600 to-yellow-500 py-2 overflow-hidden whitespace-nowrap relative">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="inline-block text-black font-semibold text-sm"
        >
          📰 Breaking News: Rohit hits century in final | Babar resigns after loss | T20 WC 2026 venues out! &nbsp;&nbsp;&nbsp;&nbsp;
        </motion.div>
      </div>

      {/* Parallax Hero Section with Ball Animation */}
      <section
        className="relative min-h-screen flex justify-center items-center bg-fixed bg-center bg-cover text-center px-6"
        style={{ backgroundImage: "url('/images/cricket-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        
        {/* Animated Cricket Ball */}
        <motion.img
          src="/images/ball.png"
          alt="Flying Ball"
          className="absolute top-20 left-[-100px] w-20 z-10"
          animate={{ x: ["-100px", "110%"], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-2xl"
        >
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-xl mb-4">
            Get Live Cricket Scores Instantly 🏏
          </h2>
          <p className="text-neutral-300 mb-6 text-lg">
            Ball-by-ball updates, blazing-fast match alerts, and more!
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-green-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-400 transition"
          >
            View Live Matches
          </motion.button>
        </motion.div>
      </section>

      {/* Live Matches */}
      <section className="px-6 py-12 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
        <h3 className="text-2xl font-semibold mb-6">🏏 Live Matches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={index}
              className="bg-neutral-800 p-6 rounded-lg shadow hover:shadow-xl hover:ring-2 ring-green-500 transition"
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="text-xl font-bold">{match.teams}</h4>
              <p className="text-green-400 mt-2 text-lg">{match.score}</p>
              <p className="text-neutral-400 mt-1">{match.status}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="px-6 py-12 bg-neutral-950">
        <h3 className="text-2xl font-semibold mb-6">📅 Upcoming Matches</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingMatches.map((match, index) => (
            <motion.div
              key={index}
              className="bg-neutral-900 p-5 rounded-lg shadow-lg hover:shadow-green-500/30 transition hover:scale-105"
            >
              <h4 className="text-lg font-bold text-white">{match.teams}</h4>
              <p className="text-neutral-400">{match.time}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest News with Carousel Animation */}
      <section className="px-6 py-12 bg-neutral-900">
        <h3 className="text-2xl font-semibold mb-6 text-white">📰 Latest News</h3>
        <motion.div
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          drag="x"
          dragConstraints={{ left: -500, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {News.map((news, index) => (
            <motion.div
              key={index}
              className="min-w-[300px] bg-neutral-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={news.image}
                alt={news.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-white mb-1">{news.title}</h4>
                <p className="text-sm text-neutral-400">{news.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-neutral-500 border-t border-neutral-800 text-sm">
        © 2025 CrickNow. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

