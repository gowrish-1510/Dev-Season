import { Router } from "express";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";
import dotenv from "dotenv";
import { s3 } from "./problemController.js";
import Problem from "../models/problemModel.js";
import { getStreamAsString } from "../utils/s3Utils.js";
import Submission from "../models/submissionModel.js";
import axios from "axios";
import User from "../models/userModel.js";

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
                const executionTime = parseFloat(actualOutput.data.output?.executionTime || "0");
                if (executionTime > problem.maxExecTime) {
                    results.push({
                        test: i + 1,
                        passed: false,
                        output: actualOutput.data.output,
                        expectedOutput: expectedOutput.trim(),
                        input: inputString.trim(),
                        message: `Time Limit Exceeded (execution time: ${executionTime}ms, limit: ${problem.maxExecTime}ms)`
                    });
                    break; // Stop on TLE
                } else if (actualOutput.data.output.stdout.trim() === expectedOutput.trim()) {
                    results.push({
                        test: i + 1,
                        passed: true,
                        output: actualOutput.data.output,
                        expectedOutput: expectedOutput.trim(),
                        input: inputString.trim(),
                        executionTime: executionTime
                    });
                } else {
                    results.push({
                        test: i + 1,
                        passed: false,
                        output: actualOutput.data.output.stdout,
                        expectedOutput: expectedOutput.trim(),
                        input: inputString.trim(),
                        message: `Wrong Answer on Test Case: ${i+1}(Input is ${inputString.trim()}). Expected Output: ${expectedOutput.trim()} .Got ${actualOutput.data.output.stdout}`
                    });
                    break; // Stop on wrong answer
                }
            } else {
                results.push({
                    test: i + 1,
                    passed: false,
                    message: actualOutput.data.error || "Compilation error",
                    output: actualOutput.data.output || null
                });
                break; // Stop on compilation error
            }
        } catch (err) {
            results.push({
                test: i + 1,
                passed: false,
                message: err.message || "Runtime/Compilation error",
                output: null
            });
            throw new Error(err);
        }
    }
};

//Route for running 2 test cases
submission_router.post("/problem/:id/run", UserAuthenticated, async (req, res) => {
    try {
        const { code, language } = req.body;
        const problemid = req.params.id;

        const problem = await Problem.findById(problemid);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        let newcode=code;
        if(problem.boilerplates && problem.boilerplates.get(language)){  //if boilerplate is present, then append it to user function
          newcode = problem.boilerplates.get(language) + "\n" + code;
        }


        const results = [];

        try {
            await runtestCases(problem, newcode, language, 2, results);
        } catch (err) {
            console.error("Error in compilation: ", err);
            return res.status(200).json({ success: false, message: "Execution failed", results });
        }

        const lastResult = results[results.length - 1];

        if (lastResult && !lastResult.passed) {
            return res.status(200).json({
                success: false,
                message: lastResult.message || `Execution failed at testcase ${results.length}`,
                results
            });
        }

        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Error during code run:", err.message);
        res.status(500).json({ success: false, message: "Internal server error", results: [] });
    }
});



//route for running custom inputs
submission_router.post("/problem/:id/custom",UserAuthenticated, async (req,res)=>{
   const {code,language,input}= req.body;
   const problemid= req.params.id;

const lines = input.trim().split('\n').map(line => line.trim());
  if (lines.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Invalid input: Please provide n, followed by n numbers, and a target value",
    });
  }
const n = parseInt(lines[0]);
const numbers = lines[1].split(/\s+/).map(Number);   //validation for number of elements taken in 2nd line
  if (numbers.length !== n || numbers.some(isNaN)) {
    return res.status(400).json({
      success: false,
      message: `Invalid input: Expected ${n} numbers in the second line`,
    });
  }

   try{
   const problem= await Problem.findById(problemid);
     let newcode= code;

    if(problem.boilerplates && problem.boilerplates.get(language)){
          newcode = problem.boilerplates.get(language) + "\n" + code;
        }

   const op= await axios.post(`${process.env.COMPILER_BACKEND_URL}/run`,{
    newcode,language,input
   });

   if(op.data.success){
     return res.status(200).json({success:true,output:op.data.output})
   }

   else{
     return res.status(200).json({success:false, message:op.data.message || op.data.error || "Invalid Input provided"});
   }
  }
  catch(err){
    console.error("Some error in custom input: ",err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



//route for submission of code
submission_router.post("/problem/:id/submit", UserAuthenticated, async (req, res) => {
    try {
        const { code, language } = req.body;
        const problemid = req.params.id;

        const problem = await Problem.findById(problemid);
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        let newcode= code;
        if(problem.boilerplates && problem.boilerplates.get(language)){  //if boilerplate is present, then append it to user function
          newcode = problem.boilerplates.get(language) + "\n" + code;
        }

        const results = [];

        const submission = new Submission({
            user: req.user,
            problem: problemid,
            code: code,
            language: language
        });

        try {
            await runtestCases(problem, newcode, language, problem.testCases.length, results);
        } catch (err) {
            console.error("Error in compilation: ", err);
            submission.verdict = 'Attempted';
            await submission.save();
            return res.status(200).json({ success: false, message: "Execution failed", results });
        }

        const lastResult = results[results.length - 1];

        if (lastResult && !lastResult.passed) {
            submission.verdict = 'Attempted';
            await submission.save();
            return res.status(200).json({
                success: false,
                message: lastResult.message || `Execution failed at testcase ${results.length}`,
                results
            });
        }

        let maxRuntime=0;
        for(let result of results){  //find maximum execution time
            maxRuntime= Math.max(maxRuntime,result.executionTime);
        }

        submission.verdict = 'Accepted';
        submission.executionTime= maxRuntime;
        await submission.save();

        const user= await User.findById(req.user._id);

        const found= user.solvedProblems.find(problemid => problemid.problem.toString()===problem._id.toString());

        if(found === undefined){
            user.solvedProblems.push({
             problem: problem._id,
             solvedAt: Date.now()
             });
            await user.save();
        }
        
        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Error during code submit:", err.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//route for fetching submissions for a particular problem
submission_router.get("/submission/:id",UserAuthenticated,async (req,res)=>{
    try{
    const submissions= await Submission.find({problem:req.params.id, user: req.user._id});
    if (!submissions) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    res.status(200).json({success:true,submissions});
    }catch(err){
      console.error("Error fetching submission code:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
})

export default submission_router;