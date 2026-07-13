import { useRef, useState, useEffect, FC, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent } from "motion/react";
import { Github, Linkedin, Mail, Terminal, MousePointer2, ExternalLink, ChevronDown, Zap, Code } from "lucide-react";
import { cn } from "./lib/utils";
import { BackgroundPaths } from "./components/ui/background-paths";
import { TextEffect } from "./components/ui/text-effect";
import { RabbitHoleReveal } from "./components/ui/rabbit-hole-reveal";
import SplitText from "./components/ui/split-text";

import SolarSystemTech from "./components/SolarSystemTech";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import AswinAIChatbot from "./components/AswinAIChatbot";
import BubbleMenu from "./components/BubbleMenu";
import SmoothScroll from "./components/SmoothScroll";
import ScrollReveal from "./components/ScrollReveal";

const services = [
  { id: '01', title: 'OpenCV' },
  { id: '02', title: 'MediaPipe' },
  { id: '03', title: 'Python' },
  { id: '04', title: 'Flutter' }
];

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'experience', label: 'History' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const bubbleMenuItems = [
  {
    label: 'home',
    href: '#home',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  },
  {
    label: 'about',
    href: '#about',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  },
  {
    label: 'tech',
    href: '#tech',
    ariaLabel: 'Tech',
    rotation: -8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  },
  {
    label: 'history',
    href: '#experience',
    ariaLabel: 'History',
    rotation: 8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  },
  {
    label: 'projects',
    href: '#projects',
    ariaLabel: 'Projects',
    rotation: -8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  },
  {
    label: 'contact',
    href: '#contact',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#f97316', textColor: '#000000' }
  }
];

