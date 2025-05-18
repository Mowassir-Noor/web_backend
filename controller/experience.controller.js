import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_SECRET } from "../config/env.js";
import Experience from "../models/experience.model.js";
// import User from "../models/user.model.js";














// Create Experience
export const addExperience = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, company, startDate, endDate, description } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const newExperience = await Experience.create(
      [
        {
          user: decoded.userId,
          title,
          company,
          startDate,
          endDate,
          description,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: "Experience added", data: newExperience[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Get all experiences (no transaction needed)
export const getExperiences = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const experiences = await Experience.find({ user: decoded.userId });

    res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    next(error);
  }
};

// Get experience by id (no transaction needed)
export const getExperienceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// Patch (partial update) experience
export const updateExperience = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const experience = await Experience.findById(id).session(session);
    if (!experience) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    if (experience.user.toString() !== decoded.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Unauthorized to update this experience" });
    }

    Object.assign(experience, updateData);
    await experience.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Experience updated", data: experience });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Delete experience
export const deleteExperience = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const experience = await Experience.findById(id).session(session);
    if (!experience) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    if (experience.user.toString() !== decoded.userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Unauthorized to delete this experience" });
    }

    await Experience.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Experience deleted" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};



// export const getExperienceByUserId = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token" });
//     }

//     const token = authHeader.split(" ")[1];
//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch (err) {
//       return res.status(401).json({ success: false, message: "Invalid or expired token" });
//     }

//     const experiences = await Experience.find({ user: decoded.userId });

//     return res.status(200).json({
//       success: true,
//       message: "User experiences fetched successfully",
//       data: experiences,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const getExperienceByUserId = async (req, res) => {
  try {
    const { id } = req.params;  // user ID from URL param

    const experiences = await Experience.find({ user: id });

    if (!experiences.length) {
      return res.status(404).json({
        success: false,
        message: "No experiences found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experiences fetched successfully",
      data: experiences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};