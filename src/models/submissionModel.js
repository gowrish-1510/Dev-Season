import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },

    code: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true
    },

    verdict: {
        type: String,
        enum: [
            'Accepted',
            'Attempted',
        ],
        required: true
    },

    executionTime: Number,
    memoryUsed: Number,
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
