import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getJobById, getJobByRecruiterId, updateJob } from "../controller/job.controller.js";
import { searchJobs } from "../controller/search.controller.js";

const jobRouter = Router();

// GET     /api/jobs/              → Get all job listings
// GET     /api/jobs/:id           → Get a specific job
// POST    /api/jobs/              → Post a new job (recruiter only)
// PUT     /api/jobs/:id           → Edit a job
// DELETE  /api/jobs/:id           → Delete a job

jobRouter.get("/jobs/search",searchJobs) 
jobRouter.get("/jobs", getAllJobs);
jobRouter.get("/jobs/recruiter/:id",getJobByRecruiterId);

jobRouter.get("/jobs/:id", getJobById);

jobRouter.post("/jobs", createJob);

jobRouter.put("/jobs/:id",updateJob); 

jobRouter.delete("/jobs/:id", deleteJob);


export default jobRouter;