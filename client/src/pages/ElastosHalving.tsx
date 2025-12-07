import React, { useState, useEffect, useRef, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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

const FlipDigit = memo(({ digit, prevDigit }: { digit: string; prevDigit: string }) => {
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
          initial={hasChanged ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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

const TimeSeparator = () => (
  <motion.div 
    className="w-[7px] h-[18px] sm:h-[22px] md:h-[25px] lg:h-[27px] flex flex-col gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[13.2px] justify-center"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="w-[6.73px] h-[6.73px] bg-[#94b5ff] rounded-full shadow-[0_0_8px_rgba(149,181,255,0.5)]" />
    <div className="w-[6.73px] h-[6.73px] bg-[#94b5ff] rounded-full shadow-[0_0_8px_rgba(149,181,255,0.5)]" />
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
  const targetDate = new Date("2026-05-01T15:38:00");
  
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
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
    <div className="bg-[#141414] w-full min-h-screen flex flex-col items-center overflow-x-hidden pb-16">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[306px]">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Mask group"
            src="/figmaAssets/mask-group.png"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141414]" />
        </div>

        <motion.div 
          className="relative -mt-[80px] sm:-mt-[100px] md:-mt-[120px] lg:-mt-[140px] mb-4 sm:mb-6 md:mb-8 lg:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            className="w-[140px] sm:w-[180px] md:w-[220px] lg:w-[258px] h-auto object-contain drop-shadow-[0_0_30px_rgba(149,181,255,0.3)]"
            alt="Elastos"
            src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
          />
        </motion.div>

        <motion.h1 
          className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[46px] text-center tracking-[1.12px] sm:tracking-[1.36px] md:tracking-[1.6px] lg:tracking-[1.84px] leading-[normal] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Elastos Halving
        </motion.h1>
      </div>

      <motion.div 
        className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[964px] flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row gap-4 animate-pulse-glow rounded-[20px]">
          <div className="w-full lg:w-auto lg:flex-shrink-0 glass-panel rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/80 text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal] uppercase">
                Days
              </div>
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {daysDigits.map((digit, index) => (
                  <FlipDigit 
                    key={`day-${index}`} 
                    digit={digit} 
                    prevDigit={prevTimeRef.current.days[index] || '0'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:flex-1 glass-panel rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-around sm:justify-between gap-4 sm:gap-2">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/80 text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal] uppercase">
                  Hours
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {hoursDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`hour-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.hours[index] || '0'}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/80 text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal] uppercase">
                  Minutes
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {minutesDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`minute-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.minutes[index] || '0'}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/80 text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal] uppercase">
                  Seconds
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {secondsDigits.map((digit, index) => (
                    <FlipDigit 
                      key={`second-${index}`} 
                      digit={digit}
                      prevDigit={prevTimeRef.current.seconds[index] || '0'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full glass-panel rounded-[20px] py-4 sm:py-5 md:py-6 px-4 text-center">
          <span className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/70 text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] lg:tracking-[0.72px] leading-[normal]">
            Estimated date & time of reward drop:{" "}
          </span>
          <span className="[font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-[#94b5ff] text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] lg:tracking-[0.72px] leading-[normal]">
            1 May 2026 15:38
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[25px]">
          {infoCards.map((card, index) => (
            <motion.div
              key={`info-card-${index}`}
              className="w-full sm:flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: "easeOut" }}
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
                    <div className="flex items-center justify-start [font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-6 sm:leading-7 md:leading-8 whitespace-nowrap">
                      {card.value}
                    </div>
                    <div className="flex items-center justify-start [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/60 text-xs sm:text-[13px] md:text-sm tracking-[0.48px] sm:tracking-[0.52px] md:tracking-[0.56px] leading-4 sm:leading-[18px] md:leading-5 whitespace-nowrap">
                      {card.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <footer className="mt-auto w-full bg-[#141414] border-t border-white/5 py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1422px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/50 text-xs sm:text-sm md:text-base tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] leading-5 whitespace-nowrap">
              © 2025 Elastos. All rights reserved.
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[url(/figmaAssets/elastos.png)] bg-cover bg-center" />
              <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white/50 text-xs sm:text-sm md:text-base tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] leading-5 whitespace-nowrap">
                Elastos
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
