import { useRef, type FC } from 'react';
import { motion, useScroll, useReducedMotion } from 'motion/react';
import ScrollReveal from './ScrollReveal';
import { CurtainReveal } from './ui/curtain-reveal';
import { FocusRail } from './ui/focus-rail';
import {
  PythonLogo,
  OpenCVLogo,
  MediaPipeLogo,
  FlutterLogo,
  DartLogo,
  BluetoothLogo,
  PyTorchLogo,
  TensorFlowLogo,
  GeminiLogo,
  ReactLogo,
  NodejsLogo,
  CryptographyLogo,
  LinuxLogo,
  TypeScriptLogo,
  TailwindLogo,
} from './ui/tech-logos';

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY PROJECT DATA - placeholder content/images/links, shaped like real CS
// student work so the section reads naturally even before real projects go in.
// Swap title/description/tools/github/image for the real thing any time.
// ─────────────────────────────────────────────────────────────────────────────

interface DummyProject {
  id: string;
  index: string;
  title: string;
  description: string;
  tools: { name: string; Icon: FC }[];
  github: string;
  image: string;
}

const DUMMY_PROJECTS: DummyProject[] = [
  {
    id: 'gesture-control',
    index: '01',
    title: 'Real-Time Hand Gesture Control',
    description: 'Computer vision system that maps hand gestures to media playback and UI navigation in real time, running at 30+ FPS.',
    tools: [
      { name: 'Python', Icon: PythonLogo },
      { name: 'OpenCV', Icon: OpenCVLogo },
      { name: 'MediaPipe', Icon: MediaPipeLogo },
    ],
    github: 'https://github.com/your-username/gesture-control',
    image: 'https://picsum.photos/seed/gesture-control/900/600',
  },
  {
    id: 'offline-pay',
    index: '02',
    title: 'Offline P2P Payment App',
    description: 'Peer-to-peer payments over Bluetooth with zero internet dependency, built in a 24-hour hackathon sprint.',
    tools: [
      { name: 'Flutter', Icon: FlutterLogo },
      { name: 'Dart', Icon: DartLogo },
      { name: 'Bluetooth', Icon: BluetoothLogo },
    ],
    github: 'https://github.com/your-username/offline-pay',
    image: 'https://picsum.photos/seed/offline-pay/900/600',
  },
  {
    id: 'dl-diagnosis',
    index: '03',
    title: 'Deep Learning Cancer Diagnosis',
    description: 'Convolutional neural network for early-stage cancer detection from medical imaging, presented at ICRTAC 2024.',
    tools: [
      { name: 'PyTorch', Icon: PyTorchLogo },
      { name: 'TensorFlow', Icon: TensorFlowLogo },
      { name: 'Python', Icon: PythonLogo },
    ],
    github: 'https://github.com/your-username/dl-diagnosis',
    image: 'https://picsum.photos/seed/dl-diagnosis/900/600',
  },
  {
    id: 'ai-assistant',
    index: '04',
    title: 'AI Portfolio Assistant',
    description: 'A Gemini-powered chatbot embedded right in this site, answering visitor questions about my work in real time.',
    tools: [
      { name: 'Gemini API', Icon: GeminiLogo },
      { name: 'React', Icon: ReactLogo },
      { name: 'Node.js', Icon: NodejsLogo },
    ],
    github: 'https://github.com/your-username/ai-assistant',
    image: 'https://picsum.photos/seed/ai-assistant/900/600',
  },
  {
    id: 'ctf-toolkit',
    index: '05',
    title: 'CTF Crypto Toolkit',
    description: 'Scripts for cryptography and reverse-engineering challenges, built while competing in Yukthi CTF 2.0.',
    tools: [
      { name: 'Python', Icon: PythonLogo },
      { name: 'Cryptography', Icon: CryptographyLogo },
      { name: 'Linux', Icon: LinuxLogo },
    ],
    github: 'https://github.com/your-username/ctf-toolkit',
    image: 'https://picsum.photos/seed/ctf-toolkit/900/600',
  },
  {
    id: 'this-portfolio',
    index: '06',
    title: 'This Portfolio, Actually',
    description: 'The cinematic, scroll-driven site you\'re looking at right now — built from scratch with React and Framer Motion.',
    tools: [
      { name: 'React', Icon: ReactLogo },
      { name: 'TypeScript', Icon: TypeScriptLogo },
      { name: 'Tailwind', Icon: TailwindLogo },
    ],
    github: 'https://github.com/your-username/portfolio',
    image: 'https://picsum.photos/seed/this-portfolio/900/600',
  },
];

export default function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();

  // Mirrors the Journey section's fire-tip formula: a 300vh wrapper around a sticky
  // h-screen (100vh) inner div locks the header at exactly progress 0.25.
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ['start end', 'end start'],
  });

  const headerContent = (
    <div className="text-center relative px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-2 sm:mb-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-orange-500 font-bold">
          SELECTED WORK
        </span>
      </motion.div>

      <div className="flex items-center justify-center gap-8 mb-3 sm:mb-6 relative">
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-orange-500/50 to-transparent" />
        </div>

        <ScrollReveal preset="blur-reveal">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-white leading-none">
            THINGS <span className="text-orange-500" style={{ textShadow: '0 0 20px rgba(249,115,22,0.4)' }}>I'VE BUILT</span>
          </h2>
        </ScrollReveal>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-[200px]">
          <div className="h-[1px] flex-1 bg-gradient-to-l from-orange-500/50 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="hidden sm:block text-white/40 font-sans font-light tracking-wide text-sm md:text-base max-w-2xl mx-auto"
      >
        A placeholder lineup for now — swap in the real repos, screenshots and write-ups any time.
      </motion.p>
    </div>
  );

  const railItems = DUMMY_PROJECTS.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    meta: `${project.index} / ${String(DUMMY_PROJECTS.length).padStart(2, '0')}`,
    imageSrc: project.image,
    href: project.github,
  }));

  return (
    <section id="projects" className="panel relative bg-[#0A0806] overflow-hidden">
      {/* Ambient ember glow - the section stays branded by the fire that reveals it */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[140px] rounded-full" />

      {shouldReduceMotion ? (
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-44 md:pb-36">
          {headerContent}
          <div className="pt-16">
            <FocusRail items={railItems} loop />
          </div>
        </div>
      ) : (
        /* Curtain reveal - mirrors the About section's pattern: the actual cards sit
            revealed behind the curtain in the same pinned frame (not a separate scroll-away
            block below), so the flame dropping onto the rod and the drapes parting because
            of it hands off directly into the project grid, no extra scroll needed. */
        <div ref={introRef} className="relative h-[300vh] w-full">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden px-6 sm:gap-6 md:gap-8">
            <div className="relative z-0 flex w-full max-w-6xl flex-col items-center gap-4 sm:gap-6 md:gap-8">
              {headerContent}
              <FocusRail items={railItems} loop />
            </div>
            <CurtainReveal
              progress={introProgress}
              label="PROJECTS"
              caption="The flame catches the drapes..."
              openRange={[0.26, 0.4]}
              labelRange={[0.28, 0.42]}
              exitRange={[0.4, 0.5]}
            />
          </div>
        </div>
      )}
    </section>
  );
}
