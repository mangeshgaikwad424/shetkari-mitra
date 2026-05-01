import Job from "../models/Job.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/v1/jobs — list with filters + pagination
export const getJobs = async (req, res) => {
  try {
    const { location, type, minWage, maxWage, status = "open", page = 1, limit = 12 } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (minWage || maxWage) {
      filter.wageAmount = {};
      if (minWage) filter.wageAmount.$gte = Number(minWage);
      if (maxWage) filter.wageAmount.$lte = Number(maxWage);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch jobs", error: err.message });
  }
};

// GET /api/v1/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch job", error: err.message });
  }
};

// POST /api/v1/jobs — farmer posts job
export const createJob = async (req, res) => {
  try {
    const { title, description, type, location, district, wage, wageAmount, workersRequired, startDate, endDate, duration } = req.body;
    const job = await Job.create({
      farmerEmail: req.user.email,
      farmerName: req.user.name,
      title, description, type, location, district,
      wage, wageAmount, workersRequired, startDate, endDate, duration,
    });

    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: "create_job",
      description: `Job posted: ${title} at ${location}`,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create job", error: err.message });
  }
};

// POST /api/v1/jobs/:id/apply — labour applies for job
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ msg: "Job is no longer accepting applications" });
    if (job.applications.includes(req.user.id)) {
      return res.status(400).json({ msg: "You have already applied for this job" });
    }

    job.applications.push(req.user.id);
    await job.save();

    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: "apply_job",
      description: `Applied for job: ${job.title} by ${job.farmerName}`,
    });

    res.json({ msg: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to apply for job", error: err.message });
  }
};

// PATCH /api/v1/jobs/:id — farmer updates job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (job.farmerEmail !== req.user.email) return res.status(403).json({ msg: "Not authorized" });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update job", error: err.message });
  }
};
