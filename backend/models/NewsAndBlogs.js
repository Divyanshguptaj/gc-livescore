const mongoose = require("mongoose");

const NewsAndBlogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL of the image
      default: null, // Optional
    },
    category: {
      type: String,
      enum: ["News", "Blog", "Match Report", "Opinion", "Analysis"],
      default: "News",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user/admin who posted this
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      default: null, // If the news is related to a tournament
    },
    // likes: {
    //   type: Number,
    //   default: 0, // Number of likes
    // },
    // comments: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     text: { type: String, required: true },
    //     createdAt: { type: Date, default: Date.now },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsAndBlogs", NewsAndBlogsSchema);
