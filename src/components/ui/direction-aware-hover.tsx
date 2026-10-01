"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<"top" | "bottom" | "left" | "right">("left");

  const getDirection = (ev: React.MouseEvent<HTMLDivElement>, obj: HTMLElement) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const d = getDirection(ev, ref.current);
    const map: Record<number, "top" | "right" | "bottom" | "left"> = {
      0: "top",
      1: "right",
      2: "bottom",
      3: "left",
    };
    setDirection(map[d] ?? "left");
  };

  const variants = {
    initial: { x: 0, y: 0 },
    exit:    { x: 0, y: 0 },
    top:    { y: 20 },
    bottom: { y: -20 },
    left:   { x: 20 },
    right:  { x: -20 },
  };

  const textVariants = {
    initial: { y: 0, x: 0, opacity: 0 },
    exit:    { y: 0, x: 0, opacity: 0 },
    top:    { y: -20, opacity: 1 },
    bottom: { y: 2,   opacity: 1 },
    left:   { x: -2,  opacity: 1 },
    right:  { x: 20,  opacity: 1 },
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "relative overflow-hidden group/card rounded-2xl bg-transparent",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          {/* dark overlay on hover */}
          <motion.div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/50 z-10 transition duration-500" />

          {/* sliding image */}
          <motion.div
            variants={variants}
            className="h-full w-full"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <img
              alt="work experience"
              className={cn("h-full w-full object-cover scale-[1.1]", imageClassName)}
              src={imageUrl}
            />
          </motion.div>

          {/* text reveal */}
          <motion.div
            variants={textVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("text-white absolute bottom-4 left-4 right-4 z-40", childrenClassName)}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
