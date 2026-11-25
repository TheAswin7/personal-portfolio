import { FC, useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { cn } from '../lib/utils';
import ScrollReveal from './ScrollReveal';
import { ContainerScroll } from './ui/container-scroll-animation';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  Award,
  Star,
  Clock,
  Code2,
  Bookmark,
  Sparkles
} from 'lucide-react';

// Brand logo SVGs live in a shared module (also used by ProjectsSection)
import {
  HTML5Logo,
  CSS3Logo,
  JSLogo,
  ReactLogo,
  TailwindLogo,
  BootstrapLogo,
  SassLogo,
  ViteLogo,
  NodejsLogo,
  ExpressLogo,
  PythonLogo,
  FastAPILogo,
  DjangoLogo,
  PostgreSQLLogo,
  MongoDBLogo,
  RedisLogo,
  OpenCVLogo,
  MediaPipeLogo,
  PyTorchLogo,
  TensorFlowLogo,
  GitLogo,
  DockerLogo,
  GeminiLogo,
  FirebaseLogo,
} from './ui/tech-logos';

// Shared fine-grain noise texture (leather grain on spines, paper fiber on pages)
const GRAIN_TEXTURE =
  'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")';

// Direction-aware page-turn variants: positive direction = turning to the next book/page
// (rotates in from the right, exits to the left), negative = the reverse.
const pageFlipVariants: Variants = {
  enter: (direction: number) => ({
    rotateY: direction >= 0 ? -110 : 110,
    opacity: 0,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    rotateY: direction >= 0 ? 110 : -110,
    opacity: 0,
  }),
};

interface TechItem {
  name: string;
  level: string;
  stars: number;
  icon: any;
}

interface BookData {
  id: string;
  index: string;
  title: string;
  spineTitle: string;
  category: string;
  color: string; // Leather color gradient
  accentColor: string; // Glow/Trim color
  icon: string; // Spine Icon code representation
  heightClass: string;
  widthClass: string;
  description: string;
  quote: string;
  stats: {
    technologies: number;
    experience: string;
    projects: string;
  };
  technologies: TechItem[];
}

