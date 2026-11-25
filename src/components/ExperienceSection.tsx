import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
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
  Code2, 
  Cpu, 
  Trophy, 
  GraduationCap, 
  Presentation, 
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  ExternalLink,
  X,
  Palette
} from "lucide-react";

interface ExperienceItemData {
  year: string;
  date: string;
  role: string;
  company: string;
  location?: string;
  category: string;
  metric?: string;
  image: string;
  imagePosition?: string;
  certificate?: string;
  certificateTitle?: string;
  desc: string;
  highlight?: string;
  tags: string[];
  icon: any;
}

const experiences: ExperienceItemData[] = [
  { 
    year: "2026", 
    date: "AUG – OCT 2026",
    role: "Software Developer", 
    company: "Haio Creations (Startup)", 
    category: "Production Engineering",
    metric: "Production UI & APIs",
    image: "/software_developer.jpg",
    desc: "Engineered responsive web applications and modular UI components in React & Tailwind CSS.", 
    highlight: "Delivered production client pages & integrated frontend with backend REST APIs.",
    tags: ["REACT", "TAILWIND CSS", "REST APIS", "AGILE"],
    icon: Code2
  },
  { 
    year: "2026", 
    date: "JUN – JUL 2026",
    role: "Software Engineering Intern", 
    company: "CapeStart – The Foundry", 
    location: "Nagercoil, Tamil Nadu",
    category: "AI & Data Science Track",
    metric: "85% Score · 5+ Endpoints",
    image: "/capestart_internship.jpg",
    desc: "Built secure multi-tenant RESTful APIs for a student attendance platform using Django REST Framework & MySQL.", 
    highlight: "Engineered 5+ endpoints with JWT auth & RBAC; optimized Django ORM queries.",
    tags: ["DJANGO REST", "MYSQL", "JWT & RBAC", "POSTMAN"],
    icon: Cpu
  },
  { 
    year: "2026", 
    date: "2026",
    role: "Opportunity Pulse — Team Lead", 
    company: "CapeXtreme 2026 National Hackathon", 
    category: "Product Innovation",
    metric: "Top 4 National · Best Presenter",
    image: "/opportunity_pulse_award.jpg",
    imagePosition: "center 15%",
    desc: "Architected a unified opportunity aggregator platform uniting internships, hackathons, and symposiums.", 
    highlight: "Led Team FabFour to Top 4 finish and won Best Presenter Award across 50+ teams.",
    tags: ["FASTAPI", "REACT", "MYSQL", "TOP 4 FINISH"],
    icon: Trophy
  },
  { 
    year: "2024", 
    date: "MAY 2024",
    role: "Research Author & Presenter", 
    company: "ICRTAC 2024 International Conference", 
    category: "Deep Learning Research",
    metric: "International Conference",
    image: "/icrtac_2024_certificate.jpg",
    certificate: "/icrtac_2024_certificate.jpg",
    certificateTitle: "ICRTAC 2024 — Research Paper Presentation Certificate",
    desc: "Presented peer-reviewed research on CNN architectures for early cancer diagnosis from medical imagery.", 
    highlight: "Demonstrated high-precision feature extraction and algorithmic diagnostic reliability.",
    tags: ["DEEP LEARNING", "CNN", "RESEARCH", "ICRTAC"],
    icon: Presentation
  },
  { 
    year: "2025", 
    date: "2025",
    role: "2nd Place — Poster Design", 
    company: "CREZENTA’25 — Dept. of CSE", 
    location: "UCE Nagercoil",
    category: "Technical Symposium",
    metric: "2nd Place 🥈 · CREZENTA’25",
    image: "/crezenta_25_award.jpg",
    imagePosition: "center 28%",
    desc: "Secured 2nd Place in the Poster Design Competition at CREZENTA’25, blending technical precision with storytelling and creative visual communication.", 
    highlight: "Intra-College Technical Symposium organized by the Department of Computer Science & Engineering, University College of Engineering, Nagercoil.",
    tags: ["POSTER DESIGN", "CREZENTA'25", "2ND PLACE 🥈", "VISUAL DESIGN"],
    icon: Palette
  },
  { 
    year: "2023–27", 
    date: "2023 – 2027",
    role: "B.E. Computer Science & Engineering", 
    company: "University College of Engineering", 
    location: "Anna University Constituent",
    category: "Engineering Academics",
    metric: "CGPA 8.11 / 10",
    image: "/uce_nagercoil.jpg",
    desc: "Computer Science engineering student building solid foundations across algorithms, databases, and AI systems.", 
    highlight: "Maintained 8.11 / 10 CGPA while spearheading full-stack and AI software solutions.",
    tags: ["DATA STRUCTURES", "SYSTEMS", "DBMS", "OOP"],
    icon: GraduationCap
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
// REUSABLE CARD CONTENT
// ─────────────────────────────────────────────────────────────────────────────

interface CardContentProps {
  exp: ExperienceItemData;
  index: number;
  isLeft: boolean;
  active: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  titleY: any;
  refY: any;
  isRevealed: boolean;
  shouldReduceMotion: boolean | null;
  onOpenCertificate?: (src: string, title: string) => void;
}

const ExperienceCard: React.FC<CardContentProps> = ({
  exp,
  index,
  isLeft,
  active,
  isHovered,
  setIsHovered,
  titleY,
  refY,
  isRevealed,
  shouldReduceMotion,
  onOpenCertificate,
}) => {
  const IconComponent = exp.icon;

  return (
    <div 
      className="max-w-[560px] w-full relative text-left"
      style={{ perspective: "1000px" }}
    >
      {/* Radiant backlight aura on card reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={active ? { opacity: [0, 0.45, 0.15], scale: [0.85, 1.08, 1] } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500/25 via-amber-500/15 to-orange-500/25 blur-xl pointer-events-none z-0"
      />

      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{
          x: shouldReduceMotion ? 0 : (isLeft ? -50 : 50),
          y: 40,
          rotateY: shouldReduceMotion ? 0 : (isLeft ? -8 : 8),
          rotateX: 4,
          opacity: 0,
          filter: "blur(8px)",
          scale: 0.92
        }}
        animate={
          active 
            ? { 
                x: 0, 
                y: 0, 
                rotateY: 0,
                rotateX: 0,
                opacity: 1, 
                filter: "blur(0px)", 
                scale: 1 
              } 
            : {}
        }
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative p-5 sm:p-6 rounded-2xl border border-white/10 overflow-hidden group text-left will-change-transform",
          // Only transition border/shadow via CSS; opacity/transform/filter are driven by framer-motion
          "transition-[border-color,box-shadow] duration-500 bg-[#0c0c0e]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]",
          isHovered && "border-orange-500/40 shadow-[0_25px_60px_rgba(249,115,22,0.18)]"
        )}
        style={{ 
          background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, transparent 60%, rgba(255,255,255,0.01) 100%), rgba(12,12,14,0.95)"
        }}
      >
        {/* Holographic Laser Scanline Reveal: sweeps across card when unlocked */}
        <motion.div
          initial={{ top: "-5%", opacity: 0 }}
          animate={active ? { top: ["0%", "105%"], opacity: [0, 1, 1, 0] } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeInOut" }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_15px_#f97316] z-30 pointer-events-none"
        />

        {/* Glowing Corner Accents */}
        {isLeft ? (
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-orange-500/80 rounded-tl-2xl pointer-events-none shadow-[-3px_-3px_15px_rgba(249,115,22,0.4)]" />
        ) : (
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-orange-500/80 rounded-br-2xl pointer-events-none shadow-[3px_3px_15px_rgba(249,115,22,0.4)]" />
        )}

        {/* Large faint chapter numeral */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-3 select-none font-sans text-6xl md:text-7xl font-bold tabular-nums text-white/[0.03] transition-colors duration-500 group-hover:text-orange-500/[0.08]",
            isLeft ? "right-5" : "left-5"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Scan Sweep Effect on hover */}
        {isHovered && (
          <motion.div 
            initial={{ top: "0%", opacity: 1 }}
            animate={{ top: "100%", opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-x-0 h-[2px] bg-orange-500/25 z-20 pointer-events-none"
          />
        )}

        {/* Clean Thematic Image Banner with zoom reveal */}
        <div 
          onClick={() => {
            if (exp.certificate) {
              onOpenCertificate?.(exp.certificate, exp.certificateTitle || exp.role);
            }
          }}
          className={cn(
            "relative overflow-hidden rounded-xl mb-4 h-48 sm:h-52 w-full border border-white/10 group-hover:border-orange-500/30 transition-colors bg-black/40",
            exp.certificate && "cursor-pointer group/cert"
          )}
        >
          <motion.div
            initial={{ scale: 1.15, filter: "brightness(0.65)" }}
            animate={active ? { scale: 1, filter: "brightness(1)" } : {}}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <img 
              src={exp.image} 
              alt={exp.role} 
              loading="lazy"
              style={{ objectPosition: exp.imagePosition || "center" }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </motion.div>
          {exp.certificate && (
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 rounded-full bg-orange-500 text-black font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                <Award size={12} />
                Click to expand certificate
              </span>
            </div>
          )}
        </div>

        {/* Role & Organization - Staggered reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="space-y-1 mb-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <motion.h3 
              style={{ y: titleY }}
              className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug"
            >
              {exp.role}
            </motion.h3>
            <span className="md:hidden text-[10px] font-mono uppercase tracking-wider text-orange-400/80 font-bold whitespace-nowrap">
              {exp.date}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-sans font-medium text-orange-500">
            <span className="uppercase tracking-widest font-semibold">{exp.company}</span>
            {exp.location && (
              <span className="text-white/40 flex items-center gap-1 font-normal text-[11px]">
                <MapPin size={11} className="text-orange-500/70" />
                {exp.location}
              </span>
            )}
          </div>
        </motion.div>

        {/* Minimized Concise Description */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="text-[13px] sm:text-[13.5px] font-sans font-normal text-gray-300 leading-relaxed mb-3"
        >
          {exp.desc}
        </motion.p>

        {/* Worthy Key Highlight */}
        {exp.highlight && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
            className="flex items-start gap-2 text-[12px] text-gray-300/90 leading-relaxed font-sans mb-3 pt-2.5 border-t border-white/5"
          >
            <span className="text-orange-500 text-[9px] mt-1 flex-shrink-0">◆</span>
            <span className="text-white/80 font-medium">{exp.highlight}</span>
          </motion.div>
        )}

        {/* View Certificate Action Option */}
        {exp.certificate && (
          <div className="mb-3.5 pt-2 border-t border-white/5 flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCertificate?.(exp.certificate!, exp.certificateTitle || exp.role);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-black font-mono text-[10px] uppercase tracking-wider font-bold transition-all duration-300 shadow-[0_0_12px_rgba(249,115,22,0.15)] group/btn cursor-pointer"
            >
              <Award size={13} className="text-orange-400 group-hover/btn:text-black transition-colors" />
              <span>View Certificate</span>
              <ExternalLink size={11} className="text-orange-400/70 group-hover/btn:text-black transition-colors" />
            </button>
          </div>
        )}

        {/* Footer: Tech Stack Tags & Icon Component */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between gap-3 pt-2.5 border-t border-white/5"
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {exp.tags.map((tag: string) => (
              <span 
                key={tag}
                className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded text-[9px] font-mono uppercase tracking-[0.1em] text-orange-400/90 group-hover:border-orange-500/30 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="w-9 h-9 rounded-lg border border-orange-500/25 bg-orange-500/[0.04] flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_10px_rgba(249,115,22,0.15)] group-hover:border-orange-500/50 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300">
            <IconComponent className="text-orange-500 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE ITEM
// ─────────────────────────────────────────────────────────────────────────────

const TimelineItem = ({ 
  exp, 
  index, 
  scrollYProgress,
  onOpenCertificate
}: { 
  exp: ExperienceItemData, 
  index: number, 
  scrollYProgress: any,
  onOpenCertificate?: (src: string, title: string) => void
}) => {
  const isLeft = index % 2 === 0;
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.1, margin: "0px 0px -8% 0px" });
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

  return (
    <div ref={itemRef} className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] min-h-0 md:min-h-[40vh] items-center relative gap-6 md:gap-0">
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
      <div className={cn("flex flex-col md:h-full justify-center w-full", isLeft ? "items-start text-left md:items-end md:text-left pr-0 md:pr-12 z-20" : "hidden md:block opacity-0 pointer-events-none")}>
        {isLeft && (
          <ExperienceCard
            exp={exp}
            index={index}
            isLeft={true}
            active={active}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            titleY={titleY}
            refY={refY}
            isRevealed={isRevealed}
            shouldReduceMotion={shouldReduceMotion}
            onOpenCertificate={onOpenCertificate}
          />
        )}
      </div>

      {/* CENTER COLUMN (Spine) */}
      <div className="relative h-full flex items-center justify-center min-h-[40px] md:min-h-0">
        {/* Node with Double Circle styling & Active Pulse Ring */}
        <div className="relative z-20">
          {active && (
            <motion.span
              initial={{ scale: 1, opacity: 0.85 }}
              animate={{ scale: [1, 2.3], opacity: [0.85, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute inset-0 rounded-full border border-orange-500 pointer-events-none"
            />
          )}
          <motion.div 
            animate={{
              scale: isHovered ? 1.25 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "w-6 h-6 rounded-full border-2 border-orange-500/40 bg-black flex items-center justify-center transition-[border-color,box-shadow] duration-300",
              active && "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
            )}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", active ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.9)]" : "bg-gray-800")} />
          </motion.div>
        </div>

        {/* Date / Month Label & Pointer (Desktop) */}
        <div className={cn(
          "hidden md:flex absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs tracking-wider uppercase text-orange-500 items-center gap-1.5 z-20",
          isLeft 
            ? "left-1/2 ml-5 justify-start" 
            : "right-1/2 mr-5 justify-end"
        )}>
          {isLeft ? (
            <>
              <span className="text-orange-500/70 text-[10px]">◀</span>
              <span className="font-bold">{exp.date}</span>
            </>
          ) : (
            <>
              <span className="font-bold">{exp.date}</span>
              <span className="text-orange-500/70 text-[10px]">▶</span>
            </>
          )}
        </div>

        {/* Connector Line to Card */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          style={{ originX: isLeft ? 1 : 0 }}
          className={cn(
            "hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] w-12 bg-gradient-to-r from-orange-500/80 to-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.5)] z-10",
            isLeft ? "right-1/2 mr-3" : "left-1/2 ml-3"
          )}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className={cn("flex flex-col md:h-full justify-center w-full", !isLeft ? "items-start text-left pl-0 md:pl-12 z-20" : "hidden md:block opacity-0 pointer-events-none")}>
        {!isLeft && (
          <ExperienceCard
            exp={exp}
            index={index}
            isLeft={false}
            active={active}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            titleY={titleY}
            refY={refY}
            isRevealed={isRevealed}
            shouldReduceMotion={shouldReduceMotion}
            onOpenCertificate={onOpenCertificate}
          />
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
  const [activeCertificate, setActiveCertificate] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCertificate(null);
    };
    if (activeCertificate) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeCertificate]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  const lineHeight = useSpring(timelineProgress, { stiffness: 100, damping: 30 });
  const spineY = useTransform(timelineProgress, [0, 1], ["0px", "-40px"]);

  const flameScale = useTransform(timelineProgress, [0.8, 1], [1, 1.3]);
  const flameGlowOpacity = useTransform(timelineProgress, [0.8, 1], [0.8, 1]);

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
          CAREER &amp; MILESTONES
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
              I've Built
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
        A proven progression of startup engineering, multi-tenant API systems, international research, and national awards.
      </ScrollReveal>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="panel relative bg-[#060607] overflow-x-clip"
    >
      {shouldReduceMotion ? (
        <div className="pt-28 md:pt-44">{headerContent}</div>
      ) : (
        <div ref={introRef} className="relative h-[180vh] w-full">
          <div className="sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 md:pt-24 md:pb-14">

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
            {/* Progress marker */}
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
          <div className="relative z-20 space-y-12 sm:space-y-16 md:space-y-32">
            {experiences.map((exp, index) => (
              <TimelineItem 
                key={index} 
                exp={exp} 
                index={index} 
                scrollYProgress={scrollYProgress}
                onOpenCertificate={(src, title) => setActiveCertificate({ src, title })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Smooth transition into Projects Section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-12 bg-orange-500/15 blur-[60px] pointer-events-none z-10" />

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10"
            data-lenis-prevent
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCertificate(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[92dvh] flex flex-col bg-[#0d0d0f] border border-orange-500/35 rounded-2xl shadow-[0_25px_70px_rgba(249,115,22,0.2)] overflow-hidden z-10"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-black/80 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white/90 font-bold truncate max-w-[240px] sm:max-w-md">
                    {activeCertificate.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeCertificate.src}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 hover:border-orange-500 text-orange-400 hover:text-black font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300"
                  >
                    <ExternalLink size={12} />
                    Open Full
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveCertificate(null)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-black border border-white/10 flex items-center justify-center text-white/70 transition-all duration-300 cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Certificate Image View */}
              <div className="overflow-auto p-3 sm:p-6 flex items-center justify-center bg-black/50">
                <img
                  src={activeCertificate.src}
                  alt={activeCertificate.title}
                  className="max-h-[75dvh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
});

ExperienceSection.displayName = "ExperienceSection";

export default ExperienceSection;
