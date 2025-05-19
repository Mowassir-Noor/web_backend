// import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";






// export const uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'No file uploaded' });
//     }

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET);

//     console.log("full req.file ", req.file);
//     const resumeUrl =  req.file.path; // Cloudinary URL

//     // Update the user's resumeUrl in the database
//     console.log(resumeUrl)
//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.userId,
//       { resumeUrl },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Resume uploaded and user profile updated",
//       resumeUrl,
//     });
//   } catch (err) {
//       console.error("Upload Resume Error:", err);

//   return res.status(500).json({
//     success: false,
//     message: err.message || 'Internal server error',
//     error: typeof err === 'object' ? JSON.stringify(err) : err,
//   })
// }};
export const uploadResume = async (req, res) => {
  try {
    console.log("req.file", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete old resume if it exists
    if (user.resumeUrl) {
      try {
        await deleteFromCloudinary(user.resumeUrl);
        console.log("Old resume deleted from Cloudinary");
      } catch (deleteErr) {
        console.warn("Failed to delete previous resume:", deleteErr.message);
      }
    }

    // Save new resume URL
    const resumeUrl = req.file.path;
    user.resumeUrl = resumeUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and user profile updated",
      resumeUrl,
    });

  } catch (err) {
    console.error("Upload Resume Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      error: typeof err === 'object' ? JSON.stringify(err) : err,
    });
  }
};