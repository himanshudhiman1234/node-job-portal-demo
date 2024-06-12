const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    position: {
        type: String,
        required: [true, "Job position is required"],
        maxlength: 10 // Adjusted to a more reasonable value
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    workType: {
        type: String,
        enum: ["full-time", "part-time", "internship", "contract"]
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);
