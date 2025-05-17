import { Router } from 'express'

const applicationRouter = Router()

// GET     /api/applications/           → Get all applications (admin/recruiter)
// GET     /api/applications/user/:id   → Get applications of a specific user
// GET     /api/applications/job/:id    → Get all applications for a job
// POST    /api/applications/           → Apply to a job
// PUT     /api/applications/:id        → Update application status

applicationRouter.get('/applications', (req, res) => {
  res.send({ title: 'get all applications' })
})

applicationRouter.get('/applications/user/:id', (req, res) => {
  const userId = req.params.id
  res.send({ title: 'get applications of a specific user', id: userId })
})

applicationRouter.get('/applications/job/:id', (req, res) => {
  const jobId = req.params.id
  res.send({ title: 'get all applications for a job', id: jobId })
})

applicationRouter.post('/applications', (req, res) => {
  res.send({ title: 'apply to a job' })
})

applicationRouter.put('/applications/:id', (req, res) => {
  const applicationId = req.params.id
  res.send({ title: 'update application status', id: applicationId })
})


export default applicationRouter;