import NewsAndBlog from "../models/NewsAndBlogs.js";

// ✅ Create a news/blog
export const createNewsOrBlog = async (req, res) => {
  try {
    const { title, content, author, category, tournament } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ success: false, message: "Title, content, and author are required." });
    }

    const newPost = new NewsAndBlog({ title, content, author, category, tournament });
    await newPost.save();

    res.status(201).json({ success: true, message: "News/Blog created successfully.", data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// ✅ Get all news/blogs
export const getAllNewsAndBlogs = async (req, res) => {
  try {
    const posts = await NewsAndBlog.find().populate("author", "name").populate("tournament", "name");
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