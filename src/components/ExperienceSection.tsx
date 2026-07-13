import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion
} from "motion/react";
import { cn } from "../lib/utils";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ScrollReveal from "./ScrollReveal";
import { IrisReveal } from "./ui/iris-reveal";
import { 
  Presentation, 
  Palette, 
  GraduationCap, 
  Cpu, 
  Zap, 
  Terminal 
} from "lucide-react";

const experiences = [
  { 
    year: "2024", 
    date: "MAY 2024",
    role: "Research Presenter", 
    company: "ICRTAC 2024", 
    desc: "Presented ML/DL cancer diagnosis research at an international conference.", 
    tags: ["ML", "DL", "RESEARCH"],
    icon: Presentation
  },
  { 
    year: "2024", 
    date: "JAN 2024",
    role: "Graphic Designer", 
    company: "UCEN E-Magazine", 
    desc: "Produced 20+ layouts managing full visual identity of the publication.", 
    tags: ["DESIGN", "LAYOUT", "CREATIVITY"],
    icon: Palette
  },
  { 
    year: "2023–27", 
    date: "2023–2027",
    role: "B.E. Computer Science", 
    company: "University Col. of Eng.", 
    desc: "CGPA 8.12/10 · building real-time CV systems and gesture-driven apps.", 
    tags: ["DSA", "CV", "PYTHON"],
    icon: GraduationCap
  },
  { 
    year: "2024", 
    date: "MID 2024",
    role: "AI/CV Developer", 
    company: "Personal Projects", 
    desc: "Engineered gesture-driven applications running at 30+ FPS using OpenCV.", 
    tags: ["OPENCV", "MEDIAPIPE", "PYTHON"],
    icon: Cpu
  },
  { 
    year: "2024", 
    date: "OCT 2024",
    role: "Hackathon Builder", 
    company: "TwinPe — P2P Payments", 
    desc: "Built offline peer-to-peer payment system in a hackathon sprint.", 
    tags: ["FLUTTER", "P2P", "OFFLINE"],
    icon: Zap
  },
  { 
    year: "2024", 
    date: "DEC 2024",
    role: "CTF Participant", 
    company: "Yukthi CTF 2.0", 
    desc: "Solved cryptography and vulnerability challenges in capture-the-flag.", 
    tags: ["CRYPTO", "VULN", "SECURITY"],
    icon: Terminal
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// UI UTILS: REF NOISE/SCRAMBLER EFFECT
// ─────────────────────────────────────────────────────────────────────────────

const scrambleRef = (finalValue: string, setDisplay: (v: string) => void) => {
  const chars = '0123456789';
  let iterations = 0;
  const maxIterations = 10;
  const interval = setInterval(() => {
    setDisplay('REF_L_0' + 
      Array.from({length: 2}, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    );
    iterations++;
    if (iterations >= maxIterations) {
      clearInterval(interval);
      setDisplay(finalValue);
    }
  }, 35);
  return () => clearInterval(interval);
};

const ScrambledRef = ({ value, active, isHovered }: { value: string, active: boolean, isHovered: boolean }) => {
  const [display, setDisplay] = useState("REF_L_000");
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (active && !hasTriggered.current) {
      hasTriggered.current = true;
      return scrambleRef(value, setDisplay);
    }
  }, [active, value]);

  useEffect(() => {
    if (isHovered && hasTriggered.current) {
      return scrambleRef(value, setDisplay);
    }
  }, [isHovered, value]);

  return <span>{display}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE ITEM
// ─────────────────────────────────────────────────────────────────────────────

const TimelineItem = ({ exp, index, scrollYProgress }: { exp: any, index: number, scrollYProgress: any }) => {
  const isLeft = index % 2 === 0;
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.15 });
  const [active, setActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const cannotHover = useMediaQuery("(hover: none)");

  useEffect(() => {
    if (isInView) setActive(true);
  }, [isInView]);

  const [isRevealed, setIsRevealed] = useState(false);
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setIsRevealed(true), shouldReduceMotion ? 0 : 100);
      return () => clearTimeout(timer);
    }
  }, [active, shouldReduceMotion]);

  useEffect(() => {
    if (cannotHover && isRevealed) setIsHovered(true);
  }, [cannotHover, isRevealed]);

  const { scrollYProgress: itemScroll } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  const titleY = useTransform(itemScroll, [0, 1], shouldReduceMotion ? ["0px", "0px"] : ["3px", "-3px"]);
  const refY = useTransform(itemScroll, [0, 1], shouldReduceMotion ? ["0px", "0px"] : ["8px", "-8px"]);
  const bloomOpacity = useTransform(itemScroll, [0.3, 0.5, 0.7], [0, 0.6, 0]);

  const IconComponent = exp.icon;

  return (
    <div ref={itemRef} className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] min-h-0 md:min-h-[40vh] items-center relative gap-8 md:gap-0">
      {/* Background Ambient Bloom */}
      <motion.div 
        style={{ 
          opacity: bloomOpacity,
          x: isLeft ? 100 : -100,
          y: useTransform(itemScroll, [0, 1], [30, -30])
        }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-[250px] h-[150px] rounded-full blur-[80px] z-0 pointer-events-none",
          isLeft ? "right-[45%]" : "left-[45%]",
          "bg-gradient-to-r from-orange-500/10 to-transparent"
        )}
      />

      {/* LEFT COLUMN */}
      <div className={cn("flex flex-col md:h-full justify-center w-full", isLeft ? "items-start text-left md:items-end md:text-right pr-0 md:pr-12 z-20" : "hidden md:block opacity-0 pointer-events-none")}>
        {isLeft && (
          <div className="max-w-[640px] w-full relative">
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ x: shouldReduceMotion ? 0 : -24, y: 16, opacity: 0, filter: "blur(10px)", scale: 0.98 }}
              animate={active ? { x: 0, y: 0, opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative p-8 md:p-10 rounded-2xl border border-white/10 overflow-hidden group min-h-[240px]",
                "transition-all duration-500 bg-[#0c0c0e]/80 backdrop-blur-xl",
                isHovered && "bg-gradient-to-br from-orange-500/[0.03] to-transparent border-white/15"
              )}
              style={{ 
                background: "linear-gradient(135deg, rgba(249,115,22,0.03) 0%, transparent 60%, rgba(255,255,255,0.01) 100%), rgba(12,12,14,0.8)"
              }}
            >
              {/* Glowing Top-Left Corner Border */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-orange-500 rounded-tl-2xl pointer-events-none shadow-[-3px_-3px_15px_rgba(249,115,22,0.4)]" />

              {/* Large faint chapter numeral - editorial rhythm marker, scales to any card count */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 right-6 select-none font-sans text-7xl md:text-8xl font-bold tabular-nums text-white/[0.04] transition-colors duration-500 group-hover:text-orange-500/[0.07]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Scan Sweep Effect */}
              {isHovered && (
                <motion.div 
                  initial={{ top: "0%", opacity: 1 }}
                  animate={{ top: "100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-[3px] bg-orange-500/10 z-10 pointer-events-none"
                />
              )}

              {/* Top Row: Ref Log */}
              <motion.div 
                style={{ y: refY }}
                className="flex justify-start md:justify-end mb-6 font-mono text-[10px] tracking-[0.2em] text-orange-500/50 group-hover:text-orange-500 transition-colors overflow-hidden"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={active ? { y: "0%" } : {}}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                  <ScrambledRef value={`REF_L_00${index + 1}`} active={isRevealed} isHovered={isHovered} />
                </motion.div>
              </motion.div>

              {/* Flex Content Layout: Text & Circle Icon */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <motion.h3 
                    style={{ y: titleY }}
                    className="text-2xl md:text-[1.75rem] font-sans font-semibold tracking-tight text-white group-hover:text-orange-400 transition-colors duration-300"
                  >
                    {exp.role}
                  </motion.h3>

                  <div className="flex items-center gap-3">
                    <p className="text-xs font-sans font-medium text-orange-500 uppercase tracking-widest">{exp.company}</p>
                  </div>

                  <ScrollReveal
                    preset="word-by-word"
                    className="text-[15px] md:text-base font-sans font-normal text-gray-400 leading-[1.75] max-w-[440px]"
                  >
                    {exp.desc}
                  </ScrollReveal>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-orange-500/5 border border-orange-500/15 rounded-md text-[9px] font-mono uppercase tracking-[0.1em] text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Circular Icon Container */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-orange-500/20 bg-orange-500/[0.02] flex items-center justify-center relative shadow-[inset_0_0_15px_rgba(249,115,22,0.15)] group-hover:border-orange-500/40 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-500 shrink-0 self-center sm:self-auto">
                  <IconComponent className="text-orange-500 w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* CENTER COLUMN (Spine) */}
      <div className="relative h-full flex items-center justify-center min-h-[60px] md:min-h-0">
        {/* Node with Double Circle styling */}
        <div className="relative z-20">
          <motion.div 
            animate={{
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "w-6 h-6 rounded-full border-2 border-orange-500/40 bg-black flex items-center justify-center transition-all duration-300",
              active && "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            )}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", active ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "bg-gray-800")} />
          </motion.div>
        </div>

        {/* Date / Month Label & Pointer */}
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs tracking-wider uppercase text-orange-500 flex items-center gap-1.5 z-20",
          isLeft 
            ? "left-1/2 ml-5 justify-start" 
            : "right-1/2 mr-5 justify-end"
        )}>
          {isLeft ? (
            <>
              <span className="text-orange-500/70 text-[10px]">◀</span>
              <span>{exp.date || exp.year}</span>
            </>
          ) : (
            <>
              <span>{exp.date || exp.year}</span>
              <span className="text-orange-500/70 text-[10px]">▶</span>
            </>
          )}
        </div>

        {/* Connector Line to Card */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ originX: isLeft ? 1 : 0 }}
          className={cn(
            "hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] w-12 bg-orange-500/40 z-10",
            isLeft ? "right-1/2 mr-3" : "left-1/2 ml-3"
          )}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className={cn("flex flex-col md:h-full justify-center w-full", !isLeft ? "items-start text-left pl-0 md:pl-12 z-20" : "hidden md:block opacity-0 pointer-events-none")}>
        {!isLeft && (
          <div className="max-w-[640px] w-full relative">
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ x: shouldReduceMotion ? 0 : 24, y: 16, opacity: 0, filter: "blur(10px)", scale: 0.98 }}
              animate={active ? { x: 0, y: 0, opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative p-8 md:p-10 rounded-2xl border border-white/10 overflow-hidden group min-h-[240px]",
                "transition-all duration-500 bg-[#0c0c0e]/80 backdrop-blur-xl",
                isHovered && "bg-gradient-to-br from-orange-500/[0.03] to-transparent border-white/15"
              )}
              style={{ 
                background: "linear-gradient(135deg, rgba(249,115,22,0.03) 0%, transparent 60%, rgba(255,255,255,0.01) 100%), rgba(12,12,14,0.8)"
              }}
            >
              {/* Glowing Bottom-Right Corner Border */}
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-orange-500 rounded-br-2xl pointer-events-none shadow-[3px_3px_15px_rgba(249,115,22,0.4)]" />

              {/* Large faint chapter numeral - editorial rhythm marker, scales to any card count */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 left-6 select-none font-sans text-7xl md:text-8xl font-bold tabular-nums text-white/[0.04] transition-colors duration-500 group-hover:text-orange-500/[0.07]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Scan Sweep Effect */}
              {isHovered && (
                <motion.div 
                  initial={{ top: "0%", opacity: 1 }}
                  animate={{ top: "100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-[3px] bg-orange-500/10 z-10 pointer-events-none"
                />
              )}

              {/* Top Row: Ref Log */}
              <motion.div 
                style={{ y: refY }}
                className="flex justify-start mb-6 font-mono text-[10px] tracking-[0.2em] text-orange-500/50 group-hover:text-orange-500 transition-colors overflow-hidden"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={active ? { y: "0%" } : {}}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                  <ScrambledRef value={`REF_L_00${index + 1}`} active={isRevealed} isHovered={isHovered} />
                </motion.div>
              </motion.div>

              {/* Flex Content Layout: Text & Circle Icon */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <motion.h3 
                    style={{ y: titleY }}
                    className="text-2xl md:text-[1.75rem] font-sans font-semibold tracking-tight text-white group-hover:text-orange-400 transition-colors duration-300"
                  >
                    {exp.role}
                  </motion.h3>

                  <div className="flex items-center gap-3">
                    <p className="text-xs font-sans font-medium text-orange-500 uppercase tracking-widest">{exp.company}</p>
                  </div>

                  <ScrollReveal
                    preset="word-by-word"
                    className="text-[15px] md:text-base font-sans font-normal text-gray-400 leading-[1.75] max-w-[440px]"
                  >
                    {exp.desc}
                  </ScrollReveal>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-orange-500/5 border border-orange-500/15 rounded-md text-[9px] font-mono uppercase tracking-[0.1em] text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Circular Icon Container */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-orange-500/20 bg-orange-500/[0.02] flex items-center justify-center relative shadow-[inset_0_0_15px_rgba(249,115,22,0.15)] group-hover:border-orange-500/40 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-500 shrink-0 self-center sm:self-auto">
                  <IconComponent className="text-orange-500 w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

const ExperienceSection = React.forwardRef<HTMLElement>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  React.useImperativeHandle(ref, () => sectionRef.current!);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Scoped to the timeline rows themselves (not the section as a whole, which also
  // includes the iris intro above) so the spine growth and chapter counter track the
  // actual cards being scrolled through, regardless of how long the intro is.
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  const lineHeight = useSpring(timelineProgress, { stiffness: 100, damping: 30 });
  const spineY = useTransform(timelineProgress, [0, 1], ["0px", "-40px"]);

  // The flame at the spine's tip grows as it nears the end of the timeline, foreshadowing
  // the fire-spread handoff into the Projects section right after.
  const flameScale = useTransform(timelineProgress, [0.8, 1], [1, 1.9]);
  const flameGlowOpacity = useTransform(timelineProgress, [0.8, 1], [0.7, 1]);

  // Same pinned-intro formula as the About curtain, but with a shorter 180vh wrapper so
  // less scroll is needed to clear the reveal and reach the timeline rows below.
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start end", "end start"]
  });

  const headerContent = (
    <div className="text-center relative px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-orange-500 font-bold">
          MY JOURNEY
        </span>
      </motion.div>

      <div className="flex items-center justify-center gap-8 mb-6 relative">
        {/* Left Flanking Line */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-500/50 to-transparent" />
        </div>

        <ScrollReveal preset="blur-reveal">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-about font-extrabold uppercase tracking-tight text-white leading-none">
            THE PATH{" "}
            <span className="normal-case font-serif italic font-medium text-gradient-orange text-glow-orange">
              I've Walked
            </span>
          </h2>
        </ScrollReveal>

        {/* Right Flanking Line */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
          <div className="h-[1px] flex-1 bg-gradient-to-l from-orange-500/50 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </div>
      </div>

      <ScrollReveal
        preset="word-by-word"
        className="justify-center text-gray-400 font-sans font-light tracking-wide text-sm md:text-base max-w-2xl mx-auto"
      >
        A timeline of my milestones, learnings and experiences.
      </ScrollReveal>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="panel relative bg-[#060607]"
    >
      {/* Iris reveal - pinned like the About curtain: a pinprick of light widens into a
          tunnel while the header locks in place, "JOURNEY" dissolving to reveal the real
          "THE PATH I'VE WALKED" header underneath before releasing into the timeline */}
      {shouldReduceMotion ? (
        <div className="pt-28 md:pt-44">{headerContent}</div>
      ) : (
        <div ref={introRef} className="relative h-[180vh] w-full">
          <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
            {headerContent}
            <IrisReveal
              progress={introProgress}
              label="JOURNEY"
              caption="Scroll to walk the path"
              openRange={[0.26, 0.4]}
              labelRange={[0.28, 0.42]}
              exitRange={[0.4, 0.5]}
            />
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-28 md:pt-24 md:pb-44">

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* CENTER SPINE */}
          <motion.div 
            style={{ y: spineY }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-orange-950/40 z-0" 
          />
          
          <motion.div 
            style={{ scaleY: lineHeight, y: spineY }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-orange-500 origin-top z-10 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          >
            {/* Progress marker - a flickering flame that intensifies as it nears the end,
                foreshadowing the fire-spread handoff into Projects right after */}
            <motion.div
              style={{ scale: flameScale }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center"
            >
              <motion.div
                style={{ opacity: flameGlowOpacity }}
                className="absolute top-0 w-10 h-16 bg-orange-500/20 blur-xl rounded-full -translate-y-1/2"
              />
              {shouldReduceMotion ? (
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316]" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <span className="ember" style={{ left: -6, width: 3, height: 3, animationDelay: "0s", animationDuration: "1.8s" }} />
                  <span className="ember" style={{ left: 5, width: 2, height: 2, animationDelay: "0.6s", animationDuration: "2.1s" }} />
                  <span className="ember" style={{ left: 0, width: 2, height: 2, animationDelay: "1.1s", animationDuration: "1.6s" }} />

                  {/* Outer flame tongue */}
                  <motion.div
                    animate={{ scaleY: [1, 1.15, 0.92, 1.08, 1], scaleX: [1, 0.9, 1.05, 0.95, 1], rotate: [0, -4, 3, -2, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 w-4 h-11 origin-bottom rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-orange-700 via-orange-500 to-amber-300 shadow-[0_0_20px_#f97316]"
                  />
                  {/* Inner hot core */}
                  <motion.div
                    animate={{ scaleY: [1, 0.9, 1.12, 0.95, 1], scaleX: [1, 1.08, 0.9, 1.05, 1], rotate: [0, 3, -3, 2, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="absolute bottom-0.5 w-2 h-7 origin-bottom rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-amber-500 via-yellow-300 to-white"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Experience Rows */}
          <div className="relative z-20 space-y-16 md:space-y-32">
            {experiences.map((exp, index) => (
              <TimelineItem 
                key={index} 
                exp={exp} 
                index={index} 
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ExperienceSection.displayName = "ExperienceSection";

export default ExperienceSection;
