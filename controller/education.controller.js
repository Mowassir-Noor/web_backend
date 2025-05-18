import Education  from '../models/education.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';


export const addEducation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { institution, degree, fieldOfStudy, startDate, endDate, description } = req.body;

    // ✅ Extract and verify token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Check for duplicate education for the same user & institution
    const existingEducation = await Education.findOne({
      user: decoded.userId,
      institution,
    });

    if (existingEducation) {
      return res.status(409).json({ success: false, message: "Education already exists" });
    }

    const user = await User.findById(decoded.userId).session(session);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Create new education
    const [newEducation] = await Education.create(
      [
        {
          user: user._id,
          institution,
          degree,
          fieldOfStudy,
          startDate,
          endDate,
          description,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: newEducation,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    next(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });

  }
};



// export const getEducation = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const educationList = await Education.find({ user: decoded.userId });

//     return res.status(200).json({
//       success: true,
//       message: "Education entries fetched successfully",
//       data: educationList,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const getEducation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const educationList = await Education.find({ user: decoded.userId });

    return res.status(200).json({
      success: true,
      message: "Education entries fetched successfully",
      data: educationList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const education = await Education.findOne({ _id: id, user: decoded.userId });

    if (!education) {
      return res.status(404).json({ success: false, message: "Education entry not found" });
    }

    Object.assign(education, updates);
    await education.save();

    return res.status(200).json({
      success: true,
      message: "Education entry updated successfully",
      data: education,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const education = await Education.findOneAndDelete({ _id: id, user: decoded.userId });

    if (!education) {
      return res.status(404).json({ success: false, message: "Education entry not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Education entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
