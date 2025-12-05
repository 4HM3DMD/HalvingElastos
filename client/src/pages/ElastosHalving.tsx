import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

const FlipDigit = ({ digit }: { digit: string }) => (
  <div className="w-[50px] sm:w-[60px] md:w-[70px] lg:w-[78.68px] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] relative flex-shrink-0">
    <img
      className="absolute top-0 left-px w-[calc(100%-4px)] h-[calc(50%-2px)]"
      alt="Elastos"
      src="/figmaAssets/elastos-1-1657x89600-2.png"
    />
    <img
      className="absolute bottom-0 left-px w-[calc(100%-4px)] h-[calc(50%-2px)]"
      alt="Elastos"
      src="/figmaAssets/elastos-1-1657x89600-3.png"
    />
    <div className="absolute top-1/2 right-0 w-1 h-1.5 bg-white rounded-[0px_0px_4px_4px]" />
    <div className="absolute top-1/2 left-0 w-1 h-1.5 bg-white rounded-[0px_0px_4px_4px]" />
    <div className="absolute top-[calc(50%-6px)] right-0 w-1 h-1.5 bg-[#ffffffe6] rounded-[0px_0px_4px_4px] -rotate-180" />
    <div className="absolute top-[calc(50%-6px)] left-px w-1 h-1.5 bg-[#ffffffe6] rounded-[0px_0px_4px_4px] -rotate-180" />
    <div className="absolute bottom-0 left-0.5 w-[calc(100%-4px)] h-[calc(50%-2px)] rounded-[20px_20px_0px_0px] -rotate-180 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]" />
    <div className="absolute inset-0 flex items-center justify-center [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] text-center tracking-[1.44px] sm:tracking-[1.76px] md:tracking-[2.08px] lg:tracking-[2.56px] leading-[normal]">
      {digit}
    </div>
  </div>
);

const TimeSeparator = () => (
  <div className="w-[7px] h-[18px] sm:h-[22px] md:h-[25px] lg:h-[27px] flex flex-col gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[13.2px] justify-center">
    <div className="w-[6.73px] h-[6.73px] bg-white rounded-[3.37px]" />
    <div className="w-[6.73px] h-[6.73px] bg-white rounded-[3.37px]" />
  </div>
);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number): string[] => {
    return num.toString().padStart(2, "0").split("");
  };

  const formatLargeNumber = (num: number): string[] => {
    return num.toString().padStart(3, "0").split("");
  };

  return (
    <div className="bg-[#141414] w-full min-h-screen flex flex-col items-center overflow-x-hidden pb-16">
      <div className="relative w-full flex flex-col items-center">
        <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[306px]">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Mask group"
            src="/figmaAssets/mask-group.png"
          />
        </div>

        <div className="relative -mt-[80px] sm:-mt-[100px] md:-mt-[120px] lg:-mt-[140px] mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <img
            className="w-[140px] sm:w-[180px] md:w-[220px] lg:w-[258px] h-auto object-contain"
            alt="Elastos"
            src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
          />
        </div>

        <h1 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[46px] text-center tracking-[1.12px] sm:tracking-[1.36px] md:tracking-[1.6px] lg:tracking-[1.84px] leading-[normal] [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4">
          Elastos Halving
        </h1>
      </div>

      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[964px] flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-auto lg:flex-shrink-0 bg-[#ffffff0d] rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal]">
                Days
              </div>
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {formatLargeNumber(timeLeft.days).map((digit, index) => (
                  <FlipDigit key={`day-${index}`} digit={digit} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:flex-1 bg-[#ffffff0d] rounded-[20px] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-around sm:justify-between gap-4 sm:gap-2">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal]">
                  Hours
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {formatDigit(timeLeft.hours).map((digit, index) => (
                    <FlipDigit key={`hour-${index}`} digit={digit} />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal]">
                  Minutes
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {formatDigit(timeLeft.minutes).map((digit, index) => (
                    <FlipDigit key={`minute-${index}`} digit={digit} />
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex items-center">
                <TimeSeparator />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl text-center tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-[normal]">
                  Seconds
                </div>
                <div className="flex gap-1 sm:gap-1.5 md:gap-2 items-center">
                  {formatDigit(timeLeft.seconds).map((digit, index) => (
                    <FlipDigit key={`second-${index}`} digit={digit} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#ffffff0d] rounded-[20px] py-4 sm:py-5 md:py-6 px-4 text-center">
          <span className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] lg:tracking-[0.72px] leading-[normal]">
            Estimated date & time of reward drop:{" "}
          </span>
          <span className="[font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-[#94b5ff] text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] lg:tracking-[0.72px] leading-[normal]">
            1 May 2026 15:38
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[25px]">
          {infoCards.map((card, index) => (
            <Card
              key={`info-card-${index}`}
              className="w-full sm:flex-1 h-auto min-h-[70px] sm:min-h-[76px] md:min-h-[82px] bg-[#95b5ff1a] rounded-2xl border-[0.5px] border-solid border-[#94b5ff]"
            >
              <CardContent className="p-4 sm:p-5 md:p-6 h-full flex items-center">
                <img
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0"
                  alt={card.label}
                  src={card.icon}
                />
                <div className="ml-3 sm:ml-4 md:ml-5 lg:ml-[20px] flex flex-col">
                  <div className="flex items-center justify-start [font-family:'PP_Telegraf-Regular',Helvetica] font-normal text-white text-base sm:text-lg md:text-xl tracking-[0.64px] sm:tracking-[0.72px] md:tracking-[0.80px] leading-6 sm:leading-7 md:leading-8 whitespace-nowrap">
                    {card.value}
                  </div>
                  <div className="flex items-center justify-start [font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xs sm:text-[13px] md:text-sm tracking-[0.48px] sm:tracking-[0.52px] md:tracking-[0.56px] leading-4 sm:leading-[18px] md:leading-5 whitespace-nowrap">
                    {card.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <footer className="mt-auto w-full bg-[#141414] border-t border-[rgba(255,255,255,0.1)] py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1422px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] leading-5 whitespace-nowrap">
              © 2025 Elastos. All rights reserved.
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] md:w-4 md:h-4 bg-[url(/figmaAssets/elastos.png)] bg-cover bg-[50%_50%]" />
              <div className="[font-family:'PP_Telegraf-Ultralight',Helvetica] font-normal text-white text-xs sm:text-sm md:text-base tracking-[0.48px] sm:tracking-[0.56px] md:tracking-[0.64px] leading-5 whitespace-nowrap">
                Elastos
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
