import jwt from "jsonwebtoken";
import Application from "../models/application.model.js";
import User from "../models/user.model.js";
import {JWT_SECRET } from "../config/env.js"
import mongoose from "mongoose";

export const createApplication = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const applicantId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(applicantId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    if (userRole !== "job_seeker") {
      return res.status(403).json({ message: "Only applicants can apply" });
    }
    const resumeUrl=user.resumeUrl;
    // console.log(resumeUrl);

    const { jobId, coverLetter } = req.body;
    if (!jobId || !resumeUrl) {
      return res.status(400).json({ message: "Job ID and resume URL are required" });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existing) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: applicantId,
      resumeUrl,
      coverLetter,
      status: "applied",
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// READ ALL
export const getApplications = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    let applications;
    if (userRole === "job_seeker") {
      applications = await Application.find({ applicant: userId }).populate("job applicant");
    } else if (userRole === "recruiter") {
      applications = await Application.find().populate("job applicant");
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// READ ONE
export const getApplicationById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    const application = await Application.findById(req.params.id).populate("job applicant");
    if (!application) return res.status(404).json({ message: "Not found" });

    if (
      (userRole === "job_seeker" && application.applicant.toString() !== userId) ||
      (userRole !== "job_seeker" && userRole !== "recruiter")
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE (only applicant can update their own application)
export const updateApplication = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    if (userRole !== "job_seeker" || application.applicant.toString() !== userId) {
      return res.status(403).json({ message: "Only the applicant can update their application" });
    }

    // Only allow updating resumeUrl and coverLetter
    application.resumeUrl = req.body.resumeUrl || application.resumeUrl;
    application.coverLetter = req.body.coverLetter || application.coverLetter;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE (only applicant can delete their own application)
export const deleteApplication = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });

    if (userRole !== "job_seeker" || application.applicant.toString() !== userId) {
      return res.status(403).json({ message: "Only the applicant can delete their application" });
    }

    await application.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicationsByJobId = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    const { jobId } = req.params;

    let applications;
    if (userRole === "recruiter") {
      // Recruiter: see all applications for the job
      applications = await Application.find({ job: jobId }).populate("job applicant");
    } else if (userRole === "job_seeker") {
      // Job seeker: see only their own applications for the job
      applications = await Application.find({ job: jobId, applicant: userId }).populate("job applicant");
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications by job ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all applications by a job seeker (user)
// export const getApplicationsByUserId = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const requesterId = decoded.userId;
//     console.log("requesterId :", requesterId);
//     // Fetch user and role
//     const user = await User.findById(requesterId);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const userRole = user.role;

//     const  userId  = req.params.id;
//     // const userId=requesterId;
//     console.log("user erro :" ,userId);

//     // Only allow the user themselves or a recruiter/admin to view
//     if (userRole !== "recruiter" && userRole !== "admin" ) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     const applications = await Application.find({ applicant: userId }).populate("job applicant");
//     res.json(applications);
//   } catch (error) {
//     console.error("Error fetching applications by user ID:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getApplicationsByUserId = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const requesterId = decoded.userId;

    const user = await User.findById(requesterId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userRole = user.role;
    const userId = req.params.id; // <- Make sure your route uses :userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userRole !== "recruiter" && userRole !== "admin" && requesterId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ applicant: userId }).populate("job applicant");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications by user ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Recruiter updates application status
export const recruiterUpdateApplicationStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const recruiterId = decoded.userId;

    // Fetch user and role
    const user = await User.findById(recruiterId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const userRole = user.role;

    if (userRole !== "recruiter" && userRole !== "admin") {
      return res.status(403).json({ message: "Only recruiters can update application status" });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["applied", "reviewed", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};