import React from 'react';
import { motion, useTransform, cubicBezier, type MotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

export interface FireSplashRevealProps {
  progress: MotionValue<number>;
  className?: string;
  label?: string;
  caption?: string;
}

/**
 * Scroll timeline (progress 0 -> 1 across the pinned Projects section):
 *
 *   0.00 -> 0.08  the flame rides a wire down from the top edge to the centre
 *   0.08          IMPACT: white-orange flash, burst, two shockwave rings, embers fly out
 *   0.08 -> 0.16  the blast throws the two black doors open (accelerating, so it reads as a blast)
 *   0.08 -> 0.17  "PROJECTS" title is lit by the blast, then dissolves
 *   0.18 -> 0.21  the (now empty) curtain layer is removed
 *
 * Everything is sized in vmax / vmin so it behaves the same on phones, tablets and desktops,
 * and nothing is scaled up by a large factor (which was expensive on mobile GPUs).
 */

const IMPACT = 0.08;
const BLAST_END = 0.16;

// Accelerating ease: doors start slowly then are thrown outward, like a pressure blast.
const blastEase = cubicBezier(0.7, 0, 0.84, 0);

interface EmberProps {
  progress: MotionValue<number>;
  angle: number;
  distance: number; // in vmin
  size: number; // in px
  delay?: number;
}

const Ember: React.FC<EmberProps> = ({ progress, angle, distance, size, delay = 0 }) => {
  const rad = (angle * Math.PI) / 180;
  const start = IMPACT + delay;
  const end = IMPACT + 0.1 + delay;
  const x = useTransform(progress, [start, end], ['0vmin', `${Math.cos(rad) * distance}vmin`]);
  const y = useTransform(progress, [start, end], ['0vmin', `${Math.sin(rad) * distance + 8}vmin`]);
  const opacity = useTransform(progress, [start, start + 0.01, end - 0.03, end], [0, 1, 0.9, 0]);
  const scale = useTransform(progress, [start, end], [1.4, 0.3]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ x, y, opacity, scale, width: size, height: size }}
      className="absolute left-1/2 top-1/2 -ml-[2px] -mt-[2px] rounded-full bg-amber-300 shadow-[0_0_10px_3px_rgba(249,115,22,0.9)] will-change-transform pointer-events-none z-[35]"
    />
  );
};

// Fixed spray pattern (angle in degrees, distance in vmin, size in px)
const EMBERS: Omit<EmberProps, 'progress'>[] = [
  { angle: -160, distance: 38, size: 5 },
  { angle: -130, distance: 46, size: 4, delay: 0.005 },
  { angle: -100, distance: 40, size: 6 },
  { angle: -75, distance: 48, size: 4, delay: 0.008 },
  { angle: -50, distance: 42, size: 5 },
  { angle: -20, distance: 36, size: 4, delay: 0.004 },
  { angle: 15, distance: 34, size: 5 },
  { angle: 45, distance: 30, size: 4, delay: 0.006 },
  { angle: 75, distance: 26, size: 5 },
  { angle: 110, distance: 28, size: 4, delay: 0.003 },
  { angle: 140, distance: 32, size: 5 },
  { angle: 170, distance: 36, size: 4, delay: 0.007 },
];

