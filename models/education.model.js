import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const Education = mongoose.model("Education", educationSchema);
export default Education;