const BOOKS_DATA: BookData[] = [
  {
    id: 'frontend',
    index: '01',
    title: 'FRONTEND',
    spineTitle: 'FRONT END',
    category: 'Interface Architecture',
    color: 'from-[#3A2214] to-[#1C1009]',
    accentColor: '#D97706',
    icon: 'globe',
    heightClass: 'h-[330px]',
    widthClass: 'w-[52px]',
    description: 'I build responsive, interactive and modern web experiences with clean and efficient code.',
    quote: 'The goal is to build products that are intuitive, accessible and beautiful.',
    stats: {
      technologies: 7,
      experience: '2+',
      projects: '5+'
    },
    technologies: [
      { name: 'HTML5', level: 'Expert', stars: 5, icon: HTML5Logo },
      { name: 'CSS', level: 'Expert', stars: 5, icon: CSS3Logo },
      { name: 'JavaScript', level: 'Expert', stars: 4.5, icon: JSLogo },
      { name: 'React', level: 'Advanced', stars: 4, icon: ReactLogo },
      { name: 'Tailwind CSS', level: 'Advanced', stars: 4.5, icon: TailwindLogo },
      { name: 'Bootstrap', level: 'Advanced', stars: 4, icon: BootstrapLogo },
      { name: 'Sass', level: 'Intermediate', stars: 4, icon: SassLogo },
      { name: 'Vite', level: 'Intermediate', stars: 4, icon: ViteLogo }
    ]
  },
  {
    id: 'backend',
    index: '02',
    title: 'BACKEND',
    spineTitle: 'BACK END',
    category: 'System Logic & Persistence',
    color: 'from-[#1E293B] to-[#0F172A]',
    accentColor: '#3B82F6',
    icon: 'server',
    heightClass: 'h-[345px]',
    widthClass: 'w-[54px]',
    description: 'I architect robust server side systems, high performance microservices, and secure API networks.',
    quote: 'Scalability, security, and performance are the pillars of dependable backends.',
    stats: {
      technologies: 6,
      experience: '2+',
      projects: '4+'
    },
    technologies: [
      { name: 'Node.js', level: 'Advanced', stars: 4.5, icon: NodejsLogo },
      { name: 'Express', level: 'Advanced', stars: 4.5, icon: ExpressLogo },
      { name: 'Python', level: 'Advanced', stars: 4.5, icon: PythonLogo },
      { name: 'FastAPI', level: 'Advanced', stars: 4, icon: FastAPILogo },
      { name: 'Django', level: 'Intermediate', stars: 3.5, icon: DjangoLogo },
      { name: 'REST APIs', level: 'Expert', stars: 5, icon: Code2 }
    ]
  },
  {
    id: 'database',
    index: '03',
    title: 'DATABASE',
    spineTitle: 'DATABASE',
    category: 'Persistence Architecture',
    color: 'from-[#064E3B] to-[#022C22]',
    accentColor: '#10B981',
    icon: 'database',
    heightClass: 'h-[320px]',
    widthClass: 'w-[50px]',
    description: 'I design efficient relational databases, optimized queries, and reliable persistence architectures.',
    quote: 'Data is the lifeblood of applications; preserving it safely is the ultimate duty.',
    stats: {
      technologies: 5,
      experience: '1.5+',
      projects: '3+'
    },
    technologies: [
      { name: 'PostgreSQL', level: 'Advanced', stars: 4.5, icon: PostgreSQLLogo },
      { name: 'MongoDB', level: 'Intermediate', stars: 4, icon: MongoDBLogo },
      { name: 'Redis', level: 'Intermediate', stars: 3.5, icon: RedisLogo },
      { name: 'MySQL', level: 'Advanced', stars: 4, icon: PostgreSQLLogo },
      { name: 'Drizzle ORM', level: 'Advanced', stars: 4, icon: Code2 }
    ]
  },
  {
    id: 'libraries',
    index: '04',
    title: 'LIBRARIES',
    spineTitle: 'LIBRARIES',
    category: 'Intelligent Computing',
    color: 'from-[#4C1D95] to-[#2E1065]',
    accentColor: '#8B5CF6',
    icon: 'libraries',
    heightClass: 'h-[340px]',
    widthClass: 'w-[52px]',
    description: 'I leverage high-performance computer vision engines, neural networks, and diagnostic frameworks.',
    quote: 'Blending sensory algorithms and real-time processing to unlock machine vision.',
    stats: {
      technologies: 6,
      experience: '2+',
      projects: '4+'
    },
    technologies: [
      { name: 'OpenCV', level: 'Expert', stars: 5, icon: OpenCVLogo },
      { name: 'MediaPipe', level: 'Advanced', stars: 4.5, icon: MediaPipeLogo },
      { name: 'PyTorch', level: 'Advanced', stars: 4, icon: PyTorchLogo },
      { name: 'TensorFlow', level: 'Intermediate', stars: 3.5, icon: TensorFlowLogo },
      { name: 'Scikit-Learn', level: 'Advanced', stars: 4, icon: PyTorchLogo },
      { name: 'NumPy / Pandas', level: 'Advanced', stars: 4.5, icon: PythonLogo }
    ]
  },
  {
    id: 'tools',
    index: '05',
    title: 'TOOLS',
    spineTitle: 'TOOLS',
    category: 'Development Operations',
    color: 'from-[#7F1D1D] to-[#450A0A]',
    accentColor: '#EF4444',
    icon: 'tools',
    heightClass: 'h-[325px]',
    widthClass: 'w-[48px]',
    description: 'I command shell environments, containerized setups, and continuous integration workflows.',
    quote: 'Automating development pipelines ensures error-free, rapid deployment cycles.',
    stats: {
      technologies: 5,
      experience: '2+',
      projects: '6+'
    },
    technologies: [
      { name: 'Git & GitHub', level: 'Expert', stars: 5, icon: GitLogo },
      { name: 'Docker', level: 'Advanced', stars: 4, icon: DockerLogo },
      { name: 'CI/CD Actions', level: 'Advanced', stars: 4, icon: Sparkles },
      { name: 'Bash & Linux', level: 'Advanced', stars: 4.5, icon: Code2 },
      { name: 'Nginx', level: 'Intermediate', stars: 3.5, icon: HTML5Logo }
    ]
  },
  {
    id: 'ai_ml',
    index: '06',
    title: 'AI / ML',
    spineTitle: 'AI / ML',
    category: 'Cognitive Computing',
    color: 'from-[#311042] to-[#1F072B]',
    accentColor: '#C084FC',
    icon: 'ai_ml',
    heightClass: 'h-[335px]',
    widthClass: 'w-[51px]',
    description: 'I integrate state-of-the-art large language models, agentic systems, and deep learning architectures.',
    quote: 'Intelligence is no longer static. We build active, reasoning agent layers.',
    stats: {
      technologies: 4,
      experience: '1.5+',
      projects: '3+'
    },
    technologies: [
      { name: 'Gemini API', level: 'Expert', stars: 5, icon: GeminiLogo },
      { name: 'LLM Agents', level: 'Advanced', stars: 4.5, icon: Sparkles },
      { name: 'Neural Nets', level: 'Advanced', stars: 4, icon: PyTorchLogo },
      { name: 'RAG Engines', level: 'Advanced', stars: 4, icon: Code2 }
    ]
  },
  {
    id: 'cloud',
    index: '07',
    title: 'CLOUD',
    spineTitle: 'CLOUD',
    category: 'Cloud-Native Engineering',
    color: 'from-[#0F3752] to-[#082030]',
    accentColor: '#0EA5E9',
    icon: 'cloud',
    heightClass: 'h-[330px]',
    widthClass: 'w-[50px]',
    description: 'I scale serverless architectures, robust cloud-native databases, and secure ingress proxies.',
    quote: 'Modern systems are decentralized. Cloud engineering is the ultimate bridge.',
    stats: {
      technologies: 4,
      experience: '1.5+',
      projects: '2+'
    },
    technologies: [
      { name: 'Google Cloud', level: 'Advanced', stars: 4, icon: GeminiLogo },
      { name: 'Firebase', level: 'Expert', stars: 5, icon: FirebaseLogo },
      { name: 'Cloud Run', level: 'Advanced', stars: 4.5, icon: GeminiLogo },
      { name: 'Vercel / Netlify', level: 'Expert', stars: 5, icon: HTML5Logo }
    ]
  },
  {
    id: 'learning',
    index: '08',
    title: 'LEARNING',
    spineTitle: 'LEARNING',
    category: 'Pioneering Research',
    color: 'from-[#1C1917] to-[#0C0A09]',
    accentColor: '#A8A29E',
    icon: 'learning',
    heightClass: 'h-[340px]',
    widthClass: 'w-[53px]',
    description: 'I actively research bioinformatic diagnostic networks, cryptographic protocols, and next-gen paradigms.',
    quote: 'Staying at the frontier of engineering means having an insatiable hunger to learn.',
    stats: {
      technologies: 4,
      experience: 'Continuous',
      projects: '3+ Papers'
    },
    technologies: [
      { name: 'Bioinformatics', level: 'Advanced', stars: 4, icon: PyTorchLogo },
      { name: 'Cryptography', level: 'Intermediate', stars: 3.5, icon: Code2 },
      { name: 'Systems Design', level: 'Advanced', stars: 4, icon: Code2 },
      { name: 'WebGL Canvas', level: 'Intermediate', stars: 3.5, icon: Sparkles }
    ]
  }
];

