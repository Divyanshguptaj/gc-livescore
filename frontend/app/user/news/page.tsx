"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
  tournament?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDetailView, setIsDetailView] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/newsAndBlogs/getAllNewsAndBlogs`
        );
        console.log(response.data);
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "News",
    "Blog",
    "Match Report",
    "Opinion",
    "Analysis",
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (isDetailView && selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => setIsDetailView(false)}
            className="flex items-center text-blue-600 mb-6"
            whileHover={{ x: -4 }}
          >
            <FiArrowLeft className="mr-2" />
            Back to News
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-64 sm:h-80 object-cover"
            />

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="flex items-center text-sm text-gray-600">
                  <FiTag className="mr-1 text-blue-500" />
                  {selectedNews.category}
                </span>
                {selectedNews.tournament && (
                  <span className="flex items-center text-sm text-gray-600">
                    <FiTag className="mr-1 text-blue-500" />
                    {selectedNews.tournament.name}
                  </span>
                )}
                <span className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-1 text-blue-500" />
                  {formatDate(selectedNews.createdAt)}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <FiUser className="mr-1 text-blue-500" />
                  {selectedNews.author}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedNews.title}
              </h1>

              <div className="prose max-w-none text-gray-700">
                {selectedNews.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Latest Cricket News
          </h1>
          <p className="text-gray-600">
            Stay updated with all the cricket happenings around the world
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search news..."
              className="text-gray-600 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="text-gray-700 block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No news articles found matching your criteria
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredNews.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedNews(item);
                    setIsDetailView(true);
                  }}
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                      {item.tournament && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.tournament.name}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(item.createdAt)}</span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" />
                        {item.author}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
