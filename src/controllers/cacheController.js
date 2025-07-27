import { Router } from "express";
import redisClient from "../utils/redisClient.js";
import { UserAuthenticated } from "../middlewares/auth_middleware.js";

const cache_router= Router();

cache_router.post("/cache/code/:problemid",UserAuthenticated, async(req,res)=>{
    const probId= req.params.problemid;
    const {code, language}= req.body;

    try{
        const key= `user:${req.user._id}:${probId}:${language}`;
        await redisClient.set(key,code,"EX",3600);

        return res.json({ success: true });
    }catch(err){
        console.error("Error saving in redis: ",err);
        return res.json({ success: false });
    }
});


cache_router.get("/cache/code/:problemid",UserAuthenticated, async(req,res)=>{
    const probId= req.params.problemid;
    const { language } = req.query;
    
    try{
        const key= `user:${req.user._id}:${probId}:${language}`;
        const code= await redisClient.get(key);

        if (!code) return res.json({ success: false });
        await redisClient.expire(key, 3600); // refresh expiry
        return res.json({ success: true, code });
    }catch(err){
      res.json({ success: false });
    }
});

export default cache_router;

