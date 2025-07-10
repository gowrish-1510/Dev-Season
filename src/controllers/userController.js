import { Router } from "express";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";

const user_router = Router();

user_router.get("/profile/submission/:id",UserAuthenticated,async (req,res)=>{
  try {
    const submissions = await Submission.find({ user: req.params.id })
      .populate("problem")
      .sort({ createdAt: -1 })
      .limit(10); // last 10 submissions

    return res.status(200).json({ success: true, submissions });
  } catch (err) {
    console.error("Error fetching recent submissions:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});    


user_router.get("/profile/:id", UserAuthenticated, async (req, res) => {
  try {
    const allUsers = await User.find().populate("solvedProblems.problem");

    // Function for Calculation of score for each user
    const userScores = allUsers.map((user) => {
      let score = 0;
      let latestSolvedAt = new Date(0);

      user.solvedProblems.forEach((entry) => {
        const prob = entry.problem;
        if (prob.difficulty === "easy") score += 10;
        else if (prob.difficulty === "medium") score += 20;
        else if (prob.difficulty === "hard") score += 30;

        if (entry.solvedAt > latestSolvedAt) {
          latestSolvedAt = entry.solvedAt;
        }
      });

      return {
        userId: user._id.toString(),
        username: user.username,
        profilePicUrl: user.profilePicUrl,
        score,
        solvedCount: user.solvedProblems.length,
        latestSolvedAt,
      };
    });

    // Sort criteria: higher score first, then earliest solvedAt
    userScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      } else {
        return a.latestSolvedAt - b.latestSolvedAt;
      }
    });

    // Find requested user
    const rankIndex = userScores.findIndex(u => u.userId === req.params.id);

    if (rankIndex === -1) {
      return res.status(404).json({ success: false, message: "User not found in scores" });
    }

    // Get user details
    const user = await User.findById(req.params.id).populate("solvedProblems.problem");
    const userSubmissions = await Submission.find({ user: req.params.id });

    const solvedCount = user.solvedProblems.length;
    const submissionCount = userSubmissions.length;
    const acCount = userSubmissions.filter(sub => sub.verdict === 'Accepted').length;
    const acRate = submissionCount > 0 ? ((acCount / submissionCount) * 100).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        profilePicUrl: user.profilePicUrl,
        solvedCount,
        submissionCount,
        acRate,
        score: userScores[rankIndex].score,
      },
      rank: rankIndex + 1,
      totalUsers: userScores.length,
    });

  } catch (err) {
    console.error("Error in profile route:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});



export default user_router;
