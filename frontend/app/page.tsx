"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useState } from "react";

function BatModel(props: any) {
  const { scene } = useGLTF("/assets/bat.glb", true);
  return <motion.primitive object={scene} {...props} />;
}

function BallModel(props: any) {
  const { scene } = useGLTF("/assets/ball.glb", true);
  return <motion.primitive object={scene} {...props} />;
}

export default function LandingPage() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      {!animationComplete ? (
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Animated Bat */}
          <BatModel
            scale={[0.009, 0.009, 0.009]}
            position={[0,0,0]}  // Moves bat to the right
            rotation={[5,0.6,0]}
            // animate={{ x: [0, 1, -1, 0], rotateZ: [-30, 0, 20, -10] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            onAnimationComplete={() => setAnimationComplete(true)}
          />

          {/* Animated Ball */}
          <BallModel
            scale={[0.005, 0.005, 0.005]} 
            position={[3, -1, 0]}
            // animate={{ x: [0, -1, 1, 0], y: [0, 0.5, -0.5, 0] }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          />
        </Canvas>
      ) : (
        <div className="text-white text-4xl">Welcome to the Project!</div>
      )}
    </div>
  );
}



// start of test code 
// "use client";

// import { Canvas } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import { useState, useEffect } from "react";

// function BatModel() {
//   const { scene } = useGLTF("/assets/bat.glb", true);
//   return <primitive object={scene} scale={[0.009, 0.009, 0.009]} position={[-1, -1, 0]} />;
// }

// function BallModel() {
//   const { scene } = useGLTF("/assets/ball.glb", true);
//   return <primitive object={scene} scale={[0.005, 0.005, 0.005]} position={[1, -1, 0]} />;
// }

// export default function ModelTest() {
//   const [loaded, setLoaded] = useState({ bat: false, ball: false });

//   useEffect(() => {
//     console.log("Models Loaded:", loaded);
//   }, [loaded]);

//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-gray-900">
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />

//         {/* Bat Model (Left Side) */}
//         <group
//           onPointerOver={() => setLoaded((prev) => ({ ...prev, bat: true }))}
//         >
//           <BatModel />
//         </group>

//         {/* Ball Model (Right Side) */}
//         <group
//           onPointerOver={() => setLoaded((prev) => ({ ...prev, ball: true }))}
//         >
//           <BallModel />
//         </group>
//       </Canvas>

//       <div className="absolute top-10 text-white text-2xl">
//         {loaded.bat ? "✅ Bat Loaded" : "⏳ Loading Bat..."} | {loaded.ball ? "✅ Ball Loaded" : "⏳ Loading Ball..."}
//       </div>
//     </div>
//   );
// }