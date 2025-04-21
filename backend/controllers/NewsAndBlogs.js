import NewsAndBlogs from "../models/NewsAndBlogs.js";
import Video from '../models/video.js'
import mongoose from 'mongoose';
import { uploadToCloudinary, generateThumbnail } from '../utils/imageUploader.js';


export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params; // Correctly extract ID from URL params

    const videos = await Video.find({ matchId: id })
      .populate('tournamentId', 'name')
      .populate('matchId', 'teams date')
      .populate('uploader', 'name');

    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch videos' 
    });
  }
};

// ✅ Create a news/blog
export const createNewsOrBlog = async (req, res) => {
  try {
    const { title, content, category, tournament, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and author are required.",
      });
    }

    let imageUrl = null;

    // If image is uploaded, multer-storage-cloudinary adds cloudinary data to req.file
    if (req.file) {
      imageUrl = req.file.path; // or req.file.secure_url (you can log req.file to check what it contains)
    }

    const newPost = new NewsAndBlogs({
      title,
      content,
      category,
      tournament,
      author,
      image: imageUrl,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "News/Blog created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating news/blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

//Upload video
// import { generateThumbnail } from '../utils/imageUploader.js'; // keep this import

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    console.log("File info from multer-storage-cloudinary:", req.file);

    // Use req.file.path and public_id directly from multer-cloudinary result
    const { path: videoUrl, filename: publicId } = req.file;

    const thumbnailUrl = generateThumbnail(publicId);

    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      tournamentId: new mongoose.Types.ObjectId(req.body.tournamentId),
      matchId: new mongoose.Types.ObjectId(req.body.matchId),
      videoUrl,
      thumbnailUrl,
      uploader: req.user?._id || null, // fallback if no user
    });

    await video.save();

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload video' 
    });
  }
};


export const getVideosByMatch = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('tournamentId', 'name')
      .populate('matchId', 'teams date')
      .populate('uploader', 'name');

    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch videos' 
    });
  }
};

// ✅ Get all news/blogs
export const getAllNewsAndBlogs = async (req, res) => {
  try {
    const posts = await NewsAndBlogs.find().populate("author", "name").populate("tournament", "name");
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// ✅ Get a single news/blog by ID
export const getNewsOrBlogById = async (req, res) => {
  try {
    const post = await NewsAndBlog.findById(req.params.id).populate("author", "name").populate("tournament", "name");
    if (!post) {
      return res.status(404).json({ success: false, message: "News/Blog not found." });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// ✅ Update a news/blog by ID
export const updateNewsOrBlog = async (req, res) => {
  try {
    const updatedPost = await NewsAndBlog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "News/Blog not found." });
    }
    res.status(200).json({ success: true, message: "News/Blog updated successfully.", data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// ✅ Delete a news/blog by ID
export const deleteNewsOrBlog = async (req, res) => {
  try {
    const deletedPost = await NewsAndBlog.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: "News/Blog not found." });
    }
    res.status(200).json({ success: true, message: "News/Blog deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};