import mongoose from 'mongoose';

const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  tournamentId: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number }, // in seconds
  uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // ← change from true to false for now
  },
  
}, { timestamps: true });

// Prevent re-compilation in development (important for Next.js)
export default mongoose.models.Video || mongoose.model('Video', VideoSchema);