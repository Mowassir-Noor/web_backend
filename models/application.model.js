import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
     job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resumeUrl: String,
  coverLetter: String,
  status: {
    type: String,
    enum: ["applied", "reviewed", "rejected", "accepted"],
    default: "applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;