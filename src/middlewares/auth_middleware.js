import passport from "passport";

const UserAuthenticated= (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    return res.status(401).json({error:"Log in to continue!"})
}

export default UserAuthenticated;