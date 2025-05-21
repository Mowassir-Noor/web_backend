import { Router } from 'express';
import {
  createApplication,
  getApplicationById,
  getApplicationsByJobId,
  getApplications,
  updateApplication,
  deleteApplication, getApplicationsByUserId, recruiterUpdateApplicationStatus
} from '../controller/application.controller.js';

const applicationRouter = Router();

// GET     /api/applications/           → Get all applications (admin/recruiter)
// GET     /api/applications/:id        → Get a single application by ID
// GET     /api/applications/job/:jobId → Get all applications for a job
// POST    /api/applications/           → Apply to a job
// PUT     /api/applications/:id        → Update application
// DELETE  /api/applications/:id        → Delete application

applicationRouter.post("/applications", createApplication);
applicationRouter.get("/applications", getApplications);
applicationRouter.get("/applications/:id", getApplicationById);
applicationRouter.get("/applications/job/:jobId", getApplicationsByJobId);
applicationRouter.put("/applications/:id", updateApplication);
applicationRouter.delete("/applications/:id", deleteApplication);


// Add this line:
applicationRouter.get("/applications/user/:id", getApplicationsByUserId);

applicationRouter.patch("/applications/:id/status", recruiterUpdateApplicationStatus);

export default applicationRouter;