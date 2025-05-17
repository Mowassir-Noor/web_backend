import mongoose from "mongoose";



const recommendationSchema = new mongoose.Schema({
    recommender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recommendedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;