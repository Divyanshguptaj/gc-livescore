import express from "express";
const router = express.Router();
import{
  createNewsOrBlog,
  getAllNewsAndBlogs,
  getNewsOrBlogById,
  updateNewsOrBlog,
  deleteNewsOrBlog,
} from "../controllers/NewsAndBlogs.js";

router.post("/createNewsAndBlog", createNewsOrBlog);
router.get("/getAllNewsAndBlogs", getAllNewsAndBlogs);
router.get("/:id", getNewsOrBlogById);
router.put("/:id", updateNewsOrBlog);
router.delete("/:id", deleteNewsOrBlog);

export default router;
