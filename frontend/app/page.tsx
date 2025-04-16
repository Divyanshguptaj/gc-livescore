'use client';
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import cricketData from '../assets/data.json'
const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const {matches, upcomingMatches, News, stats} = cricketData;
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -200]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax'));
        el.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden" ref={containerRef}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#1e40af]/10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0.1
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 1}px`,
              height: `${Math.random() * 5 + 1}px`
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
              transition: {
                duration: Math.random() * 10 + 5,
                repeat: Infinity
              }
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1e3a8a]/30 via-[#0a0a0a] to-[#1e3a8a]/30 pointer-events-none" />

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-[#1e3a8a]/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 15 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              CricPulse
            </motion.h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Live', 'Upcoming', 'News', 'Stats', 'Highlights'].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-[#e5e7eb] hover:text-[#3b82f6] text-sm font-medium uppercase tracking-wider relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3b82f6] group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </nav>
          
          <motion.button
            className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#3b82f6]/30 hover:shadow-[#3b82f6]/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Get App
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity, scale, y }}
        >
          <div 
            className="w-full h-full bg-[url('/cricket-stadium-night.webp')] bg-cover bg-center"
            data-parallax="0.2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#93c5fd] to-[#bfdbfe] bg-clip-text text-transparent">
                Experience Cricket
              </span> <br />
              <span className="text-white">Like Never Before</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-[#e5e7eb] mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Real-time scores, immersive stats, and breaking news from every corner of the cricketing world.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.button
                className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-[#3b82f6]/30 hover:shadow-[#3b82f6]/50 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Live Matches
              </motion.button>
              <motion.button
                className="bg-transparent border-2 border-[#3b82f6] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#3b82f6]/10 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upcoming Fixtures
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Animated Cricket Ball */}
          <motion.img
            src="/ball.png"
            alt="Cricket Ball"
            className="absolute top-1/2 left-1/4 w-16 h-16 z-0"
            animate={{
              x: [0, 100, 200, 300, 400],
              y: [0, -100, 0, 50, 0],
              rotate: 720,
              transition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          
          {/* Floating Players */}
          <motion.div 
            className="absolute bottom-20 left-10 z-10"
            animate={{
              y: [0, -20, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <img src="/images/Batsman.png" alt="Batsman" className="h-[200] opacity-80" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-20 right-10 z-10"
            animate={{
              y: [0, 20, 0],
              transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <img src="/images/Bowler.png" alt="Bowler" className="h-[200] opacity-80" />
          </motion.div>
        </div>
        
        {/* Scrolling Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center"
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <p className="text-sm mb-2">Scroll Down</p>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Live Matches Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#111827]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div>
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 flex items-center gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Live Matches
              </motion.h2>
              <motion.p 
                className="text-[#9ca3af] max-w-xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Follow every ball with our real-time coverage and advanced match analytics
              </motion.p>
            </div>
            <motion.a
              href="#"
              className="text-[#3b82f6] hover:text-[#93c5fd] font-medium flex items-center gap-1 mt-4 md:mt-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              View All Matches
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {matches.map((match, index) => (
              <motion.div
                key={index}
                className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#3b82f6]/20 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="p-6 border-b border-[#1f2937]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#9ca3af] text-sm">{match.series}</span>
                      <h3 className="text-xl font-bold mt-1">{match.teams}</h3>
                    </div>
                    <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-3xl font-bold text-[#3b82f6]">{match.score}</p>
                      <p className="text-[#9ca3af] mt-1">{match.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#9ca3af]">Overs</p>
                      <p className="text-xl font-bold">{match.overs}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-[#9ca3af] mb-1">
                      <span>Match Progress</span>
                      <span>{match.progress}%</span>
                    </div>
                    <div className="w-full bg-[#1f2937] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] h-2 rounded-full" 
                        style={{ width: `${match.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1f2937] px-6 py-4 flex justify-between">
                  <button className="text-[#3b82f6] hover:text-[#93c5fd] text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Match Center
                  </button>
                  <button className="text-white hover:text-[#93c5fd] text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Highlights
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-10 opacity-20"
          animate={{
            rotate: [0, 360],
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#111827]">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-[#1f2937] border border-[#374151] rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold text-[#3b82f6]">{stat.value}</p>
                <p className="text-[#9ca3af] mt-1">{stat.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#111827] to-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div>
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Upcoming Fixtures
              </motion.h2>
              <motion.p 
                className="text-[#9ca3af] max-w-xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Never miss a match with our comprehensive schedule and reminders
              </motion.p>
            </div>
            <motion.a
              href="#"
              className="text-[#3b82f6] hover:text-[#93c5fd] font-medium flex items-center gap-1 mt-4 md:mt-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              View Full Schedule
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingMatches.map((match, index) => (
              <motion.div
                key={index}
                className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden shadow-xl hover:shadow-[#3b82f6]/10 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1e40af]/20 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{match.teams}</h3>
                      <p className="text-[#3b82f6] mt-1">{match.time}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[#1f2937]">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-[#9ca3af]">Venue</p>
                        <p className="font-medium">{match.venue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#9ca3af]">Tournament</p>
                        <p className="font-medium">{match.tournament}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#1f2937] px-6 py-4 flex justify-between">
                  <button className="text-[#3b82f6] hover:text-[#93c5fd] text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Set Reminder
                  </button>
                  <button className="text-white hover:text-[#93c5fd] text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Previous Encounters
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="relative py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div>
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Latest News
              </motion.h2>
              <motion.p 
                className="text-[#9ca3af] max-w-xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Stay updated with breaking news, analysis and exclusive interviews
              </motion.p>
            </div>
            <motion.a
              href="#"
              className="text-[#3b82f6] hover:text-[#93c5fd] font-medium flex items-center gap-1 mt-4 md:mt-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              View All News
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
          
          <motion.div
            className="flex gap-8 overflow-x-auto pb-10 -mx-6 px-6"
            drag="x"
            dragConstraints={{ left: -1000, right: 100 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {News.map((news, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] md:min-w-[400px] bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden shadow-xl hover:shadow-[#3b82f6]/10 transition-all flex flex-col"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      news.category === "Match Report" ? "bg-[#3b82f6]/20 text-[#3b82f6]" :
                      news.category === "Breaking" ? "bg-red-500/20 text-red-500" :
                      "bg-amber-500/20 text-amber-500"
                    }`}>
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold line-clamp-2">{news.title}</h3>
                    <span className="text-xs text-[#9ca3af] whitespace-nowrap ml-2">{news.time}</span>
                  </div>
                  <p className="text-[#9ca3af] mb-6 line-clamp-2">{news.description}</p>
                  <div className="mt-auto">
                    <button className="text-[#3b82f6] hover:text-[#93c5fd] font-medium flex items-center gap-1 transition-colors">
                      Read Full Story
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* App CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/cricket-texture.png')] opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1e40af]/80 to-[#1e3a8a]/80" />
          
          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.1
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
                transition: {
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get the CricPulse App
            </motion.h2>
            
            <motion.p 
              className="text-xl text-[#bfdbfe] mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Download our app for live scores, push notifications, and personalized cricket updates.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="bg-white text-[#1e40af] px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-bold">Google Play</div>
                </div>
              </motion.button>
              
              <motion.button
                className="bg-black/20 border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-black/30 transition-all flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-bold">App Store</div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#111827] border-t border-[#1f2937]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent">
                  CricPulse
                </h3>
              </div>
              <p className="text-[#9ca3af] mb-6">
                The ultimate cricket companion for fans around the world.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="bg-[#1f2937] hover:bg-[#3b82f6] w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    whileHover={{ y: -3 }}
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={social === 'facebook' ? "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" : 
                        social === 'twitter' ? "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" : 
                        social === 'instagram' ? "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748 1.857.344.353.3.882.344 1.857.047 1.023.058 1.351.058 3.807v.468c0 2.456-.011 2.784-.058 3.807-.045.975-.207 1.504-.344 1.857-.182.466-.399.8-.748 1.15-.35.35-.683.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058h-.08c-2.597 0-2.917-.01-3.96-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857-.048-1.023-.058-1.351-.058-3.807v-.468c0-2.456.011-2.784.058-3.807.045-.975.207-1.504.344-1.857.182-.466.399-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.023-.048 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" : 
                        "M8.051 4.555c.033-.484.215-.865.457-1.134C8.87 3.148 9.26 3 9.67 3h4.66c.408 0 .798.148 1.104.421.243.27.425.65.456 1.134l.332 3.86c0 .779-.324 1.487-.887 1.948-.564.46-1.316.686-2.078.686H9.54c-.762 0-1.514-.226-2.078-.686-.563-.461-.887-1.17-.887-1.948l.332-3.86zm6.562 15.25c0 .408-.148.798-.421 1.104-.27.243-.65.425-1.134.456l-3.86.332c-.779 0-1.487-.324-1.948-.887-.46-.564-.686-1.316-.686-2.078v-4.66c0-.762.226-1.514.686-2.078.461-.563 1.17-.887 1.948-.887l3.86-.332c.484-.033.865-.215 1.134-.457.273-.306.421-.696.421-1.104v4.66c0 .408-.148.798-.421 1.104-.27.243-.65.425-1.134.456l-3.86.332c-.779 0-1.487.324-1.948.887-.46.564-.686 1.316-.686 2.078v4.66z"} clipRule="evenodd" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Live Scores', 'Upcoming Matches', 'News & Articles', 'Player Stats', 'Team Rankings'].map((link, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="text-[#9ca3af] hover:text-[#3b82f6] transition-colors">{link}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Tournaments</h4>
              <ul className="space-y-3">
                {['ICC World Cup', 'T20 World Cup', 'IPL', 'Ashes Series', 'World Test Championship'].map((tournament, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="text-[#9ca3af] hover:text-[#3b82f6] transition-colors">{tournament}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
              <p className="text-[#9ca3af] mb-4">
                Get the latest cricket updates delivered to your inbox
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-[#1f2937] border border-[#374151] text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] w-full"
                />
                <motion.button
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-r-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#1f2937] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#9ca3af] text-sm mb-4 md:mb-0">
              © 2025 CricPulse. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#9ca3af] hover:text-[#3b82f6] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#9ca3af] hover:text-[#3b82f6] text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-[#9ca3af] hover:text-[#3b82f6] text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;