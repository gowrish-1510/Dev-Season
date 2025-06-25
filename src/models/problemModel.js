import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    category: {
        type: String,
    },

    isApproved: {
        type: Boolean,
        default: false,
    },

    testCases: [{
        inputFileKey: String,   // e.g., Problems/easy/two-sum/input/1.txt
        outputFileKey: String,
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

const Problem= mongoose.model('Problem',problemSchema);
export default Problem;
