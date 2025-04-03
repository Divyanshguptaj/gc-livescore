"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  return (
    <div className="text-white">hello</div>
    // <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
    //   <div className="absolute flex flex-col justify-center items-center w-[90%] h-[90%]">
    //     <div className="text-3xl font-semibold m-1">Page Not Found</div>
    //     <div className="text-7xl font-bold m-1">404</div>
    //     <div className="text-sm sm:text-base w-1/2 min-w-[40%] text-center m-1">
    //       The server encountered an internal error or misconfiguration and was unable to complete your request.
    //     </div>
    //     <div className="text-sm sm:text-base w-1/2 min-w-[40%] text-center m-1">
    //       Our "experts" are trying to fix the problem, please stand by.
    //     </div>
    //   </div>
    //   <div className="absolute w-[99%] h-[95%]"></div>
    //   <canvas id="canvas" className="absolute"></canvas>
    // </div>
  );
}
