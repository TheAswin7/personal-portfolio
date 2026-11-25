
import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

// Curtain starts as a solid box (top+bottom halves meeting at the middle) and
// opens by collapsing each half back to its own edge - a widening "hole" at center.
const CURTAIN_CLOSED =
  'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 50%, 100% 50%, 100% 100%, 0% 100%)';
const CURTAIN_OPEN =
  'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 100%, 0% 100%)';

export interface RabbitHoleRevealProps {
  /** 0-1 scroll progress driving the open animation (share the host section's own progress) */
  progress: MotionValue<number>;
  /** [start, end] window of `progress` over which the curtain opens */
  range?: [number, number];
  /** Word shown in the upper half, slides up and away as the curtain opens */
  topText: string;
  /** Word shown in the lower half, slides down and away as the curtain opens */
  bottomText: string;
  className?: string;
}

export const RabbitHoleReveal: React.FC<RabbitHoleRevealProps> = ({
  progress,
  range = [0.24, 0.38],
  topText,
  bottomText,
  className,
}) => {
  const clipPath = useTransform(progress, range, [CURTAIN_CLOSED, CURTAIN_OPEN]);
  const topY = useTransform(progress, range, ['0%', '-140%']);
  const bottomY = useTransform(progress, range, ['0%', '140%']);
  const opacity = useTransform(progress, [range[1], Math.min(1, range[1] + 0.04)], [1, 0]);

  // Check mobile screen size to immediately open/fade curtain on touch screens
  const [isMobileScreen, setIsMobileScreen] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobileScreen(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobileScreen) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ clipPath, opacity }}
      className={cn(
        'pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black will-change-[clip-path]',
        className,
      )}
    >
      <div className="overflow-hidden">
        <motion.span
          style={{ y: topY }}
          className="block font-display text-[9vw] uppercase leading-[0.85] tracking-tighter text-orange-500 will-change-transform"
        >
          {topText}
        </motion.span>
      </div>
      <div className="overflow-hidden">
        <motion.span
          style={{ y: bottomY }}
          className="block font-display text-[9vw] uppercase leading-[0.85] tracking-tighter text-white will-change-transform"
        >
          {bottomText}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default RabbitHoleReveal;
