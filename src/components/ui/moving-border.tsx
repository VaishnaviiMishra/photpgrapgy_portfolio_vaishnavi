import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 2500,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative p-[1px] overflow-hidden cursor-pointer",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-24 w-24 opacity-100 bg-[radial-gradient(#FFE4E8_10%,#FFB6C1_45%,#FF8DA1_70%,transparent_90%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-[#3E232B] border border-white/10 text-white flex items-center justify-center w-full h-full text-sm font-semibold transition-colors",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    try {
      if (!pathRef.current) return;
      const length = pathRef.current.getTotalLength();
      if (length && length > 0) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    } catch {
      // Safely catch when SVG path is empty or hidden during initial render
    }
  });

  const x = useTransform(progress, (val) => {
    try {
      if (!pathRef.current) return 0;
      const length = pathRef.current.getTotalLength?.() ?? 0;
      if (!length || length <= 0) return 0;
      const pt = pathRef.current.getPointAtLength(val);
      return pt?.x ?? 0;
    } catch {
      return 0;
    }
  });

  const y = useTransform(progress, (val) => {
    try {
      if (!pathRef.current) return 0;
      const length = pathRef.current.getTotalLength?.() ?? 0;
      if (!length || length <= 0) return 0;
      const pt = pathRef.current.getPointAtLength(val);
      return pt?.y ?? 0;
    } catch {
      return 0;
    }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
