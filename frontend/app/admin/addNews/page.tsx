'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiUpload, FiX, FiSave, FiImage, FiType, FiAlignLeft, FiTag } from 'react-icons/fi';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const NewsCreationPage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'News',
    tournament: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  // Fetch tournaments for dropdown
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tournament/getTournaments`);
        console.log(response.data)
        setTournaments(response.data.tournaments);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: { preventDefault: () => void; dataTransfer: { files: any[]; }; }) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleFileChange = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setFormData(prev => ({ ...prev, image: file }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      if (formData.tournament) {
        formDataToSend.append('tournament', formData.tournament);
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      console.log("formdta", formData)
      const response = await axios.post(`${BASE_URL}/newsAndBlogs/createNewsAndBlog`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("res" , response)
    //   router.push('/news');
    } catch (error) {
      console.error('Error creating news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter article title"
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
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg"
                      />
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
                      <p className="text-sm text-gray-600">
                        Drag and drop an image here, or click to select
                      </p>
                      <p className="text-xs text-gray-500">
                        Recommended size: 1200x630 pixels
                      </p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Related Tournament (Optional)
                  </label>
                  <select
                    name="tournament"
                    value={formData.tournament}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a tournament</option>
                    {tournaments.map(tournament => (
                      <option key={tournament._id} value={tournament._id}>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <FiSave className="mr-2" />
                  {isSubmitting ? 'Publishing...' : 'Publish Article'}
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