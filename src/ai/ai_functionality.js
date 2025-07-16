import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import z from "zod";
import { Router } from "express";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";
import dotenv from "dotenv";

dotenv.config();

const ai_router = Router();

 const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.7,
    });

//route for generating hints
ai_router.post("/ai/hints", UserAuthenticated, async (req, res) => {

  const { problem, code, language } = req.body;
  try {

    const correctnessSchema= z.object({  //schema for deciding correctness of problem
      isCorrect: z.boolean().describe("Is the code provided correct"),
    });

    const CorrectParser= StructuredOutputParser.fromZodSchema(correctnessSchema);

    const hintSchema = z.object({   //schema for giving hint to user if code is incorret
      hint: z.string().describe("A helpful hint to improve the code"),
      Mistakecategory: z.string().describe("Describe the type of error the user is making (eg: logical, syntax, security, etc..)"),
      codesnippet: z.string().describe("Indicate the snippet of code where the mistake is")
    });

    const hintParser = StructuredOutputParser.fromZodSchema(hintSchema);

    const optSchema= z.object({
      suggestion: z.string().describe("Suggestion on how to optimize the code for less time and memory consumption"),
    })

    const optParser= StructuredOutputParser.fromZodSchema(optSchema);


    const correctnessPrompt= new PromptTemplate({
      template:`For the given problem: {problem} in {language}, analyze whether it is correct or not:
      CODE: {code}
      {format_instructions}`,

      inputVariables:["problem","language","code"],
      partialVariables:{
         format_instructions: CorrectParser.getFormatInstructions(),
      }
    });

    const hintPrompt= new PromptTemplate({
      template:`Analyze the incorrect code for problem: {problem} in {language}
      CODE: {code}
      {format_instructions}`,

      inputVariables:["problem","language","code"],
      partialVariables:{
         format_instructions: hintParser.getFormatInstructions(),
      }
    });

    const optimizePrompt= new PromptTemplate({
      template:`The code is correct for problem: {problem} in {language}. Suggest an optimized approach while explaining the current and efficient approach time and space complexity (in different lines)
      CODE: {code}
      {format_instructions}`,

      inputVariables:["problem","language","code"],
      partialVariables:{
        format_instructions: optParser.getFormatInstructions(),
      }
    });

    // First checking correctness
    const correctnessChain = RunnableSequence.from([
      correctnessPrompt,
      model,
      CorrectParser
    ]);

    const correctnessResult = await correctnessChain.invoke({
      problem,
      language,
      code
    });

    let result;

    if (correctnessResult.isCorrect === false) {       // if code is incorrect, Run hint chain

      const hintChain = RunnableSequence.from([
        hintPrompt,
        model,
        hintParser
      ]);
      
      result = await hintChain.invoke({
        problem,
        language,
        code
      });
    } else {
      // Run optimization chain if code is correct
      const optChain = RunnableSequence.from([
        optimizePrompt,
        model,
        optParser
      ]);
      
      result = await optChain.invoke({
        problem,
        language,
        code
      });
    }

    return res.status(200).json({success: true, result});

  } catch (err) {
    console.error("Error in AI response: ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

//Route to explain the testcases
ai_router.post("/ai/testcases",UserAuthenticated,async (req,res)=>{
  const {input1,output1,input2,output2,problem}= req.body;

  try{
    const explainSchema= z.object({
      description: z.string().describe("Explain the problem in max 3 lines"),
      explanation1: z.string().describe("Briefly explain the first test case"),
      explanation2: z.string().describe("Briefly explain the second test case"),
    });

    const explainParser= StructuredOutputParser.fromZodSchema(explainSchema);

    const prompt= new PromptTemplate({
      template:`For the given problem {problem},give description and explain how the test cases work:
      TEST CASE 1: Input: {input1}, Output: {output1}
      TEST CASE 2: Input: {input2}, Output: {output2}
      
      {format_instructions}`,

      inputVariables:["problem","input1","output1","input2","output2"],
      partialVariables:{
        format_instructions: explainParser.getFormatInstructions(),
      }
    });

    const explainChain= RunnableSequence.from([
      prompt,
      model,
      explainParser
    ]);

    let answer= await explainChain.invoke({problem,input1,output1,input2,output2});

    return res.status(200).json({success:true, answer});
  }catch(err){
    console.error("Error in Ai response: ",err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default ai_router;