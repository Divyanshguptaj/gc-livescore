'use client';
import {toast} from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  FiUpload,
  FiX,
  FiSave,
  FiImage,
  FiType,
  FiAlignLeft,
  FiTag,
} from 'react-icons/fi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

type Tournament = {
  _id: string;
  name: string;
};

const NewsCreationPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: string;
    tournament: string;
    image: File | null;
    author: string;  // Added field for author
  }>({
    title: '',
    content: '',
    category: 'News',
    tournament: '',
    image: null,
    author: '',  // Initialize author field
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isClient, setIsClient] = useState(false); // To avoid hydration mismatch

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tournament/getTournaments`);
        setTournaments(response.data.tournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
      setFormData((prev) => ({ ...prev, image: file }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // This acts as your isLoading state too
  
    try {
        setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('author', formData.author);
  
      if (formData.tournament) {
        formDataToSend.append('tournament', formData.tournament);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
  
      const response = await axios.post(
        `${BASE_URL}/newsAndBlogs/createNewsAndBlog`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('res', response);
  
      // ✅ Show success toast
      toast.success('News/Blog created successfully!');
  
      // Optionally reset the form
      setFormData({
        title: '',
        content: '',
        category: '',
        author: '',
        tournament: '',
        image: null,
      });
    } catch (error: any) {
      console.error('Error creating news:', error);
  
      // ❌ Show error toast
      toast.error(error.response?.data?.message || 'Failed to create news/blog.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };
  

  if(loading) return <LoadingSpinner/>
  if (!isClient) return null; // SSR mismatch workaround

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Article</h1>

            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiType className="mr-2 text-blue-500" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter article title"
                  required
                />
              </div>

              {/* Author Field */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiType className="mr-2 text-blue-500" />
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author's name"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiImage className="mr-2 text-blue-500" />
                  Featured Image
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="text-gray-700 hidden"
                  />

                  {previewImage ? (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">Drag and drop an image here, or click to select</p>
                      <p className="text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Field */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiAlignLeft className="mr-2 text-blue-500" />
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                  placeholder="Write your article content here..."
                  required
                />
              </div>

              {/* Category and Tournament */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiTag className="mr-2 text-blue-500" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="News">News</option>
                    <option value="Blog">Blog</option>
                    <option value="Match Report">Match Report</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Analysis">Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiTag className="mr-2 text-blue-500" />
                    Tournament
                  </label>
                  <select
                    name="tournament"
                    value={formData.tournament}
                    onChange={handleChange}
                    className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Tournament</option>
                    {tournaments.map((tournament) => (
                      <option key={tournament._id} value={tournament._id}>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCreationPage;
