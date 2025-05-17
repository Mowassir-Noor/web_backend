import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({  
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  company: String,
  startDate: Date,
  endDate: Date,
  description: String,
});
const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;