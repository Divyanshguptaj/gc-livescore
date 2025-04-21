import express from "express";
import { upload } from '../middlewares/upload.js';
const router = express.Router();

import{
  createNewsOrBlog,
  getAllNewsAndBlogs,
  getNewsOrBlogById,
  updateNewsOrBlog,
  deleteNewsOrBlog,
  uploadVideo,
  getVideosByMatch,
  getVideoById,
} from "../controllers/NewsAndBlogs.js";

router.post("/createNewsAndBlog", upload.single('image'), createNewsOrBlog);
router.get("/getAllNewsAndBlogs", getAllNewsAndBlogs);
router.get("/getNewsOrBlogById/:id", getNewsOrBlogById);
router.put("/:id", updateNewsOrBlog);
router.delete("/:id", deleteNewsOrBlog);
router.post("/uploadVideo", upload.single('video'), uploadVideo);
router.get('/getVideos', getVideosByMatch);
router.get('/getVideoById/:id', getVideoById);

export default router;
