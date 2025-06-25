import Problem from "../models/problemModel.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Router, text } from "express";
import {UserAuthenticated, AdminOnly} from "../middlewares/auth_middleware.js";
import { getStreamAsString  } from "../utils/s3Utils.js";
import slugify from "slugify";

dotenv.config();

const problem_router = Router();

const s3 = new S3Client({
   region: process.env.AWS_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   }
});

//USER ROUTES
//route for storing problem test cases in S3 bucket and problem in mongoDB
problem_router.post("/problem/create", UserAuthenticated, async(req, res) => {
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

      for (var i = 0; i < testcases.length(); i++) {
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
            key: outputKey,
            Body: output,
            ContentType: 'text/plain',
         }));

         testcaseEntries.push({
            inputFileKey: inputKey,
            outputFileKey: outputKey
         });

         const problem= new Problem({
            title:title,
            description: description,
            difficulty: difficulty,
            category: category,
            isApproved: false,
            author: author,
            testCases: testcaseEntries
         });

         await problem.save();

         return res.status(201).json({success:true,problem:problem});
      }
   }

   catch (err) {
     console.error("Error while creating problem:", err.message);
     res.status(501).json({success:false,message:"Error saving the problem"});
   }
});

//route for listing all problems
problem_router.get("/problem/all",async(req,res)=>{  
   try{
      const approvedProblems= await Problem.find({isApproved: true}); //get all approved problems
      res.json({ success: true, problems: approvedProblems });
   }

   catch(err){
     res.status(500).json({ success: false, message: "Error fetching problems" });
   }
});


//route for listing a single problem by id
problem_router.get("/problem/:id",async(req,res)=>{
   try{
   const problem= await Problem.findById(req.params.id).populate("author","username");
   if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const testCasesWithContent= [];
    for(var i=0;i<problem.testCases.length;i++){
      const {inputFileKey,outputFileKey}= problem.testCases[i];

      const inputString = getStreamAsString(s3,process.env.AWS_BUCKET_NAME,inputFileKey);
      const outputString= getStreamAsString(s3,process.env.AWS_BUCKET_NAME,outputFileKey);

      testCasesWithContent.push({
         input: inputString,
         output: outputString,
      });


    }

    res.status(201).json({success:true,problem:problem,sampleTestCases: testCasesWithContent});
   }
   catch(err){
      res.status(500).json({success:false,message:"Error fetching problems"});
   }
});


//ADMIN ROUTES

//route to approve a problem submitted by user
problem_router.patch("/problem/approve/:id",AdminOnly,async(req,res)=>{
   try{
   const problem= await Problem.findByIdAndUpdate(req.params.id,{isApproved: true},{new:true});  //approve unapproved problems

    if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }
   res.json({success:true,message:"Problem Approved!"});
   }

   catch(err){
    res.json({success:false,message:"Problem approval failed!"});  
   }
});

//route to delete a problem
problem_router.delete("problem/delete/:id",AdminOnly,async(req,res)=>{
   try{
   const problem= await Problem.findByIdAndDelete(req.params.id);
     if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }
   res.json({success:true,message:"Problem Deleted successfully!"});
  }catch(err){
    res.json({success:false,message:"Problem deletion failed!"}); 
  }
});


