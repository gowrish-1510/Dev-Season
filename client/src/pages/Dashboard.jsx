import React from "react";
import { useParams } from "react-router-dom";

const Dashboard= ()=>{
   const {userid}= useParams();

    return(
        <>
        This is Dashboard Page of user {userid}!
        </>
    )
}

export default Dashboard;