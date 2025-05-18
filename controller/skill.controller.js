// import { Education } from '../models/education.model.js';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import Skill from '../models/skill.model.js';









export const addSkill = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.userId;

    const newSkill = await Skill.create([{ user: userId, name }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: newSkill[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


export const getSkills = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const skills = await Skill.find({ user: decoded.userId });

    return res.status(200).json({
      success: true,
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};



// patch for skill update
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body; // only fields to update, e.g. { name: "New Skill Name" }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const skill = await Skill.findOneAndDelete({ _id: id, user: decoded.userId });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
