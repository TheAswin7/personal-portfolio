import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

// Pleated velvet texture - repeating vertical folds catching light/shadow like real stage drapery
const PLEAT_TEXTURE =
  'repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0px, rgba(80,32,8,0.5) 5%, rgba(0,0,0,0.6) 10%, rgba(120,52,12,0.45) 15%, rgba(0,0,0,0.55) 20%)';

export interface CurtainRevealProps {
  /** 0-1 scroll progress driving the reveal - pass a locally-scoped scrollYProgress */
  progress: MotionValue<number>;
  /** [start, end] window of `progress` over which the flame catches the rod and the curtain parts */
  openRange?: [number, number];
  /** window over which the label dissolves as the curtain parts */
  labelRange?: [number, number];
  /** window over which the whole curtain layer fades out, handing off cleanly to the content below */
  exitRange?: [number, number];
  label: string;
  caption?: string;
  className?: string;
}

export const CurtainReveal: React.FC<CurtainRevealProps> = ({
  progress,
  openRange = [0.05, 0.35],
  labelRange = [0.14, 0.36],
  exitRange = [0.3, 0.48],
  label,
  caption,
  className,
}) => {
  const [openStart, openEnd] = openRange;
  // The flame (carried over from the timeline's spine tip) is touching the rod from the
  // start and grows hotter until it catches - everything downstream of that catch - the
  // ignite flash, the panels parting - is a direct consequence, not a parallel animation.
  const igniteAt = openStart + (openEnd - openStart) * 0.42;

  // The flame sits touching the rod for the entire window - not falling in from off-screen
  // (which would sit above the viewport and get clipped, so it'd just "pop in" already
  // arrived) - it's visibly in contact from the moment this section pins, and simply
  // grows hotter until it catches.
  const flameScale = useTransform(progress, [openStart, igniteAt], [0.5, 1.25]);
  const flameOpacity = useTransform(
    progress,
    [openStart, openStart + (igniteAt - openStart) * 0.15, igniteAt, openEnd],
    [0.6, 1, 1, 0],
  );

  // The ignition burst - a bright flash right where the flame meets the rod
  const burstScale = useTransform(progress, [igniteAt, openEnd], [0.2, 6]);
  const burstOpacity = useTransform(
    progress,
    [igniteAt, igniteAt + (openEnd - igniteAt) * 0.25, openEnd],
    [0, 0.9, 0],
  );

  // The rod itself catches: a scorch glow spreading along its length once the flame lands
  const rodGlowOpacity = useTransform(progress, [igniteAt, igniteAt + (openEnd - igniteAt) * 0.3], [0, 1]);
  const rodGlowWidth = useTransform(progress, [igniteAt, openEnd], ['0%', '100%']);

  // The drapes only let go once the fire has actually caught - parting is the effect, not a
  // parallel animation - so both panels stay put until igniteAt. Driven directly off the raw
  // scroll progress (same input as the flame/burst/label above) so the parting tracks the
  // scrollbar 1:1 with no spring lag - scrolling back up un-parts it just as fast.
  const leftX = useTransform(progress, [igniteAt, openEnd], ['0%', '-102%']);
  const rightX = useTransform(progress, [igniteAt, openEnd], ['0%', '102%']);
  const leftSkew = useTransform(progress, [igniteAt, igniteAt + (openEnd - igniteAt) * 0.3, openEnd], [0, -2, 0]);
  const rightSkew = useTransform(progress, [igniteAt, igniteAt + (openEnd - igniteAt) * 0.3, openEnd], [0, 2, 0]);

  const labelOpacity = useTransform(progress, labelRange, [1, 0]);
  const labelScale = useTransform(progress, labelRange, [1, 1.35]);
  const captionOpacity = useTransform(progress, [0, openStart + 0.05], [1, 0]);
  // Once fully parted, the whole curtain layer disappears so nothing lingers over the revealed content
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
      {/* Curtain rod - glows and scorches outward from center once the flame lands */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-white/10 to-transparent" />
      <motion.div
        style={{ opacity: rodGlowOpacity, width: rodGlowWidth }}
        className="absolute top-0 left-1/2 -translate-x-1/2 h-2 bg-gradient-to-b from-orange-400 to-transparent shadow-[0_0_16px_4px_rgba(249,115,22,0.8)]"
      />

      {/* Left drape */}
      <motion.div
        style={{ x: leftX, skewY: leftSkew }}
        className="absolute inset-y-0 left-0 w-1/2 origin-right will-change-transform"
      >
        <div className="absolute inset-0 bg-[#0A0806]" style={{ backgroundImage: PLEAT_TEXTURE }} />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-orange-500/60 to-transparent" />
      </motion.div>

      {/* Right drape */}
      <motion.div
        style={{ x: rightX, skewY: rightSkew }}
        className="absolute inset-y-0 right-0 w-1/2 origin-left will-change-transform"
      >
        <div className="absolute inset-0 bg-[#0A0806]" style={{ backgroundImage: PLEAT_TEXTURE }} />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-orange-500/60 to-transparent" />
      </motion.div>

      {/* Ignition burst - the moment the flame actually touches the rod */}
      <motion.div
        style={{ scale: burstScale, opacity: burstOpacity }}
        className="absolute top-0 h-40 w-40 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.9)_0%,rgba(249,115,22,0.5)_45%,transparent_75%)] mix-blend-screen will-change-transform"
      />

      {/* The flame itself, carried over from the timeline's spine tip, already touching the
          rod and hanging down from it - it just grows hotter until it catches */}
      <motion.div
        style={{ scale: flameScale, opacity: flameOpacity }}
        className="absolute top-0 z-10 flex flex-col items-center origin-top will-change-transform"
      >
        <motion.div
          animate={{ scaleY: [1, 1.15, 0.92, 1.08, 1], scaleX: [1, 0.9, 1.05, 0.95, 1], rotate: [0, -4, 3, -2, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-14 w-5 origin-top rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-b from-orange-700 via-orange-500 to-amber-300 shadow-[0_0_20px_#f97316]"
        />
        <motion.div
          animate={{ scaleY: [1, 0.9, 1.12, 0.95, 1], scaleX: [1, 1.08, 0.9, 1.05, 1], rotate: [0, 3, -3, 2, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          className="-mt-9 h-8 w-2.5 origin-top rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-b from-amber-500 via-yellow-300 to-white"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <motion.span
          style={{ opacity: labelOpacity, scale: labelScale }}
          className="block font-display text-[11vw] uppercase leading-none tracking-tighter text-white will-change-transform"
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

export default CurtainReveal;
