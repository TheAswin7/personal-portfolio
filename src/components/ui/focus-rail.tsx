import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FocusRailItem {
  id: string | number;
  title: string;
  description?: string;
  meta?: string;
  imageSrc: string;
  href?: string;
}

interface FocusRailProps {
  items: FocusRailItem[];
  /** Auto-advance through the rail when the user isn't dragging/hovering it. */
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** Wrap around at the ends instead of clamping. */
  loop?: boolean;
  className?: string;
  onSelect?: (item: FocusRailItem, index: number) => void;
}

const SPACING = 300;
const ROTATE = 42;
const SWIPE_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 350;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function FocusRail({
  items,
  autoPlay = false,
  autoPlayInterval = 4000,
  loop = true,
  className,
  onSelect,
}: FocusRailProps) {
  const [index, setIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = items.length;
  const wheelLock = useRef(false);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        return loop ? (next + total) % total : clamp(next, 0, total - 1);
      });
    },
    [loop, total],
  );

  const goTo = useCallback((i: number) => setIndex(clamp(i, 0, total - 1)), [total]);

  useEffect(() => {
    if (items[index]) onSelect?.(items[index], index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Autoplay pauses the moment the rail is dragged or hovered
  useEffect(() => {
    if (!autoPlay || isInteracting || shouldReduceMotion || total <= 1) return;
    const id = window.setInterval(() => step(1), autoPlayInterval);
    return () => window.clearInterval(id);
  }, [autoPlay, autoPlayInterval, isInteracting, shouldReduceMotion, step, total]);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // leave vertical page scroll alone
    if (Math.abs(e.deltaX) < 24 || wheelLock.current) return;
    wheelLock.current = true;
    step(e.deltaX > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 450);
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className="relative h-[360px] sm:h-[440px] md:h-[520px] w-full select-none"
        style={{ perspective: 1400 }}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ touchAction: 'pan-y' }}
          drag={total > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsInteracting(true)}
          onDragEnd={(_, info) => {
            setIsInteracting(false);
            const { offset, velocity } = info;
            if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) step(1);
            else if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) step(-1);
          }}
          onHoverStart={() => setIsInteracting(true)}
          onHoverEnd={() => setIsInteracting(false)}
        >
          {items.map((item, i) => {
            let offset = i - index;
            if (loop && total > 2) {
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
            }
            const abs = Math.abs(offset);
            const isActive = offset === 0;
            if (abs > 3) return null;

            return (
              <motion.div
                key={item.id}
                className={cn(
                  'absolute w-[260px] sm:w-[300px] md:w-[360px] rounded-[1.75rem] overflow-hidden cursor-pointer border',
                  'bg-white/[0.06] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]',
                  isActive ? 'border-orange-500/40' : 'border-white/15',
                )}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  x: offset * SPACING,
                  rotateY: clamp(-offset * ROTATE, -65, 65),
                  scale: clamp(1 - abs * 0.16, 0.6, 1),
                  opacity: clamp(1 - abs * 0.3, 0, 1),
                  zIndex: 50 - Math.round(abs * 10),
                  filter: isActive ? 'blur(0px)' : `blur(${Math.min(abs, 2)}px)`,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                onClick={() => goTo(i)}
              >
                {/* Top light-catch highlight - classic glassmorphism cue */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-10" />

                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  {item.meta && (
                    <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                      {item.meta}
                    </span>
                  )}
                </div>

                <div className="p-5 md:p-6 space-y-2">
                  <h3 className="text-lg md:text-xl font-sans font-semibold tracking-tight text-white leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={cn(
                        'text-sm text-white/50 leading-relaxed',
                        isActive ? 'line-clamp-3' : 'line-clamp-2 opacity-70',
                      )}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.href && isActive && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 pt-1 text-orange-500 hover:text-orange-400 text-xs font-mono uppercase tracking-widest transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-6 mt-4 sm:mt-8">
          <button
            onClick={() => step(-1)}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-orange-500 hover:border-orange-500/60 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                aria-label={`Go to ${item.title}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/20 hover:bg-white/40',
                )}
              />
            ))}
          </div>

          <button
            onClick={() => step(1)}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-orange-500 hover:border-orange-500/60 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FocusRail;
