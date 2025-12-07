import { useState, useEffect, useRef, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Blocks, Target, ArrowRight } from "lucide-react";

const FlipDigit = memo(({ digit, prevDigit, prefersReducedMotion = false }: { digit: string; prevDigit: string; prefersReducedMotion?: boolean }) => {
  const hasChanged = digit !== prevDigit;
  
  return (
    <div className="digit-card">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e24] to-[#16161a] rounded-lg border border-white/10">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent rounded-t-lg" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/50" />
      </div>
      
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={prefersReducedMotion ? false : (hasChanged ? { rotateX: -90, opacity: 0 } : false)}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center text-white digit-text"
          style={{ transformStyle: 'preserve-3d' }}
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
    className="flex flex-col gap-2 mx-2 sm:mx-3"
    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
    transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="w-2 h-2 bg-[#94b5ff] rounded-full" />
    <div className="w-2 h-2 bg-[#94b5ff] rounded-full" />
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

  const infoCards = [
    {
      icon: Blocks,
      value: "2,419,200",
      label: "Current Block",
    },
    {
      icon: Target,
      value: "2,630,880",
      label: "Halving Block",
    },
    {
      icon: ArrowRight,
      value: "211,680",
      label: "Blocks To Go",
    },
  ];

  return (
    <div className="halving-page">
      <div className="hero-section">
        <div className="hero-bg" />
        <div className="hero-glow" />
        
        <div className="hero-content">
          <motion.div 
            className="logo-container"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          >
            <img
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
              alt="Elastos"
              src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
            />
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Elastos Halving Countdown
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Block rewards will be reduced by 50% at the next halving event
          </motion.p>

          <motion.div
            className="progress-container"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="progress-bar-bg">
              <motion.div 
                className="progress-bar-fill"
                initial={prefersReducedMotion ? { width: `${progress}%` } : { width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <div className="progress-labels">
              <span className="text-white/50 text-xs sm:text-sm" data-testid="text-progress">{progress.toFixed(1)}% Complete</span>
              <span className="text-[#94b5ff] text-xs sm:text-sm font-medium" data-testid="text-target-date">May 1, 2026</span>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="main-content">
        <motion.div 
          className="countdown-container"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="countdown-grid">
            <div className="time-unit" data-testid="countdown-days">
              <span className="time-label">Days</span>
              <div className="digits-row">
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

            <div className="time-unit" data-testid="countdown-hours">
              <span className="time-label">Hours</span>
              <div className="digits-row">
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

            <div className="hidden md:flex items-end pb-4">
              <TimeSeparator prefersReducedMotion={prefersReducedMotion} />
            </div>

            <div className="time-unit" data-testid="countdown-minutes">
              <span className="time-label">Minutes</span>
              <div className="digits-row">
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

            <div className="hidden md:flex items-end pb-4">
              <TimeSeparator prefersReducedMotion={prefersReducedMotion} />
            </div>

            <div className="time-unit" data-testid="countdown-seconds">
              <span className="time-label">Seconds</span>
              <div className="digits-row">
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
        </motion.div>

        <motion.div 
          className="info-cards-grid"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {infoCards.map((card, index) => (
            <Card
              key={`info-card-${index}`}
              className="info-card"
              data-testid={`card-info-${index}`}
            >
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className="icon-container">
                  <card.icon className="w-5 h-5 text-[#94b5ff]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-lg sm:text-xl font-semibold tabular-nums">
                    {card.value}
                  </span>
                  <span className="text-white/50 text-xs sm:text-sm">
                    {card.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          className="cta-section"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Button 
            variant="outline"
            size="lg"
            className="cta-button"
            onClick={() => window.open('https://elastos.info', '_blank')}
            data-testid="button-learn-more"
          >
            Learn More About Elastos
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </main>

      <footer className="page-footer">
        <div className="footer-content">
          <span className="text-white/40 text-sm">
            © 2025 Elastos Foundation. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <img 
              src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png" 
              alt="Elastos" 
              className="w-5 h-5 object-contain opacity-40"
            />
            <span className="text-white/40 text-sm">Elastos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
