import React from "react";
import '@/components/styles/LoadingSpinner.css'; // Keep for animations

const LoadingSpinner = () => {
  return (
    <div className='container text-2xl relative flex items-center justify-center h-[90%] w-full bg-white overflow-hidden'>
      <h1 className="title text-black text-2xl font-extrabold absolute uppercase left-[48%] top-[50%] -ml-5">Loading...</h1>

      <div className='body absolute top-[46%] left-[50%] -ml-[50px] animate-[speeder_0.4s_linear_infinite]'>
        <span className="absolute h-[5px] w-[35px] bg-black -top-[15px] left-[60px] rounded-[2px_10px_1px_0]"></span>

        <div className='base relative'>
          <span className="absolute w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[100px] border-r-black">
            <span className="absolute w-[22px] h-[22px] bg-black rounded-full -right-[110px] -top-[16px]"></span>
            <span className="absolute w-0 h-0 border-t-0 border-t-transparent border-b-[16px] border-b-transparent border-r-[55px] border-r-black -top-[16px] -right-[98px]"></span>
          </span>
          <div className='face absolute h-[12px] w-[20px] bg-black rounded-t-[20px] rotate-[-40deg] -right-[125px] -top-[15px]'>
            <span className="absolute h-[12px] w-[12px] bg-black rotate-[40deg] transform-origin-center rounded-bl-sm right-[4px] top-[7px]"></span>
          </div>
        </div>
      </div>

      <div className='longfazers absolute w-full h-full'>
        <span className="absolute h-[2px] w-1/5 bg-black top-[20%] animate-[lf_0.6s_linear_infinite]"></span>
        <span className="absolute h-[2px] w-1/5 bg-black top-[40%] animate-[lf2_0.8s_linear_infinite] delay-[-1s]"></span>
        <span className="absolute h-[2px] w-1/5 bg-black top-[60%] animate-[lf3_0.6s_linear_infinite]"></span>
        <span className="absolute h-[2px] w-1/5 bg-black top-[80%] animate-[lf4_0.5s_linear_infinite] delay-[-3s]"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
