import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = "#3E232B",
  blur = 10,
  speed = "slow",
  waveOpacity = 0.4,
  waveOffset = 0.24,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveOffset?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the current device is mobile or touch-primary
    const checkMobile = () => {
      const isTouchOrSmall =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouchOrSmall);
      return isTouchOrSmall;
    };

    const isSmall = checkMobile();
    // Do NOT run the 60fps canvas loop on mobile phones to protect battery & GPU
    if (isSmall) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);
    let nt = 0;
    let animationId: number;

    const getSpeed = () => {
      return speed === "fast" ? 0.002 : 0.001;
    };

    const waveColors = colors ?? [
      "#DE4373",
      "#BF2C5B",
      "#E84E7E",
      "#8B1E43",
      "#F06292",
    ];

    const drawWave = (n: number) => {
      nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 45;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 8) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * (waveOffset ?? 0.24));
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave(4);
      animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (checkMobile()) {
        cancelAnimationFrame(animationId);
        return;
      }
      if (!canvas) return;
      w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [backgroundFill, colors, speed, waveOffset, waveOpacity, waveWidth]);

  return (
    <div
      className={cn(
        "relative w-full flex flex-col overflow-hidden bg-[#3E232B]",
        containerClassName
      )}
    >
      {/* Mobile-optimized static lightweight gradient (Zero GPU overhead on mobile phones) */}
      {isMobile ? (
        <div
          className="absolute inset-0 pointer-events-none -z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(222,67,115,0.28), transparent 70%), linear-gradient(180deg, #3E232B 0%, #2A151D 100%)",
          }}
        />
      ) : (
        /* Desktop Canvas with Hardware-Accelerated Blur */
        <canvas
          className="absolute inset-0 z-0 pointer-events-none w-full h-full"
          ref={canvasRef}
          id="wavy-canvas"
          style={{
            filter: `blur(${blur}px)`,
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
          }}
        />
      )}

      <div className={cn("relative z-10 w-full", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