function FrameDisplay({ index, activeIndex }: { index: number, activeIndex: any, key?: number }) {
  const isVisible = useTransform(activeIndex, (v: number) => Math.round(v) === index ? 1 : 0);
  
  return (
    <motion.div 
      style={{ opacity: isVisible }}
      className="absolute inset-0 w-full h-full"
    >
      <img 
        src={`/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`} 
        alt={`Frame ${index}`}
        className="w-full h-full object-cover transition-all duration-300"
        onError={(e) => {
          // Fallback if local images don't exist yet
          e.currentTarget.src = `https://picsum.photos/id/${10 + index}/800/1200`;
        }}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [textTrigger, setTextTrigger] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax Values
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const mainTitleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const secondaryTitleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Hero Parallax Layering
  const backgroundTextY = useTransform(heroScrollProgress, [0, 1], ["0%", "50%"]);
  const codeStreamY = useTransform(heroScrollProgress, [0, 1], ["0%", "-30%"]);
  const frameParallax = useTransform(heroScrollProgress, [0, 1], ["0%", "10%"]);

  // Frame Scrubber Logic
  const framesCount = 144;
  // Hero section is h-[250vh], scrubber cycles over its entire height
  const currentFrame = useTransform(heroScrollProgress, [0, 1], [framesCount - 1, 0]);
  const frameIndex = useSpring(currentFrame, { stiffness: 100, damping: 40 });
  
  // Scrubber Content Animations
  const heroTextOpacity = useTransform(heroScrollProgress, [0, 0.6, 0.9], [1, 1, 0]);
  const heroTextScale = useTransform(heroScrollProgress, [0, 0.9], [1, 0.8]);

  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const smoothAboutProgress = useSpring(aboutScrollProgress, { 
    stiffness: 80, 
    damping: 30,
    restDelta: 0.001 
  });

  // About Section Animations - Refined for clarity and better visibility
  const aboutImageScale = useTransform(aboutScrollProgress, [0, 0.4], [1.05, 1]);
  const aboutImageClip = useTransform(aboutScrollProgress, [0, 0.4], ["inset(5% 5% 5% 5% rounded 20px)", "inset(0% 0% 0% 0% rounded 0px)"]);
  const aboutTextY = useTransform(aboutScrollProgress, [0.1, 0.5], [40, 0]);
  const aboutTextOpacity = useTransform(aboutScrollProgress, [0, 0.4], [0, 1]);
  const aboutHeadingX = useTransform(aboutScrollProgress, [0.1, 0.5], [-30, 0]);

  const techRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: techScrollProgress } = useScroll({
    target: techRef,
    offset: ["start end", "end start"]
  });

  const techStack = [
    // Web Development
    { name: "Node.js", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Three.js", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
    { name: "React", category: "Web Development", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "WebGL", category: "Web Development", icon: "https://brandeps.com/logo-download/W/WebGL-logo-vector-01.svg" },
    
    // Computer Vision
    { name: "OpenCV", category: "Computer Vision", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
    { name: "YOLO", category: "Computer Vision", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1a/YOLO_Logo.png" },
    { name: "MediaPipe", category: "Computer Vision", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Google_MediaPipe_logo.png" },
    { name: "Point Cloud", category: "Computer Vision", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    
    // Machine Learning
    { name: "PyTorch", category: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "TensorFlow", category: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    { name: "Scikit-Learn", category: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Keras", category: "Machine Learning", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg" },

    // Core Principles
    { name: "Algorithms", category: "Core", icon: "" },
    { name: "Data Structures", category: "Core", icon: "" },
    { name: "System Design", category: "Core", icon: "" },
  ];

  const contactRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: contactScrollProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end start"]
  });

  useMotionValueEvent(aboutScrollProgress, "change", (progress) => {
    if (progress > 0.45 && !textTrigger) {
      setTextTrigger(true);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const panels = Array.from(document.querySelectorAll<HTMLElement>(".panel"));
      const scrollPos = window.scrollY + window.innerHeight * 0.4; // Detection threshold at 40% of viewport
      
      let currentSection = activeSection;
      panels.forEach((panel) => {
         if (scrollPos >= panel.offsetTop) {
           currentSection = panel.id;
         }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  return (
    <div ref={containerRef} className="relative bg-[#030303] text-white selection:bg-orange-500/30 noise-overlay">
      <SmoothScroll />
      
      {/* Navigation */}
      <BubbleMenu
        items={bubbleMenuItems}
        menuAriaLabel="Toggle navigation"
        menuBg="#0c0c0e"
        menuContentColor="#ffffff"
        useFixedPosition={true}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
      />

      {/* Hero Section - Scrubber Enabled */}
      <section ref={heroRef} id="home" className="panel relative h-[250vh] bg-black z-10 border-b border-white/5">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 h-screen overflow-hidden"
        >
          {/* Parallax Layer 1: Ambient Background Text */}
          <motion.div 
            style={{ y: backgroundTextY, opacity: heroTextOpacity }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            <h2 className="text-[35vw] font-black text-white/[0.02] tracking-tighter uppercase select-none">
              ASWIN
            </h2>
          </motion.div>

          {/* Parallax Layer 2: Main Scrubber */}
          <motion.div 
            style={{ y: frameParallax }}
            className="absolute inset-0 z-[1]"
          >
            <div className="w-full h-full relative">
              {[...Array(framesCount)].map((_, i) => (
                <FrameDisplay 
                  key={i} 
                  index={i} 
                  activeIndex={frameIndex} 
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-90 z-10" />
              <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-black via-black/20 to-transparent opacity-80 z-10" />
              <div className="absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              {/* Face Lighting Accent Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.08)_0%,transparent_50%)] z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Parallax Layer 3: Code Stream Overlay */}
          <motion.div 
            style={{ y: codeStreamY }}
            className="absolute top-0 right-10 bottom-0 w-64 z-[15] pointer-events-none opacity-20 hidden lg:block overflow-hidden"
          >
            <div className="flex flex-col gap-4 font-mono text-[8px] text-orange-500/50 uppercase leading-none whitespace-nowrap">
              {[...Array(100)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <span>0x{Math.random().toString(16).slice(2, 6)}</span>
                  <span>INIT_PROTOCOL_V{i}</span>
                  <span>STATUS: {Math.random() > 0.5 ? 'ACTIVE' : 'IDLE'}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Lighting Overlays */}
          <div className="absolute inset-0 z-[5] pointer-events-none">
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-orange-500/10 blur-[150px] rounded-full" 
            />
          </div>

          {/* HUD Accents */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-[25%] left-[22%] w-4 h-4 rounded-full border border-orange-500/50 flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
            </motion.div>
          </div>

          {/* Hero Content with Parallax */}
          <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 lg:px-20">
              {/* Hero Content with Parallax and Reorganized Layout */}
              <motion.div 
                style={{ opacity: heroTextOpacity, scale: heroTextScale, y: mainTitleY }}
                className="max-w-7xl w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  {/* Left Column: Name and Typing Reveal Text */}
                  <div className="flex flex-col items-start gap-12">
                    <div className="flex flex-col items-start">
                      <div className="overflow-hidden mb-2">
                        <motion.h1
                          initial={{ y: "100%", opacity: 0, filter: "blur(20px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                          className="text-[5rem] md:text-[7rem] lg:text-[10rem] font-display uppercase tracking-tighter leading-[0.8] text-glow"
                        >
                          <span className="text-white/90 block">HI I'M</span>
                          <span className="text-gradient-orange text-glow-orange block">ASWIN</span>
                        </motion.h1>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <TextEffect
                          per="char"
                          preset="blur"
                          delay={1}
                          className="text-base md:text-lg font-display tracking-[0.4em] text-white/40 uppercase font-black"
                        >
                          Vision Engineer
                        </TextEffect>
                      </div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1.8 }}
                      className="flex items-center gap-8"
                    >
                      <div className="flex gap-4">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all duration-300">
                          <Github size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all duration-300">
                          <Linkedin size={18} />
                        </a>
                        <a href="mailto:aswinr2k6@gmail.com" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all duration-300">
                          <Mail size={18} />
                        </a>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-white/20" />
                        <span className="text-[9px] uppercase font-mono tracking-[0.3em] text-white/40 font-bold">Connect_Hub</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column: Kept empty to avoid disturbing character visual */}
                  <div className="hidden lg:block h-full" />
                </div>
              </motion.div>
          </div>

          {/* Stats Bar Parallax */}
          <motion.div 
            style={{ y: statsY, opacity: heroTextOpacity }}
            className="absolute bottom-12 inset-x-8 md:inset-x-12 lg:inset-x-20 border-t border-white/10 pt-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {services.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 1.9 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                >
                  <span className="text-[10px] font-black text-orange-500 mb-2 block tracking-widest font-mono">#{s.id}</span>
                  <p className="text-xl md:text-2xl font-bold tracking-tighter uppercase group-hover:text-orange-400 transition-colors">{s.title}</p>
                  <div className="h-[2px] w-8 bg-orange-500 mt-2 group-hover:w-16 transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scrubber Progress Indicator */}
          <div className="absolute bottom-12 right-12 z-30 flex items-center gap-4">
            <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                style={{ scaleX: scrollYProgress }}
                className="h-full bg-orange-500 origin-left"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section - Cinematic Apple-style Reveal */}
      <section
        ref={aboutRef}
        id="about"
        className="panel relative min-h-[300vh] bg-black z-20"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

          {/* Rabbit-hole curtain: splits open over the section's own scroll progress,
              revealing the real About content underneath - no separate pinned section needed */}
          <RabbitHoleReveal progress={aboutScrollProgress} topText="ABOUT" bottomText="ME" />

          {/* Phase 1: Large Background Text (Behind Portrait) */}
          <motion.div 
            style={{ 
              opacity: useTransform(smoothAboutProgress, [0.05, 0.25, 0.8, 0.95], [0, 0.15, 0.15, 0]),
              scale: useTransform(smoothAboutProgress, [0.05, 0.45], [0.85, 1.2]),
              filter: useTransform(smoothAboutProgress, [0.05, 0.45], ["blur(40px)", "blur(0px)"]),
              y: useTransform(smoothAboutProgress, [0, 1], [150, -150])
            }}
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden"
          >
            <h2 className="text-[15rem] md:text-[25rem] font-display uppercase tracking-tighter leading-none text-orange-500/20 whitespace-nowrap">
              ABOUT ME
            </h2>
          </motion.div>

          {/* Background Ambient Accents */}
          <motion.div 
            style={{ opacity: useTransform(aboutScrollProgress, [0, 0.2, 0.8, 0.95], [0, 1, 1, 0]) }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <div className="absolute top-0 inset-x-0 h-2/3 bg-gradient-to-b from-orange-500/10 to-transparent blur-[140px]" />
            <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-blue-500/5 to-transparent blur-[140px]" />
          </motion.div>

          {/* Animated Background Paths - Wave Effect */}
          <motion.div 
            style={{ 
              opacity: useTransform(smoothAboutProgress, [0.1, 0.3, 0.9], [0, 0.65, 0.65]),
              filter: "blur(2px)",
              scale: useTransform(smoothAboutProgress, [0.1, 0.9], [1, 1.15]),
              y: useTransform(smoothAboutProgress, [0.2, 0.8], [50, -50])
            }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <BackgroundPaths />
          </motion.div>

          {/* Main Visual: Portrait Reveal with Lens Sweep */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] items-center gap-12 lg:gap-24">
            
            {/* Cinematic Portrait Card */}
            <motion.div 
              style={{
                y: useTransform(smoothAboutProgress, [0.2, 0.8], [30, -30])
              }}
              className="relative flex justify-center items-center perspective-[3000px] z-10 pointer-events-none h-full"
            >
              <motion.div 
                style={{ 
                  scale: useTransform(smoothAboutProgress, [0.1, 0.4, 0.9], [1.2, 1, 1]),
                  opacity: useTransform(smoothAboutProgress, [0.1, 0.25, 0.95], [0, 1, 1]),
                  rotateY: useTransform(smoothAboutProgress, [0.15, 0.4, 0.7], [-25, 0, 5]),
                  rotateX: useTransform(smoothAboutProgress, [0.15, 0.4, 0.7], [15, 0, -3]),
                  z: useTransform(smoothAboutProgress, [0.1, 0.5], [-600, 30]),
                  filter: useTransform(smoothAboutProgress, [0.1, 0.4], ["blur(15px) contrast(110%)", "blur(0px) contrast(100%)"]),
                  clipPath: useTransform(smoothAboutProgress, [0.1, 0.45], ["inset(20% round 32px)", "inset(0% round 32px)"])
                }}
                whileHover={{ 
                  scale: 1.05,
                  z: 150,
                  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
                }}
                className="relative w-full max-w-[400px] md:max-w-[480px] aspect-[4/5] preserve-3d pointer-events-auto cursor-none group"
              >
                {/* Neon HUD Frame */}
                <motion.div 
                  style={{ 
                    opacity: useTransform(smoothAboutProgress, [0.3, 0.4], [0, 1]),
                    scale: useTransform(smoothAboutProgress, [0.3, 0.4], [0.95, 1])
                  }}
                  className="absolute -inset-4 md:-inset-8 z-[-1] pointer-events-none"
                >
                  {/* Outer Pulsing Glow */}
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      boxShadow: [
                        "0 0 20px rgba(249, 115, 22, 0.1), inset 0 0 10px rgba(249, 115, 22, 0.1)",
                        "0 0 40px rgba(249, 115, 22, 0.3), inset 0 0 20px rgba(249, 115, 22, 0.2)",
                        "0 0 20px rgba(249, 115, 22, 0.1), inset 0 0 10px rgba(249, 115, 22, 0.1)"
                      ]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="absolute inset-0 border-[3px] border-orange-500/30 rounded-[2.5rem] md:rounded-[3.5rem]"
                  />
                  
                  {/* Sharp Neon Edge */}
                  <div className="absolute inset-0 border border-orange-500/60 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
                  
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl shadow-[0_0_15px_rgba(249,115,22,1)]" />
                  <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-orange-500 rounded-tr-3xl shadow-[0_0_15px_rgba(249,115,22,1)]" />
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-orange-500 rounded-bl-3xl shadow-[0_0_15px_rgba(249,115,22,1)]" />
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-orange-500 rounded-br-3xl shadow-[0_0_15px_rgba(249,115,22,1)]" />

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 py-1 border border-orange-500/40 rounded-full backdrop-blur-md">
                    <span className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] text-orange-500 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">Subject_Scan_001</span>
                  </div>
                </motion.div>
                
                <div className="relative w-full h-full overflow-hidden rounded-3xl border-2 border-white/5 bg-black transition-all duration-500 shadow-2xl">
                  <img 
                    src="/aswin_profile.jpg" 
                    alt="Aswin R."
                    className="w-full h-full object-cover brightness-100 contrast-100 saturate-100 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
                  
                  {/* Dynamic Lens Sweep */}
                  <motion.div 
                    style={{ 
                      x: useTransform(smoothAboutProgress, [0.2, 0.5], ["-150%", "150%"]),
                      background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.15), transparent)"
                    }}
                    className="absolute inset-0 skew-x-12 z-20"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Cinematic Text Content */}
            <motion.div 
              style={{
                y: useTransform(smoothAboutProgress, [0.2, 0.8], [-20, 20])
              }}
              className="relative flex flex-col justify-center pointer-events-auto"
            >
              <motion.div 
                style={{ 
                  opacity: useTransform(aboutScrollProgress, [0.3, 0.5, 0.95], [0, 1, 1]),
                  x: useTransform(aboutScrollProgress, [0.3, 0.5, 0.95], [40, 0, 0]), 
                }}
                className="space-y-10 lg:space-y-14"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      style={{ width: useTransform(aboutScrollProgress, [0.35, 0.45], [0, 48]) }}
                      className="h-[1px] bg-orange-500 shadow-[0_0_20px_#f97316]" 
                    />
                    <span className="text-[12px] uppercase tracking-[0.8em] text-orange-500 font-black opacity-60">Architect_Profile</span>
                  </div>

                  <div className="space-y-8">
                    <ScrollReveal preset="blur-reveal" delay={0.15}>
                      <h3 className="text-3xl md:text-5xl font-display uppercase tracking-tight text-white leading-[1.15] max-w-xl">
                        Aspiring{" "}
                        <span className="normal-case font-serif italic font-medium text-gradient-orange">
                          Software Engineer
                        </span>
                        <br />
                        & AI Enthusiast.
                      </h3>
                    </ScrollReveal>

                    <div className="max-w-lg">
                      <SplitText
                        tag="p"
                        text="I am a Computer Science Engineering student (2023–2027) with a proven track record of shipping real-time computer vision systems using Python, OpenCV, and MediaPipe. Having engineered gesture-driven applications at 30+ FPS and presented research at ICRTAC 2024 on Deep Learning for cancer diagnosis, I bridge the gap between complex algorithms and raw digital performance."
                        className="text-base md:text-lg font-about font-bold tracking-tight leading-relaxed text-white/85"
                        splitType="words"
                        from={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                        to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        duration={0.7}
                        delay={18}
                        ease="power3.out"
                        threshold={0.15}
                        rootMargin="-80px"
                        textAlign="left"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Plateau: Interactive Section */}
                <motion.div 
                  style={{ 
                    opacity: useTransform(aboutScrollProgress, [0.55, 0.65, 0.95], [0, 1, 1]),
                    y: useTransform(aboutScrollProgress, [0.55, 0.65], [20, 0])
                  }}
                  className="flex justify-start lg:justify-center pt-8"
                >
                  <motion.a 
                    href="/cv.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center gap-6 px-10 py-4 border-2 border-orange-500/50 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.1)] hover:border-orange-500 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)]"
                  >
                    {/* Background Shimmer Effect */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    
                    {/* Hover Background Fill */}
                    <div className="absolute inset-0 z-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <motion.span 
                      initial={{ letterSpacing: "0.3em" }}
                      whileHover={{ letterSpacing: "0.5em" }}
                      className="relative z-10 text-[13px] md:text-[15px] uppercase font-black text-orange-500 group-hover:text-black transition-colors duration-500 flex items-center gap-4"
                    >
                      View CV
                    </motion.span>
                    
                    <div className="relative z-10 flex items-center justify-center">
                      <ExternalLink 
                        size={20} 
                        className="text-orange-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" 
                      />
                    </div>

                    {/* Corner Accents - Minimalist Neon */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Pulsing Border Line */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        boxShadow: [
                          "0 0 10px rgba(249, 115, 22, 0.2)", 
                          "0 0 20px rgba(249, 115, 22, 0.4)", 
                          "0 0 10px rgba(249, 115, 22, 0.2)"
                        ] 
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-[1px] border border-orange-500/20 rounded-[inherit] pointer-events-none"
                    />
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>


      <SolarSystemTech ref={techRef} />

      <ExperienceSection ref={experienceRef} />

      <ProjectsSection />

      {/* Contact Section */}
      <section 
        ref={contactRef}
        id="contact" 
        className="panel relative min-h-[150vh] z-60 bg-[#030303] flex items-center justify-center"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: false, margin: "-10%" }}
          className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Highlight */}
          <motion.div 
            style={{ 
              opacity: useTransform(contactScrollProgress, [0, 0.5, 1], [0, 0.2, 0]),
              scale: useTransform(contactScrollProgress, [0, 1], [0.8, 1.2])
            }}
            className="absolute w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" 
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              style={{
                opacity: useTransform(contactScrollProgress, [0, 0.3], [0, 1]),
                x: useTransform(contactScrollProgress, [0, 0.3], [-50, 0])
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-orange-500" />
                <span className="text-[10px] font-mono tracking-[0.6em] uppercase text-orange-500">Node_Connect</span>
              </div>
              <ScrollReveal preset="blur-reveal" once={false}>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none mb-8">
                  Initiate <br />
                  <span className="normal-case font-serif italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-orange-500/40">Protocol</span>
                </h2>
              </ScrollReveal>
              <div className="text-lg max-w-md font-light leading-relaxed mb-12">
                <ScrollReveal preset="word-by-word">
                  Available for strategic partnerships, high-stakes development, and cinematic digital engineering.
                </ScrollReveal>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Secure_Mail', value: 'aswinr2k6@gmail.com', href: 'mailto:aswinr2k6@gmail.com' },
                  { icon: Github, label: 'Source_Control', value: 'GitHub / Aswin R', href: 'https://github.com' },
                  { icon: Linkedin, label: 'Professional_Net', value: 'LinkedIn / Aswin R', href: 'https://linkedin.com' }
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 group-hover:text-orange-500 transition-colors">{item.label}</p>
                      <p className="text-sm font-bold uppercase tracking-widest">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{
                opacity: useTransform(contactScrollProgress, [0.2, 0.5], [0, 1]),
                x: useTransform(contactScrollProgress, [0.2, 0.5], [50, 0])
              }}
              className="glass-surface p-12 rounded-3xl border border-white/10 relative overflow-hidden"
            >
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/30 block">Name</label>
                     <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-white/30 block">Email</label>
                     <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors" />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 block">Message</label>
                  <textarea placeholder="How can I help you?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 outline-none transition-colors" />
                </div>
                <button className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-lg hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-white/20">
                  Send Message
                </button>
              </div>

              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5" />
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-2 opacity-20">
            <p className="text-[9px] font-mono uppercase tracking-[0.5em]">System_Version_2026.05.07</p>
            <p className="text-[9px] font-mono uppercase tracking-[0.5em]">Developed_By_Aswin_R</p>
          </div>
        </motion.div>
      </section>

      <AswinAIChatbot />
    </div>
  );
}
