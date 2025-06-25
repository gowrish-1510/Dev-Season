import passport from "passport";

export const UserAuthenticated= (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    return res.status(401).json({error:"Log in to continue!"})
}

export const AdminOnly= (req,res,next)=>{
    if(req.isAuthenticated() && req.user.role==='admin'){
        return next;
    }

    return res.status(401).json({error:"No Admin privellages!"})
}