export const FireSplashReveal: React.FC<FireSplashRevealProps> = ({
  progress,
  className,
  caption = 'FEATURED WORKS & SYSTEMS',
}) => {
  // 1. Flame descending from the top edge to the centre
  const flameY = useTransform(progress, [0, IMPACT], ['-5%', '50%']);
  const flameScale = useTransform(progress, [0, IMPACT - 0.01, IMPACT + 0.01], [0.9, 1.3, 0]);
  const flameOpacity = useTransform(progress, [0, 0.01, IMPACT, IMPACT + 0.01], [0.9, 1, 1, 0]);

  // Spine wire the flame rides down
  const wireScaleY = useTransform(progress, [0, IMPACT], [0, 1]);
  const wireOpacity = useTransform(progress, [0, IMPACT, IMPACT + 0.008], [0.9, 1, 0]);

  // 2. Impact flash: a short, bright screen-wide pulse
  const flashOpacity = useTransform(progress, [IMPACT - 0.005, IMPACT + 0.006, BLAST_END], [0, 0.95, 0]);

  // Burst core + shockwaves. Sized in vmax and scaled 0 -> 1 only (cheap on mobile).
  const burstScale = useTransform(progress, [IMPACT, BLAST_END], [0.05, 1]);
  const burstOpacity = useTransform(progress, [IMPACT, IMPACT + 0.008, BLAST_END - 0.02, BLAST_END + 0.02], [0, 1, 0.8, 0]);

  const ringScale = useTransform(progress, [IMPACT, BLAST_END + 0.02], [0.05, 1]);
  const ringOpacity = useTransform(progress, [IMPACT, IMPACT + 0.008, BLAST_END + 0.02], [0, 1, 0]);

  const ring2Scale = useTransform(progress, [IMPACT + 0.01, BLAST_END + 0.04], [0.05, 1]);
  const ring2Opacity = useTransform(progress, [IMPACT + 0.01, IMPACT + 0.02, BLAST_END + 0.04], [0, 0.8, 0]);

  // 3. Seam scorch that rides with the flame and flares on impact
  const seamOpacity = useTransform(progress, [0.02, IMPACT, IMPACT + 0.03], [0.3, 1, 0]);
  const seamGlowOpacity = useTransform(progress, [IMPACT - 0.01, IMPACT + 0.01, IMPACT + 0.04], [0, 1, 0]);

  // 4. Title is lit up by the blast, then dissolves as the doors clear
  const textOpacity = useTransform(progress, [IMPACT, IMPACT + 0.012, 0.13, 0.17], [0, 1, 1, 0]);
  const textScale = useTransform(progress, [IMPACT, IMPACT + 0.02, 0.17], [0.7, 1, 1.2]);
  const captionOpacity = useTransform(progress, [IMPACT + 0.01, IMPACT + 0.025, 0.12, 0.16], [0, 1, 1, 0]);

  // 5. The blast throws the doors open, with a tiny recoil shake on impact
  const leftX = useTransform(progress, [IMPACT, BLAST_END], ['0%', '-105%'], { ease: blastEase });
  const rightX = useTransform(progress, [IMPACT, BLAST_END], ['0%', '105%'], { ease: blastEase });
  const shake = useTransform(
    progress,
    [IMPACT - 0.002, IMPACT + 0.003, IMPACT + 0.008, IMPACT + 0.013],
    [0, 5, -4, 0],
  );

  // 6. The curtain layer holds only the doors + effects, so once they are gone it is removed.
  // Once the blast is over it is fully hidden (display: none), so no wire, glow or tint can remain.
  const layerOpacity = useTransform(progress, [0.165, 0.185], [1, 0]);
  const display = useTransform(progress, (v) => (v >= 0.185 ? 'none' : 'flex'));
  const pointerEvents = useTransform(progress, (v) => (v >= BLAST_END ? 'none' : 'auto'));

  return (
    <motion.div
      style={{ opacity: layerOpacity, pointerEvents, display }}
      className={cn(
        // No background on the layer: only the two door panels are black, so the blast opens
        // them onto the section instead of fading a full-screen black sheet.
        'absolute inset-0 z-40 items-center justify-center overflow-hidden',
        className,
      )}
    >
      {/* Left door */}
      <motion.div
        style={{ x: leftX, y: shake }}
        className="absolute inset-y-0 left-0 w-1/2 bg-black will-change-transform z-10"
      >
        <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-orange-950/50 via-black/90 to-transparent" />
        <motion.div
          style={{ opacity: seamOpacity }}
          className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-orange-500 to-transparent shadow-[0_0_20px_#f97316]"
        />
      </motion.div>

      {/* Right door */}
      <motion.div
        style={{ x: rightX, y: shake }}
        className="absolute inset-y-0 right-0 w-1/2 bg-black will-change-transform z-10"
      >
        <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-orange-950/50 via-black/90 to-transparent" />
        <motion.div
          style={{ opacity: seamOpacity }}
          className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-orange-500 to-transparent shadow-[0_0_20px_#f97316]"
        />
      </motion.div>

      {/* Center seam laser glow */}
      <motion.div
        style={{ opacity: seamGlowOpacity }}
        className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-gradient-to-b from-orange-400 via-orange-500 to-transparent shadow-[0_0_45px_12px_rgba(249,115,22,0.9)] z-[15]"
      />

      {/* Spine wire */}
      <motion.div
        style={{ scaleY: wireScaleY, opacity: wireOpacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-[2px] bg-gradient-to-b from-orange-500 via-orange-400 to-white origin-top shadow-[0_0_15px_#f97316] z-20"
      />

      {/* Descending flame */}
      <motion.div
        style={{ top: flameY, scale: flameScale, opacity: flameOpacity, x: '-50%', y: '-50%' }}
        className="absolute left-1/2 z-30 flex flex-col items-center will-change-transform"
      >
        <motion.div
          animate={{
            scaleY: [1, 1.25, 0.9, 1.15, 1],
            scaleX: [1, 0.9, 1.08, 0.92, 1],
            rotate: [0, -3, 3, -1, 0],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-20 w-7 sm:h-24 sm:w-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-orange-700 via-orange-500 to-amber-300 shadow-[0_0_40px_#f97316]"
        />
        <motion.div
          animate={{ scaleY: [1, 0.88, 1.15, 0.95, 1], scaleX: [1, 1.1, 0.9, 1.05, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          className="-mt-12 sm:-mt-14 h-12 w-3.5 sm:h-14 sm:w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-amber-500 via-yellow-200 to-white shadow-[0_0_20px_#fff]"
        />
      </motion.div>

      {/* Impact flash */}
      <motion.div
        style={{ opacity: flashOpacity }}
        className="absolute inset-0 z-[32] pointer-events-none bg-[radial-gradient(circle_at_center,#ffffff_0%,#fde68a_18%,rgba(249,115,22,0.55)_45%,transparent_75%)]"
      />

      {/* Burst core */}
      <motion.div
        style={{ scale: burstScale, opacity: burstOpacity }}
        className="absolute left-1/2 top-1/2 h-[110vmax] w-[110vmax] -ml-[55vmax] -mt-[55vmax] rounded-full bg-[radial-gradient(circle,#fde047_0%,#f97316_30%,rgba(249,115,22,0.3)_55%,transparent_70%)] will-change-transform z-[25] pointer-events-none"
      />

      {/* Primary shockwave */}
      <motion.div
        style={{ scale: ringScale, opacity: ringOpacity }}
        className="absolute left-1/2 top-1/2 h-[100vmax] w-[100vmax] -ml-[50vmax] -mt-[50vmax] rounded-full border-[3px] border-orange-400 shadow-[0_0_60px_rgba(249,115,22,1)] will-change-transform z-[25] pointer-events-none"
      />

      {/* Secondary shockwave */}
      <motion.div
        style={{ scale: ring2Scale, opacity: ring2Opacity }}
        className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -ml-[40vmax] -mt-[40vmax] rounded-full border-2 border-amber-300/80 shadow-[0_0_40px_rgba(253,224,71,0.7)] will-change-transform z-[25] pointer-events-none"
      />

      {/* Flying embers */}
      {EMBERS.map((e, i) => (
        <Ember key={i} progress={progress} {...e} />
      ))}

      {/* Title lit by the blast */}
      <div className="relative z-30 flex flex-col items-center gap-3 px-4 sm:px-6 text-center select-none pointer-events-none">
        <motion.span
          style={{ opacity: textOpacity, scale: textScale }}
          className="block font-display text-[18vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter will-change-transform drop-shadow-[0_0_50px_rgba(249,115,22,0.9)]"
        >
          <span className="text-white">PRO</span>
          <span className="text-orange-500" style={{ textShadow: '0 0 50px rgba(249,115,22,1)' }}>
            JECTS
          </span>
        </motion.span>
        <motion.span
          style={{ opacity: captionOpacity }}
          className="font-mono text-[10px] sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.45em] text-orange-400 font-bold drop-shadow-[0_0_15px_rgba(249,115,22,0.7)]"
        >
          {caption}
        </motion.span>
      </div>
    </motion.div>
  );
};

// Aliases for compatibility
export const CurtainReveal = FireSplashReveal;
export default FireSplashReveal;
