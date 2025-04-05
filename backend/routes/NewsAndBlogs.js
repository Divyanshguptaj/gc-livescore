const express = require("express");
const router = express.Router();
const {
  createNewsOrBlog,
  getAllNewsAndBlogs,
  getNewsOrBlogById,
  updateNewsOrBlog,
  deleteNewsOrBlog,
} = require("../controllers/NewsAndBlogs");

router.post("/createNewsAndBlog", createNewsOrBlog);
router.get("/getAllNewsAndBlogs", getAllNewsAndBlogs);
router.get("/:id", getNewsOrBlogById);
router.put("/:id", updateNewsOrBlog);
router.delete("/:id", deleteNewsOrBlog);

module.exports = router;
