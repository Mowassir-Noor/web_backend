import Job from "../models/job.model.js";

export const searchJobs = async (req, res) => {
  try {
    const { search, location, category, jobType } = req.query;

    let query = {};

    if (search) {
    //   query.$text = { $search: search }; // uses text index
     query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { companyName: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { category: { $regex: search, $options: 'i' } },
    { location: { $regex: search, $options: 'i' } },
  ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' }; // case-insensitive
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
