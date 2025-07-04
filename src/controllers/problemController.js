import Problem from "../models/problemModel.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Router, text } from "express";
import { UserAuthenticated, AdminOnly } from "../middlewares/auth_middleware.js";
import { getStreamAsString } from "../utils/s3Utils.js";
import slugify from "slugify";

dotenv.config();

const problem_router = Router();

export const s3 = new S3Client({
   region: process.env.AWS_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   }
});

//USER ROUTES
//route for storing problem test cases in S3 bucket and problem in mongoDB
problem_router.post("/problem/create", UserAuthenticated, async (req, res) => {
   try {
      const {
         title,
         description,
         difficulty,
         category,
         testcases
      } = req.body;

      const problemSlug = slugify(title); //to remove and trim unnecessary characters
      const author = req.user._id;
      const testcaseEntries = [];

      for (var i = 0; i < testcases.length; i++) {
         const { input, output } = testcases[i];

         const inputKey = `Problems/${difficulty}/${problemSlug}/input/${i}.txt`;  //path for input tc's in S3 bucket
         const outputKey = `Problems/${difficulty}/${problemSlug}/output/${i}.txt`;

         await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: inputKey,
            Body: input,
            ContentType: 'text/plain'
         }));

         await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: outputKey,
            Body: output,
            ContentType: 'text/plain',
         }));

         testcaseEntries.push({
            inputFileKey: inputKey,
            outputFileKey: outputKey
         });

      }
      const problem = new Problem({
         title: title,
         description: description,
         difficulty: difficulty,
         category: category,
         isApproved: false,
         author: author,
         testCases: testcaseEntries
      });

      await problem.save();

      return res.status(201).json({ success: true, problem: problem });
   }

   catch (err) {
      console.error("Error while creating problem:", err.message);
      res.status(501).json({ success: false, message: "Error saving the problem" });
   }
});

//route for fetching contributors of problems in descending order
problem_router.get("/problem/contributors", async (req, res) => {
   try {
      const result = await Problem.aggregate([
         {
            $group: {
               _id: '$author',
               problemCount: { $sum: 1 },   //cont no of occurances 
            },
         },
         {
            $sort: { problemCount: -1 },  //sort no of user occurances in descending order
         },

         {
            $lookup: {             //fetches users from the users collection
               from: 'users',
               foreignField: '_id',
               localField: '_id',
               as: 'contributors',
            }
         },

         {
            $unwind: '$contributors',         //rename the array for returning
         },

         {
            $project: {                        //return with required fields
               _id: 0,
               userId: '$contributors._id',
               username: '$contributors.username',
               problemCount: 1
            },
         },

      ]);

      return res.status(200).json({success:true,contributors: result});
   }catch(err){
     console.error("Error occured :",err);
     return res.status(500).json({success:false,message:"Error fetching contributors!"})
   }
});

//route for listing all problems
problem_router.get("/problem/all", async (req, res) => {
   try {

      const approvedProblems = await Problem.find({ isApproved: true }); //get all approved problems
      res.json({ success: true, problems: approvedProblems });
   }

   catch (err) {
      res.status(500).json({ success: false, message: "Error fetching all problems" });
   }
});


//Fetch all unapproved problems (ADMIN ROUTE)
problem_router.get("/problem/unapproved", AdminOnly, async (req, res) => {
   try {
      const problems = await Problem.find({ isApproved: false });
      if (problems.length == 0) {
         return res.status(404).json({ success: false, message: "No unapproved problems!" });
      }

      return res.json({ success: true, problems });
   } catch (err) {
      return res.status(500).json({ success: false, message: "Couldn't fetch unapproved problems!" });
   }
});


//route for listing a single problem by id
problem_router.get("/problem/:id", async (req, res) => {
   try {
      const problem = await Problem.findById(req.params.id).populate("author", "username");
      if (!problem) {
         return res.status(404).json({ success: false, message: "Problem not found" });
      }

      const testCasesWithContent = [];
      for (var i = 0; i < problem.testCases.length; i++) {
         const { inputFileKey, outputFileKey } = problem.testCases[i];

         const inputString = await getStreamAsString(s3, process.env.AWS_BUCKET_NAME, inputFileKey);
         const outputString = await getStreamAsString(s3, process.env.AWS_BUCKET_NAME, outputFileKey);

         testCasesWithContent.push({
            input: inputString,
            output: outputString,
         });


      }

      res.status(201).json({ success: true, problem: problem, sampleTestCases: testCasesWithContent });
   }
   catch (err) {
      console.error("Some error: ",err);
      res.status(500).json({ success: false, message: "Error fetching problem with id" });
   }
});


//ADMIN ROUTES

//route to approve a problem submitted by user
problem_router.patch("/problem/approve/:id", AdminOnly, async (req, res) => {
   try {
      const problem = await Problem.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });  //approve unapproved problems

      if (!problem) {
         return res.status(404).json({ success: false, message: "Problem not found" });
      }
      res.json({ success: true, message: "Problem Approved!" });
   }

   catch (err) {
      res.json({ success: false, message: "Problem approval failed!" });
   }
});

//route to delete a problem
problem_router.delete("/problem/delete/:id", AdminOnly, async (req, res) => {
   try {
      const problem = await Problem.findByIdAndDelete(req.params.id);
      if (!problem) {
         return res.status(404).json({ success: false, message: "Problem not found" });
      }

      const problemslug = slugify(problem.title);
      const s3Prefix = `Problems/${problem.difficulty}/${problemslug}/`;

      const list = new ListObjectsV2Command({  //list all objects in folder of s3 bucket
         Bucket: process.env.AWS_BUCKET_NAME,
         Prefix: s3Prefix
      });

      const listedObjects = await s3.send(list); //send the list command to AWS S3
      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
         return res.json({ success: true, message: "Problem deleted. No files found in S3." });
      }

      const deleteCommand = new DeleteObjectCommand({
         Bucket: process.env.AWS_BUCKET_NAME,
         Delete: {
            Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key })),
         }
      });

      await s3.send(deleteCommand);

      res.json({ success: true, message: "Problem and associated files Deleted successfully!" });

   } catch (err) {
      res.status(500).json({ success: false, message: "Problem deletion failed!" });
   }
});


export default problem_router;


