import express from "express"
import passport from "passport"
import LocalStrategy from "passport-local"
import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import {UserAuthenticated} from "../middlewares/auth_middleware.js";

const auth_router = express.Router();

passport.use(new LocalStrategy({ usernameField: 'email' },
    async function verify(email, password, cb) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return cb(null, false, { message: "User doesn't exist!" });
            }

            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) {
                return cb(null, false, { message: "Wrong password!" });
            }

            return cb(null, user, { message:"Successfully authenticated!" });
        }

        catch (err) {
            console.error("Error occured: ", err.message);
            return cb(err);
        }
    }));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
    try {
        const user = await User.findById(id).select("username email role");
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

auth_router.get("/check-auth", UserAuthenticated, (req, res) => {
    return res.json({ 
        success: true, 
        user: req.user 
    });
});


auth_router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) return next(err);

        if (!user) {
            return res.status(401).json({ success: false, message: info?.message || "Authentication failed" });
        }

        req.login(user, function (err) {
            if (err) return next(err);
            return res.json({ success: true, message: "Login successful", user:user });
        });
    })(req, res, next);
});


auth_router.post("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            return res.json({ message: "error during logging out!", error: "" });
        }

        return res.json({ message: "Successfully logged out!", error: "" })
    })
})

auth_router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const username_exist = await User.findOne({ username });
        if (username_exist) {
            return res.json({ user: null, message: "Username already exists!" });
        }

        const email_exists = await User.findOne({ email });
        if (email_exists) {
            return res.json({ user: null, message: "Email already registered! Please Sign In" });
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            passwordHash: hashedpass,
            role: "user" 
        });

        await user.save();
        res.json({ user: user });
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ user: null, message: "Registration failed" });
    }
});


export default auth_router;