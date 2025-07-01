import { Router } from "express";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";
import dotenv from "dotenv"
import { s3 } from "./problemController.js";
import Problem from "../models/problemModel.js";
import { getStreamAsString } from "../utils/s3Utils.js";
import Submission from "../models/submissionModel.js";
import axios from "axios";

const submission_router = Router();
dotenv.config();

const runtestCases = async (problem, code, language, length, results) => {

    for (var i = 0; i < length; i++) {
        const { inputFileKey, outputFileKey } = problem.testCases[i];

        const inputString = await getStreamAsString(s3, process.env.AWS_BUCKET_NAME, inputFileKey);
        const expectedOutput = await getStreamAsString(s3, process.env.AWS_BUCKET_NAME, outputFileKey);

        let actualOutput;

        try {

            actualOutput = await axios.post(`${process.env.COMPILER_BACKEND_URL}/run`, {
                code: code,
                language: language,
                input: inputString,
            });

            if (actualOutput.data.success) {
                if (actualOutput.data.output === expectedOutput.trim()) {
                    results.push({ test: i + 1, passed: true, output: actualOutput.data.output, expectedOutput: expectedOutput.trim() });
                }

                else {
                    results.push({ test: i + 1, passed: false, output: actualOutput.data.output, expectedOutput: expectedOutput.trim() });
                    break;  //stop on the first failure
                }
            }else{
              results.push({test: i + 1,passed:false,message:actualOutput.data.error});  
            }
        } catch (err) {
            results.push({ test: i + 1, passed: false, message: err.message || "Runtime/Compilation error" });
            throw new Error(err);
        }
    }

}

submission_router.post("/problem/:id/run", UserAuthenticated, async (req, res) => {
    try {
        const { code, language = 'cpp' } = req.body;
        const problemid = req.params.id;

        const problem = await Problem.findById(problemid);
        const results = [];

        try {
           await runtestCases(problem, code, language, 2, results);
        } catch (err) {
            console.error("Error in compilation: ", err);
            return res.status(200).json({ success: false, message: "Compilation error!", results });
        }

        const lastResult= results[results.length - 1];

        if (lastResult && !lastResult.passed) {  //if test case failed, it'll be the last in the result array as we broke from loop at that time in function
            return res.status(200).json({ success: false, message: `Compilation error at testcase ${results.length}`, results });
        }

        return res.status(200).json({ success: true, results });
    }
    catch (err) {
        console.error("Error during code run:", err.message);
        res.status(500).json({ success: false, message: "Internal server error", results });
    }
});

submission_router.post("/problem/:id/submit", UserAuthenticated, async (req, res) => {
    try {
        const { code, language = 'cpp' } = req.body;
        const problemid = req.params.id;

        const problem = await Problem.findById(problemid);
        const results = [];

        const submission = new Submission({
            user: req.user,
            problem: problemid,
            code: code,
            language: language
        });

        try {
            await runtestCases(problem, code, language, problem.testCases.length, results);
        } catch (err) {
            console.error("Error in compilation: ", err);
            submission.verdict = 'Attempted';
            await submission.save();
            return res.status(200).json({ success: false, message: "Compilation error!", results });
        }

        const lastResult = results[results.length - 1];

        if (lastResult && !lastResult.passed) {
            submission.verdict = 'Attempted';
            await submission.save();
            return res.status(200).json({ success: false, message: `Compilation error at testcase ${results.length}`, results });
        }

        submission.verdict = 'Accepted';
        await submission.save();
        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Error during code submit:", err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});