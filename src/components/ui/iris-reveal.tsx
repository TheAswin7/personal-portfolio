import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

export interface IrisRevealProps {
  /** 0-1 scroll progress driving the reveal - pass a locally-scoped scrollYProgress */
  progress: MotionValue<number>;
  /** [start, end] window of `progress` over which the black cover fades and the light blooms */
  openRange?: [number, number];
  /** window over which the label dissolves as the light overtakes it */
  labelRange?: [number, number];
  /** window over which the whole iris layer fades out, handing off cleanly to the content below */
  exitRange?: [number, number];
  label: string;
  caption?: string;
  className?: string;
}

export const IrisReveal: React.FC<IrisRevealProps> = ({
  progress,
  openRange = [0.05, 0.35],
  labelRange = [0.15, 0.4],
  exitRange = [0.3, 0.48],
  label,
  caption,
  className,
}) => {
  // Solid cover: fully opaque black at rest, fades away to reveal whatever sits behind it
  const coverOpacity = useTransform(progress, openRange, [1, 0]);
  // The "light at the end of the tunnel": a small dot that blooms into a soft glow, then recedes
  const glowScale = useTransform(progress, openRange, [0.15, 3]);
  const glowOpacity = useTransform(progress, [openRange[0], openRange[1], exitRange[1]], [0.9, 1, 0]);
  const labelOpacity = useTransform(progress, labelRange, [1, 0]);
  const labelScale = useTransform(progress, labelRange, [1, 1.4]);
  const captionOpacity = useTransform(progress, [0, openRange[0] + 0.05], [1, 0]);
  // Once fully open, the whole iris layer disappears so nothing lingers over the revealed content
  const layerOpacity = useTransform(progress, exitRange, [1, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: layerOpacity }}
      className={cn(
        'pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden',
        className,
      )}
    >
      <motion.div style={{ opacity: coverOpacity }} className="absolute inset-0 bg-black" />

      <motion.div
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="absolute h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.55)_0%,rgba(249,115,22,0.15)_45%,transparent_75%)] will-change-transform"
      />

      <div className="absolute h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_20px_8px_rgba(249,115,22,0.6)]" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <motion.span
          style={{ opacity: labelOpacity, scale: labelScale }}
          className="block font-display text-[12vw] uppercase leading-none tracking-tighter text-white will-change-transform"
        >
          {label}
        </motion.span>
        {caption && (
          <motion.span
            style={{ opacity: captionOpacity }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-orange-500/70"
          >
            {caption}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default IrisReveal;
