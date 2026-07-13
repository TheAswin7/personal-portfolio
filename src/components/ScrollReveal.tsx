import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  preset?: "fade-up" | "blur-reveal" | "scale-in" | "slide-left" | "slide-right" | "word-by-word" | "char-by-char";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  /** Controls how quickly the word/char cascade completes across the scroll range. */
  speed?: "normal" | "fast";
}

export default function ScrollReveal({
  children,
  preset = "fade-up",
  duration = 0.8,
  delay = 0,
  threshold = 0.15,
  className = "",
  once = true,
  speed = "normal",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  // Dynamic Scroll Progress for scroll-linked (Apple-style) reveals
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  // Smoothed progress so per-word/char cascades ease rather than track the scrollbar 1:1
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 32, restDelta: 0.001 });

  // "fast" compresses the cascade into a shorter portion of the scroll range for a snappier reveal
  const cascadeWindow = speed === "fast" ? 0.3 : 0.5;
  const cascadeSpan = speed === "fast" ? 0.14 : 0.2;

  // Interpolations for scroll-linked reveal
  const scrollOpacity = useTransform(scrollYProgress, [0.1, 0.7], [0.2, 1]);
  const scrollBlur = useTransform(scrollYProgress, [0.1, 0.7], ["blur(12px)", "blur(0px)"]);
  const scrollScale = useTransform(scrollYProgress, [0.1, 0.7], [0.92, 1]);
  const scrollY = useTransform(scrollYProgress, [0.1, 0.7], [40, 0]);

  // Different animations presets
  const getVariants = (): any => {
    switch (preset) {
      case "fade-up":
        return {
          hidden: { opacity: 0, y: 35 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.16, 1, 0.3, 1], // Apple elegant ease-out
            },
          },
        };
      case "blur-reveal":
        return {
          hidden: { opacity: 0, y: 40, filter: "blur(15px)", scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
              duration: duration * 1.2,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        };
      case "scale-in":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay },
          },
        };
    }
  };

  // If it's a scroll-linked word-by-word reveal (traditional Apple typographic reveal)
  if (preset === "word-by-word" && typeof children === "string") {
    const words = children.split(" ");
    return (
      <div ref={ref} className={`relative flex flex-wrap ${className}`}>
        {words.map((word, index) => {
          // Stagger each word slightly as we scroll
          const wordStart = index / words.length;
          const start = wordStart * cascadeWindow + 0.1;
          const end = start + cascadeSpan;
          // Calculate high-contrast scroll-linked opacity
          const wordOpacity = useTransform(smoothProgress, [start, end], [0.15, 1]);
          const wordBlur = useTransform(smoothProgress, [start, end], ["blur(6px)", "blur(0px)"]);
          const wordGlow = useTransform(
            smoothProgress,
            [start, start + (end - start) * 0.5, end],
            ["0px 0px 0px rgba(249,115,22,0)", "0px 0px 10px rgba(249,115,22,0.4)", "0px 0px 0px rgba(249,115,22,0)"]
          );
          const wordColor = useTransform(
            smoothProgress,
            [start, end],
            ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 1)"]
          );

          return (
            <motion.span
              key={index}
              style={{ opacity: wordOpacity, color: wordColor, textShadow: wordGlow, filter: wordBlur }}
              className="mr-[0.3em] inline-block will-change-[filter,opacity]"
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    );
  }

  // If it's a scroll-linked char-by-char reveal
  if (preset === "char-by-char" && typeof children === "string") {
    const chars = children.split("");
    return (
      <div ref={ref} className={`relative inline-flex flex-wrap ${className}`}>
        {chars.map((char, index) => {
          const charStart = index / chars.length;
          const start = charStart * cascadeWindow + 0.1;
          const end = start + cascadeSpan;
          const charOpacity = useTransform(smoothProgress, [start, end], [0.12, 1]);
          const charBlur = useTransform(smoothProgress, [start, end], ["blur(5px)", "blur(0px)"]);
          const charColor = useTransform(
            smoothProgress,
            [start, end],
            ["rgba(255,255,255,0.12)", "rgba(255,255,255,1)"]
          );
          return (
            <motion.span
              key={index}
              style={{ opacity: charOpacity, color: charColor, filter: charBlur }}
              className="inline-block will-change-[filter,opacity]"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
