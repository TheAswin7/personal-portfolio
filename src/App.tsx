import { useRef, useState, useEffect, useMemo, useCallback, lazy, Suspense, FormEvent } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { BackgroundPaths } from "./components/ui/background-paths";
import { TextEffect } from "./components/ui/text-effect";
import { RabbitHoleReveal } from "./components/ui/rabbit-hole-reveal";

import SolarSystemTech from "./components/SolarSystemTech";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import { useMediaQuery } from "./hooks/useMediaQuery";
import BubbleMenu from "./components/BubbleMenu";
import SmoothScroll from "./components/SmoothScroll";
import ScrollReveal from "./components/ScrollReveal";

// Not needed for first paint: load these in separate chunks
const AswinAIChatbot = lazy(() => import("./components/AswinAIChatbot"));
const CVModal = lazy(() => import("./components/CVModal"));

const services = [
  { id: '01', title: 'OpenCV' },
  { id: '02', title: 'MediaPipe' },
  { id: '03', title: 'Python' },
  { id: '04', title: 'Flutter' }
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

// Single <canvas> scrubber: frames are preloaded once and drawn on demand, instead of
// mounting 144 stacked <img> elements that each re-evaluate on every scroll tick.
function FrameScrubber({ activeIndex, count }: { activeIndex: MotionValue<number>, count: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef(-1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || canvas.width === 0) return;

    const target = Math.min(count - 1, Math.max(0, Math.round(activeIndex.get())));
    // Use the requested frame, or the nearest already-loaded one while the rest stream in.
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < count && !img; d++) {
      for (const i of [target - d, target + d]) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
    }
    if (!img) return;

    // object-cover behaviour
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }, [activeIndex, count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(count);
    imagesRef.current = images;
    // Scrolling plays the sequence from the last frame to the first, so load in that order.
    for (let i = count - 1; i >= 0; i--) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!cancelled) draw();
      };
      img.src = `/frames/ezgif-frame-${(i + 1).toString().padStart(3, "0")}.jpg`;
      images[i] = img;
    }
    return () => {
      cancelled = true;
      images.forEach((im) => {
        im.onload = null;
      });
    };
  }, [count, draw]);

  useMotionValueEvent(activeIndex, "change", (v) => {
    const i = Math.round(v);
    if (i !== lastDrawn.current) {
      lastDrawn.current = i;
      draw();
    }
  });

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCVOpen, setIsCVOpen] = useState(false);

  // Static decorative stream: generated once so it never flickers on re-render.
  const codeStreamRows = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        hex: Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0"),
        status: Math.random() > 0.5 ? "ACTIVE" : "IDLE",
        i,
      })),
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const accessKey = ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string) || "YOUR_ACCESS_KEY_HERE";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message,
          from_name: "Aswin Portfolio Contact Form",
          subject: `New Portfolio Message from ${name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus("success");
        form.reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        // Fallback to mailto if key is missing or failed
        window.location.href = `mailto:aswinr2k6@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
        setSubmitStatus("error");
      }
    } catch {
      // Fallback to mailto on network error
      window.location.href = `mailto:aswinr2k6@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax Values
  const mainTitleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const isMobile = useMediaQuery("(max-width: 768px)");
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

  const techRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLElement>(null);

  const contactRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: contactScrollProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end start"]
  });

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
      <section ref={heroRef} id="home" className="panel relative h-[200vh] md:h-[250vh] bg-black z-10 border-b border-white/5">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 h-dvh overflow-hidden"
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
              <FrameScrubber activeIndex={frameIndex} count={framesCount} />
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
              {codeStreamRows.map((row) => (
                <div key={row.i} className="flex gap-4">
                  <span>0x{row.hex}</span>
                  <span>INIT_PROTOCOL_V{row.i}</span>
                  <span>STATUS: {row.status}</span>
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
              className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-orange-500/10 blur-[80px] md:blur-[150px] rounded-full"
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
                          className="group text-[5rem] md:text-[7rem] lg:text-[10rem] font-display uppercase tracking-tighter leading-[0.8] text-glow"
                        >
                          {/* HI I'M — white by default; on hover an orange fill is *revealed*
                              across it with a left-to-right wipe (and ASWIN does the reverse) */}
                          <span className="relative block w-fit cursor-default">
                            <span className="block text-white/90 transition-colors duration-500">HI I'M</span>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 block text-gradient-orange text-glow-orange [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0_0_0_0)]"
                            >
                              HI I'M
                            </span>
                          </span>
                          <span className="relative block w-fit cursor-default">
                            <span className="block text-gradient-orange text-glow-orange">ASWIN</span>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 block text-white/90 text-glow [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0_0_0_0)]"
                            >
                              ASWIN
                            </span>
                          </span>
                        </motion.h1>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <TextEffect
                          per="char"
                          preset="blur"
                          delay={1}
                          className="text-base md:text-lg font-display tracking-[0.4em] text-white/40 uppercase font-black"
                        >
                          AI Engineer
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
                        <a href="https://github.com/TheAswin7" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-[background-color,color,border-color] duration-300">
                          <Github size={18} />
                        </a>
                        <a href="https://linkedin.com/in/raswin7" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-[background-color,color,border-color] duration-300">
                          <Linkedin size={18} />
                        </a>
                        <a href="mailto:aswinr2k6@gmail.com" aria-label="Email" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black hover:border-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-[background-color,color,border-color] duration-300">
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
        className="panel relative min-h-[240vh] md:min-h-[300vh] bg-black z-20"
      >
        <div className="sticky top-0 h-dvh w-full flex items-center justify-center overflow-hidden">

          {/* Rabbit-hole curtain: splits open over the section's own scroll progress,
              revealing the real About content underneath - no separate pinned section needed */}
          <RabbitHoleReveal progress={aboutScrollProgress} topText="ABOUT" bottomText="ME" />

          {/* Phase 1: Large Background Text (Behind Portrait) */}
          <motion.div 
            style={{ 
              opacity: useTransform(smoothAboutProgress, [0.05, 0.25, 0.8, 0.95], [0, 0.15, 0.15, 0]),
              scale: useTransform(smoothAboutProgress, [0.05, 0.45], [0.85, 1.2]),
              filter: useTransform(smoothAboutProgress, [0.05, 0.45], ["blur(14px)", "blur(0px)"]),
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
            <div className="absolute top-0 inset-x-0 h-2/3 bg-gradient-to-b from-orange-500/10 to-transparent blur-[70px] md:blur-[140px]" />
            <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-blue-500/5 to-transparent blur-[70px] md:blur-[140px]" />
          </motion.div>

          {/* Animated Background Paths - Wave Effect */}
          <motion.div 
            style={{ 
              opacity: useTransform(smoothAboutProgress, [0.1, 0.3, 0.9], [0, 0.65, 0.65]),
              scale: useTransform(smoothAboutProgress, [0.1, 0.9], [1, 1.15]),
              y: useTransform(smoothAboutProgress, [0.2, 0.8], [50, -50])
            }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {!isMobile && <BackgroundPaths />}
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
                className="relative w-full max-w-[400px] md:max-w-[480px] aspect-[4/5] preserve-3d pointer-events-auto group will-change-transform"
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
                <div className="space-y-6">
                  {/* Category Tag */}
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                    <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-orange-400 font-bold">
                      ARCHITECT PROFILE
                    </span>
                    <motion.div 
                      style={{ width: useTransform(aboutScrollProgress, [0.35, 0.45], [0, 48]) }}
                      className="h-[1px] bg-orange-500/60 shadow-[0_0_15px_#f97316]" 
                    />
                  </div>

                  <div className="space-y-6">
                    <ScrollReveal preset="blur-reveal" delay={0.15}>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-about font-bold tracking-tight text-white leading-[1.15] max-w-xl">
                        Aspiring{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]">
                          Software Engineer
                        </span>
                        <br />
                        & AI Enthusiast.
                      </h3>
                    </ScrollReveal>

                    {/* Highly readable text container with frosted backdrop for perfect contrast against background lines */}
                    <div className="max-w-xl p-5 sm:p-6 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                      <p className="text-base sm:text-lg md:text-[18px] font-sans font-normal leading-[1.8] text-gray-100 antialiased">
                        I'm <strong className="text-white font-semibold">Aswin R</strong>, a <strong className="text-white font-semibold">Computer Science Engineering</strong> student passionate about building impactful software. My interests lie in <span className="text-orange-400 font-semibold">Software Engineering</span>, <span className="text-orange-400 font-semibold">Full-Stack Development</span>, and <span className="text-orange-400 font-semibold">Artificial Intelligence</span>, and I enjoy creating modern web applications while continuously strengthening my problem-solving skills through <span className="text-white font-semibold">hands-on projects</span> and <span className="text-white font-semibold">DSA</span>.
                      </p>
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
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCVOpen(true);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center gap-6 px-10 py-4 border-2 border-orange-500/50 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.1)] hover:border-orange-500 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] cursor-pointer"
                  >
                    {/* Background Shimmer Effect */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    
                    {/* Hover Background Fill */}
                    <div className="absolute inset-0 z-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <motion.span 
                      initial={{ letterSpacing: "0.2em" }}
                      whileHover={{ letterSpacing: "0.3em" }}
                      className="relative z-10 text-[14px] md:text-[16px] font-mono uppercase font-bold text-orange-400 group-hover:text-black transition-colors duration-300 flex items-center gap-3"
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
        className="panel relative min-h-[130vh] md:min-h-[150vh] z-60 bg-[#030303] flex items-center justify-center"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: false, margin: "-10%" }}
          className="sticky top-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Highlight */}
          <motion.div 
            style={{ 
              opacity: useTransform(contactScrollProgress, [0, 0.5, 1], [0, 0.2, 0]),
              scale: useTransform(contactScrollProgress, [0, 1], [0.8, 1.2])
            }}
            className="absolute w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none"
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
                  { icon: Github, label: 'Source_Control', value: 'GitHub / TheAswin7', href: 'https://github.com/TheAswin7' },
                  { icon: Linkedin, label: 'Professional_Net', value: 'LinkedIn / raswin7', href: 'https://linkedin.com/in/raswin7' }
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    {...(item.href.startsWith("mailto:") ? {} : { target: "_blank" })}
                    rel="noreferrer"
                    className="flex items-center gap-6 group rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-[border-color,background-color,color] duration-300">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-white/60 group-hover:text-orange-500 transition-colors">{item.label}</p>
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
              className="glass-surface p-6 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                   <div className="space-y-2">
                     <label htmlFor="contact-name" className="text-[11px] uppercase tracking-widest text-white/60 block">Name</label>
                     <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 outline-none transition-[border-color,box-shadow] duration-300" />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="contact-email" className="text-[11px] uppercase tracking-widest text-white/60 block">Email</label>
                     <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 outline-none transition-[border-color,box-shadow] duration-300" />
                   </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-[11px] uppercase tracking-widest text-white/60 block">Message</label>
                  <textarea id="contact-message" name="message" required placeholder="How can I help you?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 outline-none transition-[border-color,box-shadow] duration-300" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-orange-500 disabled:opacity-50 text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-lg hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-[background-color,box-shadow,opacity] duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-white/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting
                    ? "Transmitting..."
                    : submitStatus === "success"
                    ? "✓ Transmission Received"
                    : "Send Message"}
                </button>
                {submitStatus === "success" && (
                  <p className="text-center font-mono text-xs text-orange-400 mt-2">
                    Message transmitted successfully. Aswin will respond shortly.
                  </p>
                )}
              </form>

              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-scanline pointer-events-none opacity-5" />
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-2 opacity-20">
            <p className="text-[11px] font-mono uppercase tracking-[0.5em]">System_Version_2026.05.07</p>
            <p className="text-[11px] font-mono uppercase tracking-[0.5em]">Developed_By_Aswin_R</p>
          </div>
        </motion.div>
      </section>

      <Suspense fallback={null}>
        <AswinAIChatbot />
        <CVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
      </Suspense>
    </div>
  );
}
