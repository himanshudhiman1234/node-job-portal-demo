const jobsModel = require("../models/jobsModel");
const jobModel = require("../models/jobsModel");

const createJobController = async (req, res, next) => {
    const { company, position } = req.body;

    if (!company || !position) {
        return next("Please Provide All fields");
    }

    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body);
    res.status(201).json({ job });
};

const getAlljobsController = async (req, res) => {
    const { status, workType, search, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId,
    };

    if (status && status !== 'all') {
        queryObject.status = status;
    }

    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }

    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }

    let queryResult = jobsModel.find(queryObject);

    if (sort === 'latest') {
        queryResult = queryResult.sort({ createdAt: -1 });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);

    const totalJobs = await jobsModel.countDocuments(queryObject);
    const numofPage = Math.ceil(totalJobs / limit);
    const jobs = await queryResult;

    res.status(200).json({
        totalJobs: jobs.length,
        jobs,
        numofPage,
    });
};

const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;

    if (!company || !position) {
        return next("Please Provide all fields");
    }

    const job = await jobModel.findOne({ _id: id });
    if (!job) {
        return next(`No job found with the id ${id}`);
    }

    const updatedJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ updatedJob });
};

const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    const job = await jobModel.findOne({ _id: id });
    if (!job) {
        return next(`No job with id ${id}`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
        return next("You are not authorized to delete this job");
    }

    await job.remove();
    res.status(200).json({ message: "Success, job deleted" });
};

const jobStatsController = async (req, res) => {
    const stats = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const defaultStats = {
        pending: stats.find(stat => stat._id === 'pending')?.count || 0,
        reject: stats.find(stat => stat._id === 'reject')?.count || 0,
        interview: stats.find(stat => stat._id === 'interview')?.count || 0,
    };

    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
    ]);

    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM YYYY');
        return { date, count };
    }).reverse();

    res.status(200).json({ totalJob: stats.length, defaultStats, monthlyApplication });
};

module.exports = {
    createJobController,
    getAlljobsController,
    updateJobController,
    deleteJobController,
    jobStatsController,
};
