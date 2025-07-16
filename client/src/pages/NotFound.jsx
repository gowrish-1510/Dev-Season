import React from "react";

const NotFound= ()=>{
    return(
        <div className="flex justify-center items-center mt-2.5 gap-1.5 flex-col">
            <h3 className="text-7xl text-black border-purple-400 text-center">404</h3>
            <h2 className="text-2xl text-slate-700 border-amber-300 text-center">Page Not Found ⚠️</h2>
            <h1 className="text-2xl text-gray-500 border-amber-300 text-center">We couldn't find the page you are looking for.</h1>
            <img src="/notfound.jpg" className="h-80 mr-3 mt-2" />
        </div>
    )
}

export default NotFound