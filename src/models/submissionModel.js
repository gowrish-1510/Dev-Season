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
            'Wrong Answer',
            'Time Limit Exceeded',
            'Runtime Error',
            'Compilation Error'
        ],
        required: true
    },

    testCaseResults: [
        {
            testCaseId: Number, // test case index (1,2,3...)
            inputFileKey: String, // S3 key e.g. 'Problems/easy/two-sum/input/1.txt'
            outputFileKey: String,
            userOutput: String,
            status: {
                type: String,
                enum: ['Passed', 'Failed'],
                default: 'Failed'
            }
        }
    ],

    executionTime: Number,
    memoryUsed: Number,
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
