import express from 'express';
import passport from 'passport';
import session from 'express-session';
import connectToMongoDB from './src/db/connectToMongoDB.js';
import auth_router from './src/controllers/authController.js';
import problem_router from './src/controllers/problemController.js';
import cors from 'cors'

const app= express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure:false,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(auth_router);
app.use(problem_router);

app.listen(8000,()=>{
    console.log("Server running on port 8000");
    connectToMongoDB()
});