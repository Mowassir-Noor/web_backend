import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
     recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  companyName: String,
  description: String,
  category: String, // e.g. IT, Marketing
  location: String,
  jobType: String, // e.g. full-time, part-time
  salaryRange: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});
const Job = mongoose.model("Job", jobSchema);
export default Job;