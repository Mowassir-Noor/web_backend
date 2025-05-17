import { Router } from "express";

const jobRouter = Router();

// GET     /api/jobs/              → Get all job listings
// GET     /api/jobs/:id           → Get a specific job
// POST    /api/jobs/              → Post a new job (recruiter only)
// PUT     /api/jobs/:id           → Edit a job
// DELETE  /api/jobs/:id           → Delete a job

jobRouter.get("/jobs", (req, res) => {
    res.send({ title: "get all jobs" });
});

jobRouter.get("/jobs/:id", (req, res) => {
    const jobId = req.params.id;
    res.send({ title: "get job", id: jobId });
});

jobRouter.post("/jobs", (req, res) => {
    res.send({ title: "post job" });
});
jobRouter.put("/jobs/:id", (req, res) => {
    const jobId = req.params.id;
    res.send({ title: "edit job", id: jobId });
}); 

jobRouter.delete("/jobs/:id", (req, res) => {
    const jobId = req.params.id;
    res.send({ title: "delete job", id: jobId });
}); 


export default jobRouter;