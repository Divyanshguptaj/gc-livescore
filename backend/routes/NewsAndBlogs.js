import express from "express";
import { upload } from '../middlewares/upload.js';
const router = express.Router();

import{
  createNewsOrBlog,
  getAllNewsAndBlogs,
  getNewsOrBlogById,
  updateNewsOrBlog,
  deleteNewsOrBlog,
} from "../controllers/NewsAndBlogs.js";

router.post("/createNewsAndBlog", upload.single('image'), createNewsOrBlog);
router.get("/getAllNewsAndBlogs", getAllNewsAndBlogs);
router.get("/:id", getNewsOrBlogById);
router.put("/:id", updateNewsOrBlog);
router.delete("/:id", deleteNewsOrBlog);

export default router;
