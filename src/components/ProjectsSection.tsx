import React, { useRef, useState, useEffect, useCallback, type FC } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  useMotionValueEvent,
  AnimatePresence
} from 'motion/react';
import { Github, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { FireSplashReveal } from './ui/curtain-reveal';
import {
  PythonLogo,
  OpenCVLogo,
  MediaPipeLogo,
  PyTorchLogo,
  TensorFlowLogo,
  GeminiLogo,
  ReactLogo,
  NodejsLogo,
  TypeScriptLogo,
  TailwindLogo,
  DjangoLogo,
  FastAPILogo,
} from './ui/tech-logos';

interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  tools: { name: string; Icon: FC }[];
  github: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: 'fabsence',
    index: '01',
    title: 'Fabsence – AI Face Recognition SaaS',
    category: 'Full-Stack SaaS & Computer Vision',
    description: 'Multi-tenant SaaS attendance platform (React 18, Django REST Framework, MySQL) with server-side tenant isolation across 18+ tables, on-device face recognition (face-api.js), and GitHub Actions CI.',
    tools: [
      { name: 'Django', Icon: DjangoLogo },
      { name: 'React', Icon: ReactLogo },
      { name: 'Python', Icon: PythonLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/fabsence-ai/900/600',
  },
  {
    id: 'opportunity-pulse',
    index: '02',
    title: 'Opportunity Pulse – Career Platform',
    category: 'National Hackathon Winner',
    description: 'Unified aggregator platform for internships, jobs, symposiums, and hackathons with FastAPI, MySQL, and React; led Team FabFour to a Top 4 finish and Best Presenter Award at CapeXtreme 2026.',
    tools: [
      { name: 'FastAPI', Icon: FastAPILogo },
      { name: 'React', Icon: ReactLogo },
      { name: 'Python', Icon: PythonLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/opportunity-pulse/900/600',
  },
  {
    id: 'gesture-control',
    index: '03',
    title: 'Real-Time Hand Gesture Control',
    category: 'Computer Vision & HCI',
    description: 'Computer vision system that maps hand gestures to media playback and UI navigation in real time, running at 30+ FPS with sub-millisecond coordinate mapping.',
    tools: [
      { name: 'Python', Icon: PythonLogo },
      { name: 'OpenCV', Icon: OpenCVLogo },
      { name: 'MediaPipe', Icon: MediaPipeLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/gesture-control/900/600',
  },
  {
    id: 'dl-diagnosis',
    index: '04',
    title: 'Deep Learning Cancer Diagnosis',
    category: 'Published Research Architecture',
    description: 'Convolutional neural network architecture for early-stage cancer detection from medical imaging, presented at ICRTAC 2024 International Conference.',
    tools: [
      { name: 'PyTorch', Icon: PyTorchLogo },
      { name: 'TensorFlow', Icon: TensorFlowLogo },
      { name: 'Python', Icon: PythonLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/dl-diagnosis/900/600',
  },
  {
    id: 'ai-assistant',
    index: '05',
    title: 'Raven – Cinematic Portfolio Agent',
    category: 'Autonomous Agentic Systems',
    description: 'A Gemini-powered autonomous chatbot embedded directly into this site, answering visitor queries about technical architecture, skills, and background in real time.',
    tools: [
      { name: 'Gemini API', Icon: GeminiLogo },
      { name: 'React', Icon: ReactLogo },
      { name: 'Node.js', Icon: NodejsLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/ai-assistant/900/600',
  },
  {
    id: 'this-portfolio',
    index: '06',
    title: 'Cinematic Developer Experience',
    category: 'Creative Web Engineering',
    description: 'The interactive, scroll-scrubbed developer portfolio you are looking at right now — built with React 19, Motion, Three.js, and custom shaders.',
    tools: [
      { name: 'React', Icon: ReactLogo },
      { name: 'TypeScript', Icon: TypeScriptLogo },
      { name: 'Tailwind', Icon: TailwindLogo },
    ],
    github: 'https://github.com/TheAswin7',
    image: 'https://picsum.photos/seed/this-portfolio/900/600',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [inProjectsView, setInProjectsView] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress across the pinned section: starts when section pins at top: 0
  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Mirror the scroll progress into a plain motion value. Transforms derived straight from
  // useScroll get handed to a native (hardware) scroll timeline, which mis-measures this pinned
  // sticky section and leaves the content stuck at ~25% opacity. A plain value keeps them in JS.
  const scrollYProgress = useMotionValue(rawProgress.get());
  useMotionValueEvent(rawProgress, 'change', (v) => scrollYProgress.set(v));

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  // Track active visibility & sync scroll scrub with carousel cards
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setInProjectsView(progress >= 0.22 && progress <= 0.96);

    // Scrub carousel cards smoothly as user scrolls through the active projects zone (after splash reveal)
    if (progress >= 0.22 && progress <= 0.90) {
      const scrollRatio = (progress - 0.22) / (0.90 - 0.22);
      const targetIndex = Math.min(
        PROJECTS.length - 1,
        Math.max(0, Math.floor(scrollRatio * PROJECTS.length))
      );
      setActiveIndex(targetIndex);
    }
  });

  // Keyboard controls when user focuses the carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Gentle auto-rotation (pauses on hover or when out of active scroll zone)
  useEffect(() => {
    if (isPaused || shouldReduceMotion || !inProjectsView) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, inProjectsView, handleNext]);

  // Touch drag swipe state
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    setDragStartX(null);
  };

  const getCardStyle = (index: number) => {
    const total = PROJECTS.length;
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;

    const isActive = diff === 0;
    const isAdjacent = Math.abs(diff) === 1;

    if (Math.abs(diff) > 2) {
      return {
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none' as const,
        transform: `translateX(${diff > 0 ? 150 : -150}%) translateZ(-350px) scale(0.6)`,
      };
    }

    const xOffset = diff * (isMobile ? 75 : 55); // percentage
    const zOffset = -Math.abs(diff) * (isMobile ? 100 : 130); // depth
    const rotateY = -diff * (isMobile ? 20 : 26); // degrees
    const scale = isActive ? 1 : isAdjacent ? (isMobile ? 0.85 : 0.82) : 0.65;
    const opacity = isActive ? 1 : isAdjacent ? 0.9 : 0.6;

    return {
      zIndex: 20 - Math.abs(diff) * 5,
      opacity,
      pointerEvents: 'auto' as const,
      cursor: isActive ? 'default' : 'pointer',
      transform: `translateX(${xOffset}%) translateZ(${zOffset}px) rotateY(${rotateY}deg) scale(${scale})`,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="panel relative min-h-[360vh] md:min-h-[400vh] bg-black z-30"
    >
      {/* Sticky viewport: holds the reveal and carousel with zero dead gap */}
      <div className="sticky top-0 h-dvh w-full flex flex-col justify-between items-center overflow-hidden py-6 sm:py-8 md:py-10">

        {/* Fire Splash Transition Reveal:
            Flame descends from top edge -> hits center -> SPLASHES into radiant burst & shockwaves ->
            displays bold glowing "PROJECTS" -> curtain doors slide open -> projects carousel unveiled! */}
        <FireSplashReveal progress={scrollYProgress} />

        {/* Background Ambient Text: drifting behind carousel */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0.08, 0.14, 0.88, 0.97], [0, 0.1, 0.1, 0]),
            scale: useTransform(smoothProgress, [0.16, 0.4], [0.88, 1.12]),
            y: useTransform(smoothProgress, [0.15, 1], [60, -60]),
          }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none overflow-hidden"
        >
          <h2 className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-display uppercase tracking-tighter leading-none text-orange-500/15 whitespace-nowrap">
            PROJECTS
          </h2>
        </motion.div>

        {/* Background Glow Accents */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent blur-[140px]" />
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent blur-[140px]" />
        </div>

        {/* 1. Header Block (Top of screen) */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.04, 0.09], [0, 1]),
            y: useTransform(scrollYProgress, [0.04, 0.09], [25, 0]),
          }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex-shrink-0"
        >
          <div className="flex items-center justify-center gap-3 mb-1.5 sm:mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
              FEATURED ENGINEERING
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase leading-none tracking-tight text-white mb-2">
            THINGS <span className="text-orange-500" style={{ textShadow: '0 0 20px rgba(249,115,22,0.45)' }}>I'VE BUILT</span>
          </h2>

          <p className="text-xs sm:text-sm font-sans font-normal tracking-wide text-gray-300 max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
            A curated selection of full-stack SaaS architectures, AI/CV systems, and engineering solutions.
          </p>
        </motion.div>

        {/* 2. 3D Rotating Carousel (Center of screen) */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.04, 0.09], [0, 1]),
            scale: useTransform(scrollYProgress, [0.04, 0.09], [0.93, 1]),
            perspective: isMobile ? '1000px' : '1500px',
          }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 flex-1 flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
        >
          <div
            className="relative w-full h-[360px] sm:h-[400px] md:h-[430px] flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {PROJECTS.map((project, index) => {
              const cardStyle = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isActive) setActiveIndex(index);
                  }}
                  style={{
                    position: 'absolute',
                    width: isMobile ? '88vw' : '560px',
                    maxWidth: '92vw',
                    transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    ...cardStyle,
                  }}
                  className="origin-center select-none"
                >
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-2xl border flex flex-col',
                      'bg-[#0e0e12] shadow-[0_25px_60px_rgba(0,0,0,0.8)]',
                      isActive
                        ? 'border-orange-500/50 shadow-[0_0_35px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/30'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    {/* Top Image Preview Banner */}
                    <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover brightness-100 group-hover:scale-105 transition-transform duration-700"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent" />

                      {/* Project Index Pill */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-black/85 border border-white/15 text-white font-bold backdrop-blur-md">
                          {project.index} / {String(PROJECTS.length).padStart(2, '0')}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/25 text-orange-400 font-bold border border-orange-500/35">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold tracking-tight text-white mb-1.5 leading-snug">
                          {project.title}
                        </h3>
                        <p className="font-sans text-[12.5px] sm:text-[13.5px] text-gray-200 leading-relaxed line-clamp-3 mb-4">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack & Action Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5 [&_svg]:!h-4 [&_svg]:!w-4">
                          {project.tools.map(({ name, Icon }) => (
                            <span
                              key={name}
                              title={name}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono text-gray-200"
                            >
                              <Icon />
                              <span className="hidden sm:inline text-[9px]">{name}</span>
                            </span>
                          ))}
                        </div>

                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!isActive) e.preventDefault();
                          }}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300',
                            isActive
                              ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                              : 'bg-white/10 text-white/50 cursor-pointer'
                          )}
                        >
                          <Github size={13} />
                          <span>Code</span>
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    </div>

                    {/* Active Corner Accent */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-tr-2xl pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 3. Navigation Controls & Indicator Bar (Bottom of screen) */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.05, 0.1], [0, 1]),
            y: useTransform(scrollYProgress, [0.05, 0.1], [20, 0]),
          }}
          className="relative z-10 flex flex-col items-center gap-3 flex-shrink-0 px-4"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous Project"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-orange-500 hover:text-black hover:border-orange-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots / Indicators */}
            <div className="flex items-center gap-2">
              {PROJECTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to project ${p.title}`}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer',
                    idx === activeIndex
                      ? 'w-7 h-2 bg-orange-500 shadow-[0_0_10px_#f97316]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  )}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next Project"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-orange-500 hover:text-black hover:border-orange-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-gray-300 uppercase">
            Click cards or use arrows to navigate · Auto-rotating
          </div>
        </motion.div>

      </div>
    </section>
  );
}
