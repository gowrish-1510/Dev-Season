
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    profilePicUrl: {
        type: String,
        default: ""
    },

    role: {
        type: String, enum: ['user', 'admin'],
        default: 'user'
    },

    solvedProblems: [{
       problem:{ type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'},
       solvedAt:{type: Date, default: Date.now}
    }],


    contestsParticipated: [{
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
        score: Number,
        rank: Number,
        submissionTime: Date
    }],
    createdAt: { type: Date, default: Date.now }
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
