import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard= ()=>{
  const {user}= useAuth();

    return(
        <>
        This is Dashboard Page of user {user.username}!
        </>
    )
}

export default Dashboard;