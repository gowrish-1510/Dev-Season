import { Router } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import { UserAuthenticated, AdminOnly } from "../middlewares/auth_middleware";
import slugify from "slugify";
import Contest from "../models/contestModel.js";
import { s3 } from "./problemController.js";
import Problem from "../models/problemModel.js";

const contest_router = Router();

//Route to create contest by admin
contest_router.post("/contest/create", AdminOnly, async (req, res) => {
    const { title, description, company, startDate, endDate, problems } = req.body;
    const problemIds=[];

    const contestSlug = slugify(title);
    try {
        const contest = new Contest({
            title: contestSlug,
            description: description,
            company: company,
            startTime: startDate,
            endTime: endDate,
            createdBy: req.user._id,
        });

        for (var i = 0; i < problems.length; i++) {
            const testcaseEntries = [];
            const problemSlug= problems[i].title;
            for (var j = 0; j < problems[i].testcases.length; j++) {
                const { input, output } = problems[i].testcases[j];

                const inputKey = `Problems/${problems[i].difficulty}/${problemSlug}/input/${j}.txt`;  //path for input tc's in S3 bucket
                const outputKey = `Problems/${problems[i].difficulty}/${problemSlug}/output/${j}.txt`;

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
                    ContentType: 'text/plain'
                }));

                testcaseEntries.push({
                    inputFileKey: inputKey,
                    outputFileKey: outputKey
                });
            }

            const problem= new Problem({
                title: problemSlug,
                description: problems[i].description,
                difficulty: problems[i].difficulty,
                isApproved:false,
                author: req.user._id,
                category: problems[i].category,
                boilerplates: problems[i].boilerplates || {},  //it will be present for data structure problems
                displayFunctions: problems[i].displayFunctions || {}, //it will be present for data structure problems
            });

            await problem.save();

            problemIds.push(problem._id);
        }

         contest.problems= problemIds;
         await contest.save();

         return res.status(201).json({success:true,message:"Contest created successfully"})
    }catch(err){
        console.error("Some error creating contest:",err);
        return res.status(501).json({success:false,message:"Some error in creating contests"})
    }
});


//Route to fetch all contests
contest_router.get("/contest/all",UserAuthenticated,async (req,res)=>{
    try{
      const contests= await Contest.find({}).sort({ startTime: -1 });;
      return res.status(200).json({success:true,contests});
    }catch(err){
        console.error("Error fetching contests: ",err);
        return res.status(501).json({success:false,message:"Some error fetching contests"});
    }
});


//Route for user to register to a contest
contest_router.post("/contest/register/:id",UserAuthenticated,async (req,res)=>{
    try{
        const contestId= req.params.id;
        const contest= await Contest.findById(contestId);

        contest.participants.push({
            user: req.user._id,
            score:0,
            submissions:[],
        });

        await contest.save();
        return res.status(201).json({success: true,message:"Successfully registered!"});
    }catch(err){
        console.error("Some err:",err);
        res.status(501).json({success:false, message:"Error while registering!"});
    }
})


contest_router.post("/contest/:id",UserAuthenticated,async (req,res)=>{
    try{
        const contestId= req.params.id
        const contest= await Contest.findById(contestId).populate("problems","title description difficulty");
        if (!contest) {
            return res.status(404).json({ success: false, message: "Contest not found" });
        }

        return res.status(200).json({ success: true, contest });
    }catch(err){
        console.error("Some Error fetching contests: ",err);
        return res.status(500).json({ success: false, message: "Error fetching contest" });
    }
})


