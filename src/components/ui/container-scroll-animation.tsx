import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "motion/react";
import { cn } from "../../lib/utils";

export const ContainerScroll = ({
  titleComponent,
  children,
  containerClassName,
  cardClassName,
  glowColor = "#f97316",
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  /** overrides the outer scroll-driving container's height/spacing */
  containerClassName?: string;
  /** overrides the tilting card's height/max-width */
  cardClassName?: string;
  /** color of the ambient glow surrounding the card */
  glowColor?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);
  // Glow breathes in as the card settles flat
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 0.75]);

  return (
    <div
      className={cn(
        "h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20",
        containerClassName,
      )}
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} glowOpacity={glowOpacity} glowColor={glowColor} className={cardClassName}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  className,
  glowOpacity,
  glowColor = "#f97316",
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  glowOpacity?: MotionValue<number>;
  glowColor?: string;
}) => {
  return (
    <div className="relative mx-auto w-full max-w-7xl">
      {/* Glowing light surrounding the card */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -inset-6 md:-inset-12 rounded-[2.5rem] blur-3xl will-change-transform"
      >
        <div
          className="h-full w-full rounded-[2.5rem]"
          style={{
            background: `radial-gradient(circle, ${glowColor}55 0%, ${glowColor}22 45%, transparent 75%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{
          rotateX: rotate,
          scale,
        }}
        className={cn(
          "relative -mt-12 mx-auto h-[34rem] md:h-[46rem] w-full overflow-hidden rounded-[2rem]",
          // Glassmorphism: translucent frosted panel with a soft light rim
          "border border-white/15 bg-white/[0.06] backdrop-blur-2xl p-2 md:p-4",
          "shadow-[0_25px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]",
          className,
        )}
      >
        {/* Top light-catch highlight, classic glassmorphism cue */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2rem]" />
        <div className="relative h-full w-full overflow-hidden rounded-2xl">{children}</div>
      </motion.div>
    </div>
  );
};