// Helper to render book spine SVG icons
const getBookSpineIcon = (type: string, color: string) => {
  switch (type) {
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      );
    case 'server':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="8" rx="1.5" />
          <rect x="2" y="14" width="20" height="8" rx="1.5" />
          <line x1="6" y1="6" x2="6" y2="6.01" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="18" x2="6" y2="18.01" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'database':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'libraries':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M22 10v6M2 10v6M12 2l10 5-10 5L2 7l10-5zM6 12.5V16c0 1 2 2 6 2s6-1 6-2v-3.5" />
        </svg>
      );
    case 'tools':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'ai_ml':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.88A2.5 2.5 0 0 1 9.5 2z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.88A2.5 2.5 0 0 0 14.5 2z" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.82.04-1.22.12A6 6 0 0 0 3.5 15a3.5 3.5 0 0 0 3.5 3.5h10.5z" />
        </svg>
      );
    case 'learning':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    default:
      return null;
  }
};

// Simple visual Star Rating component using SVG
const StarRating = ({ rating, color }: { rating: number; color: string }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <svg key={i} className="w-3.5 h-3.5" fill={color} viewBox="0 0 20 20" style={{ color }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <div key={i} className="relative w-3.5 h-3.5">
          <svg className="absolute top-0 left-0 w-3.5 h-3.5" fill="#E4E4E7" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute top-0 left-0 overflow-hidden w-1/2 h-full">
            <svg className="w-3.5 h-3.5" fill={color} viewBox="0 0 20 20" style={{ color }}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    } else {
      stars.push(
        <svg key={i} className="w-3.5 h-3.5 opacity-30" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const SolarSystemTech = forwardRef<HTMLDivElement, any>((props, ref) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [pageDirection, setPageDirection] = useState(1);
  const [hasOpenedBook, setHasOpenedBook] = useState(false);
  const activeBook = BOOKS_DATA.find(b => b.id === selectedBookId);

  // Picks a page-turn direction based on shelf order, so jumping to any book (via the
  // sidebar or the shelf) flips the correct way instead of always defaulting forward.
  const goToBook = (id: string) => {
    setHasOpenedBook(true);
    const currentIndex = BOOKS_DATA.findIndex(b => b.id === selectedBookId);
    const nextIndex = BOOKS_DATA.findIndex(b => b.id === id);
    if (currentIndex !== -1 && nextIndex !== -1 && nextIndex !== currentIndex) {
      setPageDirection(nextIndex > currentIndex ? 1 : -1);
    }
    setSelectedBookId(id);
  };

  const handleNextBook = () => {
    if (!selectedBookId) return;
    const currentIndex = BOOKS_DATA.findIndex(b => b.id === selectedBookId);
    const nextIndex = (currentIndex + 1) % BOOKS_DATA.length;
    setPageDirection(1);
    setSelectedBookId(BOOKS_DATA[nextIndex].id);
  };

  const handlePrevBook = () => {
    if (!selectedBookId) return;
    const currentIndex = BOOKS_DATA.findIndex(b => b.id === selectedBookId);
    const prevIndex = (currentIndex - 1 + BOOKS_DATA.length) % BOOKS_DATA.length;
    setPageDirection(-1);
    setSelectedBookId(BOOKS_DATA[prevIndex].id);
  };

  // Scroll cue for the open book's page content: shows a "keep scrolling" hint while
  // there's more to read, then swaps to a "Next Codex" prompt once the reader hits the bottom.
  const pagesScrollRef = useRef<HTMLDivElement>(null);
  const [pagesScroll, setPagesScroll] = useState({ overflowing: false, atEnd: true, progress: 0, measured: false });

  const checkPagesScroll = () => {
    const el = pagesScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const overflowing = maxScroll > 4;
    const atEnd = !overflowing || el.scrollTop >= maxScroll - 4;
    setPagesScroll({ overflowing, atEnd, progress: overflowing ? Math.min(1, el.scrollTop / maxScroll) : 1, measured: true });
  };

  useEffect(() => {
    if (!selectedBookId) return;
    if (pagesScrollRef.current) pagesScrollRef.current.scrollTop = 0;
    const t = setTimeout(checkPagesScroll, 60);
    return () => clearTimeout(t);
  }, [selectedBookId]);

  // Scroll all the way through a book's pages and the wheel gesture itself turns the
  // page - no click needed. Scrolling past the last book's pages closes the reader and
  // carries the user straight into the Projects section.
  useEffect(() => {
    const el = pagesScrollRef.current;
    if (!el || !selectedBookId) return;

    let cooldown = false;
    const releaseCooldown = () => { cooldown = false; };

    const onWheel = (e: WheelEvent) => {
      if (cooldown) return;
      const maxScroll = el.scrollHeight - el.clientHeight;

      if (e.deltaY > 0) {
        const atBottom = maxScroll <= 4 || el.scrollTop >= maxScroll - 4;
        if (!atBottom) return;
        e.preventDefault();
        cooldown = true;
        window.setTimeout(releaseCooldown, 400);

        const currentIndex = BOOKS_DATA.findIndex(b => b.id === selectedBookId);
        if (currentIndex === BOOKS_DATA.length - 1) {
          setSelectedBookId(null);
          requestAnimationFrame(() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          });
        } else {
          handleNextBook();
        }
      } else if (e.deltaY < 0) {
        const atTop = el.scrollTop <= 4;
        if (!atTop) return;
        const currentIndex = BOOKS_DATA.findIndex(b => b.id === selectedBookId);
        if (currentIndex === 0) return;
        e.preventDefault();
        cooldown = true;
        window.setTimeout(releaseCooldown, 400);
        handlePrevBook();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [selectedBookId]);

  return (
    <section 
      ref={ref}
      id="tech" 
      className="panel relative w-full min-h-dvh bg-[#060607] z-30 py-20 flex flex-col justify-center overflow-hidden border-t border-white/5"
    >
      {/* Background Ambience / Subtle Wood Grain Texture & warm lamps */}
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03] z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(40,20,5,0.15)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Warm lamps reflections */}
      <div className="absolute right-10 top-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">

        {/* Centered intro */}
        <div className="max-w-2xl text-center space-y-5 mb-4 md:mb-6">
          <ScrollReveal preset="blur-reveal" delay={0.1}>
            <div className="space-y-1">
              <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-[#D97706] font-bold block">
                EXPLORE MY
              </span>
              <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tight text-white leading-none">
                TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">LIBRARY</span>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal preset="fade-up" delay={0.25}>
            <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed max-w-sm mx-auto">
              Welcome to my personal library of technologies and tools I've learned, explored and used to build real world solutions.
            </p>
          </ScrollReveal>
          <ScrollReveal preset="fade-up" delay={0.35}>
            <button
              onClick={() => goToBook('frontend')}
              className="mx-auto px-4 py-2 border border-amber-500/30 hover:border-amber-500/80 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 rounded-xl text-xs font-mono uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300"
            >
              <BookOpen size={13} /> How It Works
            </button>
          </ScrollReveal>
        </div>

        {/* Bookshelf tilts in and settles flat as it scrolls into view */}
        <ContainerScroll containerClassName="h-[42rem] md:h-[52rem]" titleComponent={null} glowColor="#D97706">
          <div className="relative h-full w-full flex flex-col items-center justify-center overflow-y-auto custom-scrollbar bg-gradient-to-b from-neutral-900/40 to-black/70 rounded-2xl px-4 py-8 md:px-8">

              {/* Stand Row of Vertical Leather Books */}
              <div className="relative flex justify-center items-end gap-1.5 sm:gap-3.5 min-h-[360px] pb-1 px-2 overflow-visible">
                {BOOKS_DATA.map((book, i) => {
                  const isSelected = selectedBookId === book.id;

                  return (
                      <motion.div
                        key={book.id}
                        onClick={() => goToBook(book.id)}
                        initial={{ opacity: 0, x: i < 4 ? "-6vw" : "6vw", y: -20, rotate: i < 4 ? -15 : 15 }}
                        whileInView={{ 
                          opacity: 1, 
                          x: 0, 
                          y: 0, 
                          rotate: [-1.5, 1.5, -1.5] 
                        }}
                        viewport={{ once: true, margin: "-100px 0px" }}
                        transition={{ 
                          opacity: { duration: 0.8, delay: i < 4 ? i * 0.15 : (7 - i) * 0.15 },
                          x: { type: "spring", stiffness: 100, damping: 15, delay: i < 4 ? i * 0.15 : (7 - i) * 0.15 },
                          y: { type: "spring", stiffness: 100, damping: 15, delay: i < 4 ? i * 0.15 : (7 - i) * 0.15 },
                          rotate: { duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: 1.5 } 
                        }}
                        className="relative cursor-pointer flex flex-col items-center group select-none origin-bottom overflow-visible"
                      >
                      {/* Discovery cue - a bouncing arrow over the first book, until any book is opened */}
                      {i === 0 && !hasOpenedBook && (
                        <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 whitespace-nowrap bg-black/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Tap a book
                          </span>
                          <ChevronDown size={16} className="text-amber-400" />
                        </motion.div>
                      )}

                      {/* Ambient glow - always on, brand-colored, gives the shelf a lit-from-within feel */}
                      <motion.div
                        aria-hidden="true"
                        animate={{ opacity: [0.25, 0.5, 0.25] }}
                        transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        className="absolute inset-x-[-6px] top-2 bottom-2 -z-10 rounded-xl blur-lg pointer-events-none"
                        style={{ backgroundColor: book.accentColor }}
                      />

                      {/* Ribbon Bookmark - hangs from the top edge, a physical book cue */}
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-6 z-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{
                          backgroundColor: book.accentColor,
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
                        }}
                      />

                      {/* Spine Body */}
                      <motion.div
                        whileHover={{
                          y: -24,
                          scale: 1.03,
                          transition: { duration: 0.25, ease: "easeOut" }
                        }}
                        className={cn(
                          "relative rounded-t-lg border-t border-x flex flex-col justify-between py-6 px-1 sm:px-2.5 max-w-[9.2vw] sm:max-w-none transition-[border-color,box-shadow] duration-300",
                          book.heightClass,
                          book.widthClass,
                          "bg-gradient-to-b",
                          book.color
                        )}
                        style={{
                          borderColor: isSelected ? book.accentColor : 'rgba(255, 255, 255, 0.08)',
                          boxShadow: isSelected
                            ? `0 -15px 30px ${book.accentColor}30, 0 10px 25px rgba(0,0,0,0.8)`
                            : '0 8px 16px rgba(0,0,0,0.5)',
                        }}
                      >
                        {/* Leather grain texture */}
                        <div
                          className="absolute inset-0 rounded-t-lg pointer-events-none opacity-[0.18] mix-blend-overlay"
                          style={{ backgroundImage: GRAIN_TEXTURE }}
                        />

                        {/* Stacked page-edge sliver - hints at pages behind the spine */}
                        <div className="absolute top-1 bottom-1 -right-[3px] w-[3px] rounded-r-sm bg-gradient-to-b from-[#F6F2E8] via-[#E6DEC0] to-[#F6F2E8] opacity-90" />

                        {/* Golden leather decorative lines at the top of spine */}
                        <div className="absolute top-3.5 inset-x-1.5 h-[2px] bg-amber-500/40 opacity-70" />
                        <div className="absolute top-5 inset-x-3 h-[1px] bg-amber-500/20 opacity-50" />

                        {/* Top Spine Numbering */}
                        <div className="text-center">
                          <span className="text-[10px] font-sans font-black text-amber-500/85 group-hover:text-amber-400">
                            {book.index}
                          </span>
                        </div>

                        {/* Spine Vertical Text - bright, high-contrast, glows in the selected/hovered state */}
                        <div className="flex-1 flex items-center justify-center py-4 overflow-hidden">
                          <span
                            className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] font-mono text-white select-none whitespace-nowrap transition-[text-shadow] duration-300"
                            style={{
                              writingMode: 'vertical-lr',
                              transform: 'rotate(180deg)',
                              textShadow: isSelected
                                ? `0 0 12px ${book.accentColor}, 0 0 4px rgba(255,255,255,0.8)`
                                : '0 1px 3px rgba(0,0,0,0.9), 0 0 1px rgba(255,255,255,0.4)',
                            }}
                          >
                            {book.spineTitle}
                          </span>
                        </div>

                        {/* Engraved glow Icon on the spine */}
                        <div className="my-2 text-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-[opacity,transform] duration-300">
                          {getBookSpineIcon(book.icon, isSelected ? book.accentColor : '#D97706')}
                        </div>

                        {/* Golden leather lines at bottom */}
                        <div className="absolute bottom-5 inset-x-3 h-[1px] bg-amber-500/20 opacity-50" />
                        <div className="absolute bottom-3.5 inset-x-1.5 h-[2px] bg-amber-500/40 opacity-70" />

                        {/* Under book glow shadow indicator */}
                        <div 
                          className="absolute -bottom-1 inset-x-2 h-4 blur-[8px] opacity-0 group-hover:opacity-60 transition-opacity rounded-full pointer-events-none"
                          style={{ backgroundColor: book.accentColor }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rich Wooden Walnut Shelf Plank */}
              <div className="relative w-full h-4.5 rounded-full bg-gradient-to-r from-[#1A0D05] via-[#351B0A] to-[#1A0D05] border-t border-amber-600/25 shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-between px-8">
                {/* Under shelf ambient lighting beams */}
                <div className="absolute -top-[1px] inset-x-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent blur-[1px]" />
                <span className="w-2 h-2 rounded-full bg-black/60 border border-neutral-800" />
                <span className="w-2 h-2 rounded-full bg-black/60 border border-neutral-800" />
              </div>

              {/* Wooden supports beneath shelf */}
              <div className="w-full flex justify-between px-12 -mt-1 h-5">
                <div className="w-3.5 h-full bg-[#110803] border-x border-b border-neutral-900 rounded-b" />
                <div className="w-3.5 h-full bg-[#110803] border-x border-b border-neutral-900 rounded-b" />
              </div>
          </div>
        </ContainerScroll>

        {/* Instruction Footer under the shelf */}
        <div className="mt-5 text-center flex flex-col items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-white/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <BookOpen size={10} />
            </div>
            <span>Click on a book to open</span>
          </div>
        </div>
      </div>

      {/* Realistic Open Book Reader Overlay */}
      <AnimatePresence mode="wait">
          {selectedBookId && activeBook && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-lenis-prevent
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
            >
              {/* Overlay Background Click Closer */}
              <div className="absolute inset-0" onClick={() => setSelectedBookId(null)} />

              {/* Complete Interactive Codex Reader Container - swings open like a cover */}
              <motion.div
                initial={{ rotateY: -35, x: -50, opacity: 0, scale: 0.96 }}
                animate={{ rotateY: 0, x: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -25, x: -30, opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", damping: 22, stiffness: 160 }}
                style={{ transformPerspective: 2200, transformOrigin: 'left center' }}
                className="relative max-w-6xl w-full bg-[#0E0E0F]/95 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20 h-[92dvh] md:h-[680px]"
              >
                
                {/* Floating Top Close Button in Circle */}
                <button
                  onClick={() => setSelectedBookId(null)}
                  className="absolute top-5 right-5 z-[210] p-2.5 bg-black border border-white/10 rounded-full hover:border-amber-500 hover:text-amber-500 text-white/60 transition-all duration-300 flex items-center justify-center"
                >
                  <X size={15} />
                </button>

                {/* Reader Layout Split */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full">
                  
                  {/* LEFT SIDEBAR CONTROLS (Vertical representation of the 8 books) - first beat of the reveal */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden sm:flex lg:flex-col h-14 lg:h-full w-full lg:w-16 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5 items-center justify-center gap-2 px-4 lg:py-8 z-20 flex-shrink-0">
                    {BOOKS_DATA.map((book) => {
                      const isCurrent = book.id === selectedBookId;
                      return (
                        <button
                          key={book.id}
                          onClick={() => goToBook(book.id)}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 relative group",
                            isCurrent 
                              ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                              : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/20"
                          )}
                        >
                          {getBookSpineIcon(book.icon, isCurrent ? '#D97706' : 'currentColor')}
                          
                          {/* Tooltip on hover */}
                          <span className="absolute left-14 hidden lg:group-hover:inline-block bg-black border border-white/10 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-widest text-white whitespace-nowrap z-50 shadow-xl">
                            {book.spineTitle}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>

                  {/* CENTRAL INTRO COLUMN - second beat, the profile slides in after the sidebar */}
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-[35%] p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-b from-neutral-900/40 to-black/60 overflow-y-auto overscroll-contain custom-scrollbar flex-shrink-0">
                    
                    <div className="space-y-6">
                      {/* Section tag */}
                      <div className="flex items-center gap-2">
                        <span className="text-[32px] font-serif italic text-amber-500 font-bold leading-none">{activeBook.index}</span>
                        <div className="h-[1px] w-8 bg-amber-500/30" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{activeBook.category}</span>
                      </div>

                      <h3 className="text-3xl font-serif uppercase tracking-tight text-white leading-tight">
                        {activeBook.title}
                      </h3>

                      <p className="text-xs text-white/50 leading-relaxed font-light">
                        {activeBook.description}
                      </p>

                      {/* Stat boxes (3 Column layout matching screenshot) */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                        <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                          <Star size={14} className="text-amber-500 mb-1.5" />
                          <span className="text-sm font-black text-white">{activeBook.stats.technologies}</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">Techs</span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                          <Clock size={14} className="text-amber-500 mb-1.5" />
                          <span className="text-xs font-black text-white">{activeBook.stats.experience}</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">Exp</span>
                        </div>
                        <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                          <Code2 size={14} className="text-amber-500 mb-1.5" />
                          <span className="text-xs font-black text-white">{activeBook.stats.projects}</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-0.5">Built</span>
                        </div>
                      </div>

                      {/* Quote Panel with shield avatar */}
                      <div className="p-4 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-black flex-shrink-0">
                          <Bookmark size={14} />
                        </div>
                        <p className="text-[11px] text-white/70 italic leading-relaxed font-light">
                          "{activeBook.quote}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={() => {
                          setSelectedBookId(null);
                          const el = document.getElementById('projects');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-3 bg-transparent hover:bg-amber-500/5 text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/60 rounded-xl text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Projects <ChevronRight size={13} />
                      </button>
                    </div>

                  </motion.div>

                  {/* RIGHT SIDE - THE PHYSICAL OLD PAPER BOOK ARCHITECTURE - final beat, the book itself */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 relative bg-black/20">
                  <div
                    ref={pagesScrollRef}
                    onScroll={checkPagesScroll}
                    className="w-full h-full p-4 md:p-8 flex items-center justify-center overflow-y-auto overscroll-contain custom-scrollbar"
                  >

                    {/* Immersive Paper Book container - static binding; pages flip inside it */}
                    <div
                      className="relative w-full max-w-4xl bg-[#2A1608] p-1.5 md:p-2.5 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.95)] overflow-hidden border border-[#4E2A12]"
                      style={{ perspective: 2400 }}
                    >
                      <AnimatePresence mode="popLayout" initial={false} custom={pageDirection}>
                        <motion.div
                          key={activeBook.id}
                          custom={pageDirection}
                          variants={pageFlipVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.65, ease: [0.45, 0, 0.15, 1] }}
                          style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
                          className="flex"
                        >
                      {/* Left Page Page (ivory warm gradient, center fold shade) */}
                      <div className="flex-1 bg-gradient-to-r from-[#ECE6D9] via-[#F6F2E8] to-[#E6DEC0] min-h-[460px] md:min-h-[480px] rounded-l-2xl p-4 md:p-7 shadow-[inset_15px_0_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Paper fiber grain */}
                        <div
                          className="absolute inset-0 rounded-l-2xl pointer-events-none opacity-[0.05] mix-blend-multiply"
                          style={{ backgroundImage: GRAIN_TEXTURE }}
                        />

                        {/* Decorative paper page line */}
                        <div className="absolute top-0 bottom-0 right-0 w-px bg-black/10" />

                        {/* Top Header Label spanning across pages */}
                        <div className="flex items-center justify-between border-b border-black/15 pb-2.5 mb-5">
                          <span className="text-[10px] font-mono tracking-widest text-black/60 font-bold uppercase">TECHNOLOGIES I KNOW</span>
                          <span className="text-[10px] font-mono text-black/50">PAGE I</span>
                        </div>

                        {/* List of 4 cards inside Left Page */}
                        <div className="grid grid-cols-1 gap-3.5">
                          {activeBook.technologies.slice(0, 4).map((tech, idx) => {
                            const Logo = tech.icon;
                            return (
                              <motion.div
                                key={idx}
                                initial={{ x: -15, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.08 }}
                                className="bg-[#FAF8F5]/80 hover:bg-white border border-black/5 hover:border-black/10 p-3 rounded-xl flex items-center justify-between gap-3 shadow-[0_2px_5px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-all duration-300"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                    <Logo />
                                  </div>
                                  <div className="text-left">
                                    <span className="text-xs md:text-sm font-bold text-[#1C1917] block leading-tight">{tech.name}</span>
                                    <span className="text-[10px] text-amber-600 font-medium tracking-wide">{tech.level}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <StarRating rating={tech.stars} color="#E28B14" />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                      </div>

                      {/* PHYSICAL SPINE SEAM BINDER SHADOW GUTTER */}
                      <div className="w-1.5 md:w-3.5 bg-gradient-to-r from-[#1C0F07] via-[#0E0703] to-[#1C0F07] relative z-10 flex-shrink-0 shadow-[0_0_15px_black]" />

                      {/* Right Page Page (shading mirrors the left page) */}
                      <div className="flex-1 bg-gradient-to-r from-[#E6DEC0] via-[#F6F2E8] to-[#ECE6D9] min-h-[460px] md:min-h-[480px] rounded-r-2xl p-4 md:p-7 shadow-[inset_-15px_0_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Paper fiber grain */}
                        <div
                          className="absolute inset-0 rounded-r-2xl pointer-events-none opacity-[0.05] mix-blend-multiply"
                          style={{ backgroundImage: GRAIN_TEXTURE }}
                        />

                        {/* Decorative paper page line */}
                        <div className="absolute top-0 bottom-0 left-0 w-px bg-black/10" />

                        {/* Top Header Label */}
                        <div className="flex items-center justify-between border-b border-black/15 pb-2.5 mb-5">
                          <span className="text-[10px] font-mono tracking-widest text-black/60 font-bold uppercase">TECHNOLOGIES I KNOW</span>
                          <span className="text-[10px] font-mono text-black/50">PAGE II</span>
                        </div>

                        {/* List of 4 cards inside Right Page */}
                        <div className="grid grid-cols-1 gap-3.5">
                          {activeBook.technologies.slice(4, 8).map((tech, idx) => {
                            const Logo = tech.icon;
                            return (
                              <motion.div
                                key={idx}
                                initial={{ x: 15, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: (idx + 4) * 0.08 }}
                                className="bg-[#FAF8F5]/80 hover:bg-white border border-black/5 hover:border-black/10 p-3 rounded-xl flex items-center justify-between gap-3 shadow-[0_2px_5px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-all duration-300"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                                    <Logo />
                                  </div>
                                  <div className="text-left">
                                    <span className="text-xs md:text-sm font-bold text-[#1C1917] block leading-tight">{tech.name}</span>
                                    <span className="text-[10px] text-amber-600 font-medium tracking-wide">{tech.level}</span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <StarRating rating={tech.stars} color="#E28B14" />
                                </div>
                              </motion.div>
                            );
                          })}
                          
                          {/* Filler element if less than 8 items */}
                          {activeBook.technologies.length <= 4 && (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-black/10 rounded-xl p-6 text-center">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-black/50 block">End of Ledger Index</span>
                            </div>
                          )}
                        </div>

                      </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Scroll cue / next-page prompt, pinned to the panel's visible edge (not the scrolling content) */}
                  <AnimatePresence>
                    {pagesScroll.measured && (
                      <motion.div
                        key={pagesScroll.atEnd ? 'next' : 'scroll'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.35 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex justify-center"
                      >
                        {pagesScroll.overflowing && !pagesScroll.atEnd ? (
                          <div className="pointer-events-none flex flex-col items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}>
                              <ChevronDown size={13} className="text-amber-500" />
                            </motion.div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">Scroll</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleNextBook}
                            className="pointer-events-auto flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-colors duration-300"
                          >
                            Next Codex <ChevronRight size={13} />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                </div>

                {/* Elegant quote at the footer of the reader panel */}
                <div className="px-6 py-4 bg-[#0A0A0B] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 z-30">
                  <button
                    onClick={handlePrevBook}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-white/50 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-all duration-300"
                  >
                    <ChevronLeft size={13} /> Prev Codex
                  </button>

                  <p className="text-[11px] text-amber-500/80 italic font-light tracking-wide text-center">
                    “ I don't just use technologies. I learn them, build with them & master them. ”
                  </p>

                  <button
                    onClick={handleNextBook}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-white/50 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-all duration-300"
                  >
                    Next Codex <ChevronRight size={13} />
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  });

SolarSystemTech.displayName = 'SolarSystemTech';

export default SolarSystemTech;
