import { useState, useEffect, useRef, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Zap, TrendingDown, Clock } from "lucide-react";

const infoCards = [
  {
    icon: "/figmaAssets/svg.svg",
    value: "45,620",
    label: "Current Block",
  },
  {
    icon: "/figmaAssets/group-40062.png",
    value: "5,620",
    label: "Elastos Halving at Block",
  },
  {
    icon: "/figmaAssets/group-40064.png",
    value: "34,340",
    label: "Block To Go",
  },
];

const FlipDigit = memo(({ digit, prevDigit, prefersReducedMotion = false }: { digit: string; prevDigit: string; prefersReducedMotion?: boolean }) => {
  const hasChanged = digit !== prevDigit;
  
  return (
    <div className="flip-card-container w-[50px] sm:w-[60px] md:w-[70px] lg:w-[80px] h-[65px] sm:h-[75px] md:h-[85px] lg:h-[95px] relative flex-shrink-0">
      <div className="absolute inset-0 bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/10" />
      </div>
      
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={prefersReducedMotion ? false : (hasChanged ? { rotateX: -90, opacity: 0 } : false)}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center font-light text-white text-[40px] sm:text-[48px] md:text-[56px] lg:text-[68px] text-center tracking-tight leading-none"
          style={{ transformStyle: 'preserve-3d', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

FlipDigit.displayName = 'FlipDigit';

const TimeSeparator = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => (
  <motion.div 
    className="w-[7px] h-[18px] sm:h-[22px] md:h-[25px] lg:h-[27px] flex flex-col gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[13.2px] justify-center"
    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
    transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="w-[6.73px] h-[6.73px] bg-[#94b5ff] rounded-full shadow-[0_0_8px_rgba(149,181,255,0.5)]" />
    <div className="w-[6.73px] h-[6.73px] bg-[#94b5ff] rounded-full shadow-[0_0_8px_rgba(149,181,255,0.5)]" />
  </motion.div>
);

const ProgressRing = ({ progress, prefersReducedMotion }: { progress: number; prefersReducedMotion: boolean }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]">
      <svg className="w-full h-full progress-ring" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={prefersReducedMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94b5ff" />
            <stop offset="100%" stopColor="#5a8cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white">{progress.toFixed(1)}%</span>
        <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">Complete</span>
      </div>
    </div>
  );
};

const StatBadge = ({ icon: Icon, value, label, delay, prefersReducedMotion }: { icon: React.ElementType; value: string; label: string; delay: number; prefersReducedMotion: boolean }) => (
  <motion.div
    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 glass-panel rounded-full"
    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay, ease: "easeOut" }}
  >
    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#94b5ff]/10 rounded-full">
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94b5ff]" />
    </div>
    <div className="flex flex-col">
      <span className="text-white text-sm sm:text-base font-medium leading-tight">{value}</span>
      <span className="text-white/50 text-[10px] sm:text-xs leading-tight">{label}</span>
    </div>
  </motion.div>
);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeLeftRef {
  days: string[];
  hours: string[];
  minutes: string[];
  seconds: string[];
}

export const ElastosHalving = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const targetDate = new Date("2026-05-01T15:38:00");
  const startDate = new Date("2024-05-01T00:00:00");
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const calculateProgress = (): number => {
    const totalDuration = +targetDate - +startDate;
    const elapsed = +new Date() - +startDate;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [progress, setProgress] = useState<number>(calculateProgress());
  const prevTimeRef = useRef<TimeLeftRef>({
    days: ['0', '0', '0'],
    hours: ['0', '0'],
    minutes: ['0', '0'],
    seconds: ['0', '0'],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = calculateTimeLeft();
        prevTimeRef.current = {
          days: prev.days.toString().padStart(3, "0").split(""),
          hours: prev.hours.toString().padStart(2, "0").split(""),
          minutes: prev.minutes.toString().padStart(2, "0").split(""),
          seconds: prev.seconds.toString().padStart(2, "0").split(""),
        };
        return newTime;
      });
      setProgress(calculateProgress());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number): string[] => {
    return num.toString().padStart(2, "0").split("");
  };

  const formatLargeNumber = (num: number): string[] => {
    return num.toString().padStart(3, "0").split("");
  };

  const daysDigits = formatLargeNumber(timeLeft.days);
  const hoursDigits = formatDigit(timeLeft.hours);
  const minutesDigits = formatDigit(timeLeft.minutes);
  const secondsDigits = formatDigit(timeLeft.seconds);

  return (
    <div className="bg-[#0d0d0d] w-full min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animated-grid opacity-50" />
          <div className="absolute inset-0 radial-glow" />
          
          <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-[#94b5ff]/30 rounded-full animate-particle" />
          <div className="absolute top-[30%] right-[20%] w-1.5 h-1.5 bg-[#94b5ff]/20 rounded-full animate-particle-delayed" />
          <div className="absolute top-[40%] left-[25%] w-1 h-1 bg-white/20 rounded-full animate-particle-slow" />
          <div className="absolute top-[25%] right-[30%] w-2 h-2 bg-[#94b5ff]/25 rounded-full animate-particle" />
          <div className="absolute top-[35%] left-[40%] w-1.5 h-1.5 bg-white/15 rounded-full animate-particle-delayed" />
        </div>

        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            alt="Background"
            src="/figmaAssets/mask-group.png"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/30 via-transparent to-[#0d0d0d]" />
        </div>

        <div className="relative -mt-[100px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] flex flex-col items-center px-4">
          <motion.div 
            className={`mb-6 sm:mb-8 ${prefersReducedMotion ? '' : 'animate-float'}`}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
          >
            <img
              className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] h-auto object-contain drop-shadow-[0_0_40px_rgba(149,181,255,0.4)]"
              alt="Elastos"
              src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
            />
          </motion.div>

          <motion.h1 
            className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-center tracking-tight leading-none font-light text-white mb-3 sm:mb-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Elastos Halving
          </motion.h1>

          <motion.p
            className="text-white/60 text-sm sm:text-base md:text-lg text-center max-w-[500px] mb-4 sm:mb-6"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            Block rewards reduced by 50%. A milestone event for the Elastos ecosystem.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <StatBadge icon={TrendingDown} value="50%" label="Reward Reduction" delay={0.4} prefersReducedMotion={prefersReducedMotion} />
            <StatBadge icon={Zap} value="1.5 ELA" label="New Block Reward" delay={0.5} prefersReducedMotion={prefersReducedMotion} />
            <StatBadge icon={Clock} value="4 Years" label="Halving Cycle" delay={0.6} prefersReducedMotion={prefersReducedMotion} />
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <ProgressRing progress={progress} prefersReducedMotion={prefersReducedMotion} />
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.8, ease: "easeOut" }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <Button 
              variant="outline" 
              className={`group glass-panel-accent border-[#94b5ff]/30 text-white hover:bg-[#94b5ff]/20 ${prefersReducedMotion ? '' : 'animate-cta-pulse'} px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base`}
              onClick={() => window.open('https://elastos.info', '_blank')}
            >
              Learn More About Elastos
              <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[964px] flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-0"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.9, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row gap-4 animate-pulse-glow rounded-[20px]">
          <div className="w-full lg:w-auto lg:flex-shrink-0 glass-panel rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="font-light text-white/60 text-sm sm:text-base md:text-lg text-center tracking-widest leading-[normal] uppercase">
                Days
              </div>
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {daysDigits.map((digit, index) => (
                  <FlipDigit 
                    key={`day-${index}`} 
                    digit={digit} 
                    prevDigit={prevTimeRef.current.days[index] || '0'}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:flex-1 glass-panel rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-around sm:justify-between gap-4 sm:gap-2">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="font-light text-white/60 text-sm sm:text-base md:text-lg text-center tracking-widest leading-[normal] uppercase">
                  Hours
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {hoursDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`hour-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.hours[index] || '0'}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator prefersReducedMotion={prefersReducedMotion} />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="font-light text-white/60 text-sm sm:text-base md:text-lg text-center tracking-widest leading-[normal] uppercase">
                  Minutes
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {minutesDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`minute-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.minutes[index] || '0'}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator prefersReducedMotion={prefersReducedMotion} />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="font-light text-white/60 text-sm sm:text-base md:text-lg text-center tracking-widest leading-[normal] uppercase">
                  Seconds
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {secondsDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`second-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.seconds[index] || '0'}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full glass-panel rounded-[20px] py-4 sm:py-5 md:py-6 px-4 text-center">
          <span className="font-light text-white/50 text-xs sm:text-sm md:text-base lg:text-lg tracking-wide leading-[normal]">
            Estimated date & time of reward drop:{" "}
          </span>
          <span className="font-medium text-[#94b5ff] text-xs sm:text-sm md:text-base lg:text-lg tracking-wide leading-[normal]">
            1 May 2026 15:38
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[25px] pb-8">
          {infoCards.map((card, index) => (
            <motion.div
              key={`info-card-${index}`}
              className="w-full sm:flex-1"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 1.0 + index * 0.1, ease: "easeOut" }}
            >
              <Card
                className="w-full h-auto min-h-[70px] sm:min-h-[76px] md:min-h-[82px] glass-panel-accent rounded-2xl hover-glow cursor-default"
              >
                <CardContent className="p-4 sm:p-5 md:p-6 h-full flex items-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-[#94b5ff]/10 rounded-lg">
                    <img
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                      alt={card.label}
                      src={card.icon}
                    />
                  </div>
                  <div className="ml-3 sm:ml-4 md:ml-5 flex flex-col">
                    <div className="flex items-center justify-start font-medium text-white text-base sm:text-lg md:text-xl tracking-wide leading-6 sm:leading-7 md:leading-8 whitespace-nowrap">
                      {card.value}
                    </div>
                    <div className="flex items-center justify-start font-light text-white/50 text-xs sm:text-[13px] md:text-sm tracking-wide leading-4 sm:leading-[18px] md:leading-5 whitespace-nowrap">
                      {card.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <footer className="mt-auto w-full bg-[#0d0d0d] border-t border-white/5 py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1422px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="font-light text-white/40 text-xs sm:text-sm md:text-base tracking-wide leading-5 whitespace-nowrap">
              © 2025 Elastos. All rights reserved.
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[url(/figmaAssets/elastos.png)] bg-cover bg-center" />
              <div className="font-light text-white/40 text-xs sm:text-sm md:text-base tracking-wide leading-5 whitespace-nowrap">
                Elastos
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
