import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }],

    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, default: 0 },
        rank: { type: Number, default: -1 },
        submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }]
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Contest = mongoose.model("Contest", contestSchema);
export default Contest;
