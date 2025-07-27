import express from 'express';
import passport from 'passport';
import session from 'express-session';
import connectToMongoDB from './src/db/connectToMongoDB.js';
import auth_router from './src/controllers/authController.js';
import problem_router from './src/controllers/problemController.js';
import submission_router from './src/controllers/submissionController.js';
import user_router from './src/controllers/userController.js';
import discussion_router from './src/controllers/discussionController.js';
import cache_router from './src/controllers/cacheController.js';
import ai_router from './src/ai/ai_functionality.js';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();

const app= express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure:false,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(auth_router);
app.use(problem_router);
app.use(submission_router);
app.use(user_router);
app.use(ai_router);
app.use(discussion_router);
app.use(cache_router);

app.listen(8000,()=>{
    console.log("Server running on port 8000");
    connectToMongoDB()
});