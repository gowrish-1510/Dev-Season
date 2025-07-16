import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";

dotenv.config();

const client= new DynamoDBClient({region:process.env.AWS_REGION});
const docClient= DynamoDBDocumentClient.from(client);
const discussion_router= Router();

//Route for creating a new thread
discussion_router.post("/discussion/thread",UserAuthenticated,async (req,res)=>{
    const {problemid,title,content}= req.body;
    const {_id: userid, username}= req.user;
    const threadid= uuidv4();

    const params= {
      TableName: "Discussions",
      Item:{
        PK: threadid,
        SK: "THREAD",
        problemid,
        userid:userid.toString(),
        username,
        title,
        content,
        createdAt: new Date().toISOString(),
        type:"thread"
      }
    };

    try{
        const thread= await docClient.send(new PutCommand(params));
        res.status(201).json({ success: true, threadid });
    }catch(err){
      console.error("Error creating thread", err);
      res.status(500).json({ success: false, message: "Failed to create thread" });
    }
});


//Route for replying to a thread
discussion_router.post("/discussion/reply/:id",UserAuthenticated,async (req,res)=>{
    const threadid= req.params.id;
    const {_id: userid, username}= req.user;
    const {problemid,content}= req.body;

    const replyid= uuidv4();
    const params= {
      TableName: "Discussions",
      Item: {
        PK: threadid,  //primary key is threadid associated with the reply
        SK: replyid,
        problemid,
        userid: userid.toString(),
        username,
        content,
        createdAt: new Date().toISOString(),
        type: "reply"
      } 
    };

    try{
    const reply= await docClient.send(new PutCommand(params));
    res.status(201).json({ success: true , replyid});
    }catch(err){
       console.error("Error in replying:", err); 
       res.status(500).json({ success: false, message: "Failed to add reply" });
    }
});


//Route to get threads and specific replies for a problem
discussion_router.get("/discussion/problem/:id",UserAuthenticated,async (req,res)=>{
   const problemid= req.params.id;
   
   const params= {
    TableName: "Discussions",
    IndexName: "ProblemIdIndex",
    KeyConditionExpression: "problemid = :problemid ", //fetch thread with the problemid
    FilterExpression: "SK = :sk", 
    ExpressionAttributeValues: {
        ":problemid": problemid,
        ":sk": "THREAD",
    },
   };

   try{
    const threadData= await docClient.send(new QueryCommand(params));
    const threads= threadData.Items;
    

    if (!threads || threads.length === 0) {   //No threads
      return res.status(200).json({ success: true, threads: [] });
    }

    const threadsWithReplies = await Promise.all(   //get replies for each thread
      threads.map(async (thread) => {
        const replyParams = {
          TableName: "Discussions",
          KeyConditionExpression: "PK = :pk",  // Get all items with this PK
          FilterExpression: "#type = :type",   // Filter for replies only
          ExpressionAttributeNames: {
            "#type": "type"
          },
          ExpressionAttributeValues: {
            ":pk": thread.PK,
            ":type": "reply"
          }
        };

        const replyData = await docClient.send(new QueryCommand(replyParams));
        const replies = replyData.Items || [];

        return {
          ...thread,
          replies
        };
      })
    );

    res.status(200).json({ success: true, threads: threadsWithReplies });
   }catch(err){
    console.error("Error fetching thread", err);
    res.status(500).json({ success: false, message: "Failed to get thread" });
   }

});

export default discussion_router;

