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

    company: {
    type: String
    },

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

// Virtual field for contest status (live, upcoming, ended)
contestSchema.virtual('status').get(function () {
    const now = new Date();
    if (now < this.startTime) return 'upcoming';
    if (now >= this.startTime && now <= this.endTime) return 'live';
    return 'ended';
});

contestSchema.set('toJSON', { virtuals: true });
contestSchema.set('toObject', { virtuals: true });

const Contest= mongoose.model("Contest",contestSchema);
export default Contest;
