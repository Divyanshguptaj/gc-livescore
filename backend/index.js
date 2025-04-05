import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}));


// Connect to MongoDB
connectDB();

//  routes
const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/User");
const tournamentRoutes = require("./routes/TournamentAndMatch.js");
const newsAndBlogsRoutes = require("./routes/C.js");
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/newsAndBlogs", newsAndBlogsRoutes);
app.use("/tournament", tournamentRoutes);

app.get("/", (req, res) => {
  res.send("Cricket Live Score API is running...");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));