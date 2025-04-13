"use client";

import React, { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "../../lib/utils";

type SparklesProps = {
  className?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
};

export const Sparkles = ({
  className,
  particleColor = "#FFFFFF",
  particleDensity = 100,
  minSize = 0.5,
  maxSize = 1.5,
  speed = 1,
}: SparklesProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    loadSlim().then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div className={cn("absolute inset-0", className)}>
      <Particles
        options={{
          fullScreen: { enable: false },
          particles: {
            number: {
              value: particleDensity,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: particleColor,
            },
            size: {
              value: { min: minSize, max: maxSize },
            },
            move: {
              enable: true,
              speed: speed,
            },
          },
        }}
      />
    </div>
  );
};
