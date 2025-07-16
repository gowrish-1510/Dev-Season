import React from "react";

const Maintenance = () => {
    return (

        <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mt-11 mx-auto">
            <div className="text-center lg:text-left transform transition-all duration-1000 ease-out">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                    Page is Under
                    <br />
                    <span className="text-6xl sm:text-7xl md:text-8xl">Construction</span>
                </h1>
                <h2 className="text-lg sm:text-xl text-slate-600 font-medium max-w-md mx-auto lg:mx-0">
                    We are working hard to bring you the best experience! ❤️
                </h2>
            </div>

            <div className="flex justify-center transform transition-all duration-1000 ease-out delay-200">
                <img
                    src="/construction.jpg"
                    alt="Under Construction"
                    className="h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                />
            </div>
        </div>
    )
}

export default Maintenance