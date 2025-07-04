import { createContext, useContext } from "react";

export const ProblemContext= createContext();  //Provider is there in ProblemSolve.jsx

export const useProblem= ()=>{
    const context= useContext(ProblemContext);
    if (!context) {
        throw new Error('Context not provided!')
    }

    return context;
}