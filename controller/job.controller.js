import { JWT_SECRET } from "../config/env.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";



// export const getAllJobs = async (req, res, next) => {
//   try {
//     const jobs = await Job.find()
//       .populate("recruiter", "name email")
//       .populate("applications", "applicant status")
//       .sort({ createdAt: -1 });
//     return res.status(200).json({
//       success: true,
//       message: "Jobs fetched successfully",
//       data: jobs,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email"); // populate recruiter info (name & email)

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// export const getJobById = async (req, res, next) => {
//   try {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId)
//       .populate("recruiter", "name email")
//       .populate("applications", "applicant status");
//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Job fetched successfully",
//       data: job,
//     });
//   } catch (error) {
//     next(error);
//   }
// }


export const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};



export const createJob = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      title,
      companyName,
      description,
      category,
      location,
      jobType,
      salaryRange,
      expiresAt,
    } = req.body;

   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

   
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    console.log("Decoded Token:", decoded);
    const user = await User.findById(decoded.userId);
    
console.log("User from DB:", user);


    if (!user || user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can create jobs",
      });
      
    }

   
    const [newJob] = await Job.create(
      [
        {
          title,
          companyName,
          description,
          category,
          location,
          jobType,
          salaryRange,
          recruiter: user._id,
          expiresAt,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error); 
  }
};











export const updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Extract and verify token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Find user and job
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Only recruiters can update jobs" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the recruiter owns this job
    if (job.recruiter.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own jobs" });
    }

    // Update fields from req.body (only update fields sent)
    const updatableFields = ["title", "companyName", "description","category", "location", "jobType", "salaryRange", "expiresAt"];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteJob = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can delete jobs",
      });
    }

    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete jobs you created",
      });
    }

    await Job.findByIdAndDelete(jobId, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, message: "Job deleted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
