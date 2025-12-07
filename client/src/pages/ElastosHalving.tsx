import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlockchainData, padNumber } from "@/hooks/useBlockchainData";
import { SEO } from "@/components/SEO";

// SVG Icons
const FlameIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const InfinityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>
  </svg>
);

const BitcoinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-2v1h-1v2h1v4h-1v2h1v1h2v-1h.5c1.38 0 2.5-1.12 2.5-2.5 0-.89-.47-1.67-1.17-2.11.42-.39.67-.94.67-1.54C15 8.57 13.93 7.5 12.5 7.5V7zm0 7h-.5v-2h.5c.55 0 1 .45 1 1s-.45 1-1 1zm0-4h-.5V9h.5c.55 0 1 .45 1 1s-.45 1-1 1z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse bg-white/10 rounded h-6 w-20" />
);

// Fixed constants
const FIXED_DATA = {
  maxSupply: "28,219,999",
  burnedTokens: "13,000,000",
  blockTime: "~2 min",
  halvingInterval: "1,051,200",
};

// Premium Flip Digit Component
const FlipDigit = memo(({ digit, prevDigit }: { digit: string; prevDigit: string }) => {
  const hasChanged = digit !== prevDigit;
  
  return (
    <div className="flip-card-container relative flex-shrink-0
      w-[44px] sm:w-[52px] md:w-[60px] lg:w-[72px]
      h-[58px] sm:h-[68px] md:h-[80px] lg:h-[96px]">
      
      {/* Card Background */}
      <div className="digit-card-premium absolute inset-0" />
      
      {/* Digit */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={hasChanged ? { 
            rotateX: -90, 
            opacity: 0,
          } : false}
          animate={{ 
            rotateX: 0, 
            opacity: 1,
          }}
          exit={{ 
            rotateX: 90, 
            opacity: 0,
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1]
          }}
          className={`absolute inset-0 flex items-center justify-center digit-text
            text-[28px] sm:text-[34px] md:text-[42px] lg:text-[54px]
            ${hasChanged ? 'digit-glow' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

FlipDigit.displayName = 'FlipDigit';

// Time Unit Component
const TimeUnit = ({ 
  label, 
  digits, 
  prevDigits, 
  prefix 
}: { 
  label: string; 
  digits: string[]; 
  prevDigits: string[]; 
  prefix: string;
}) => (
  <div className="flex flex-col items-center gap-2 sm:gap-3">
    <span className="time-label text-[10px] sm:text-xs">{label}</span>
    <div className="flex gap-1 sm:gap-1.5 md:gap-2">
      {digits.map((digit, index) => (
        <FlipDigit 
          key={`${prefix}-${index}`} 
          digit={digit} 
          prevDigit={prevDigits[index] || '0'}
        />
      ))}
    </div>
  </div>
);

export const ElastosHalving = (): JSX.Element => {
  // Fetch live blockchain data with countdown
  const { data: blockchainData, isLoading, countdown, prevCountdown } = useBlockchainData(30000); // Poll every 30 seconds

  const formatDigit = (num: number): string[] => {
    return num.toString().padStart(2, "0").split("");
  };

  const formatLargeNumber = (num: number): string[] => {
    return num.toString().padStart(3, "0").split("");
  };

  // Current digits
  const daysDigits = formatLargeNumber(countdown.days);
  const hoursDigits = formatDigit(countdown.hours);
  const minutesDigits = formatDigit(countdown.minutes);
  
  // Previous digits for flip animation
  const prevDaysDigits = formatLargeNumber(prevCountdown.days);
  const prevHoursDigits = formatDigit(prevCountdown.hours);
  const prevMinutesDigits = formatDigit(prevCountdown.minutes);

  // Progress calculation from live API data
  const progressPercent = blockchainData?.progressPercentFormatted || "0";
  const blocksRemaining = blockchainData?.blocksRemaining || 0;
  
  // Calculate next halving number with ordinal suffix
  const currentHalvingNumber = blockchainData?.halvingNumber || 1;
  const nextHalvingNumber = currentHalvingNumber + 1;
  const getOrdinalSuffix = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const nextHalvingOrdinal = getOrdinalSuffix(nextHalvingNumber);
  
  // Calculate dynamic percentages and dates
  const circulatingSupply = blockchainData?.circulatingSupply || 26160841;
  const maxSupply = 28219999;
  const issuedPercent = Math.round((circulatingSupply / maxSupply) * 100);
  
  // Calculate years until final supply (approximate)
  const remainingToMine = blockchainData?.remainingToMine || (maxSupply - circulatingSupply);
  const avgBlocksPerYear = 365.25 * 24 * 30; // ~262,980 blocks/year at 2min
  const yearsRemaining = Math.round(remainingToMine / (blockchainData?.currentReward || 1.522) / avgBlocksPerYear);
  
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Calculate halving era labels dynamically
  const firstHalvingYear = 2021;
  const yearsPerHalving = 4;
  const currentEraStart = firstHalvingYear + (currentHalvingNumber - 1) * yearsPerHalving;
  const currentEraEnd = currentEraStart + yearsPerHalving;
  const nextEraStart = currentEraEnd;
  
  // Scaled progress for visual display - ensures remaining portion is always visible
  // When > 90%, compress the display so remaining takes up more visual space
  const actualProgress = parseFloat(progressPercent);
  const scaledProgress = actualProgress > 90 
    ? 90 + (actualProgress - 90) * 0.5  // Compress final 10% to take 5% visual space
    : actualProgress;                     // Linear below 90%

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-x-hidden bg-[#141414]">
      {/* Dynamic SEO Meta Tags */}
      <SEO 
        currentBlock={blockchainData?.currentBlock}
        blocksRemaining={blockchainData?.blocksRemaining}
        estimatedDate={blockchainData?.estimatedHalvingDate}
        progressPercent={blockchainData?.progressPercentFormatted}
      />
      
      {/* Background with subtle texture */}
      <div className="gradient-mesh-bg" />
      
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center pb-8 sm:pb-12 md:pb-16">
        {/* Header with masked image */}
      <div className="relative w-full flex flex-col items-center">
          <div className="relative w-full h-[120px] sm:h-[160px] md:h-[220px] lg:h-[280px]">
            {/* Base Image Layer */}
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
              alt="Background"
            src="/figmaAssets/mask-group.png"
          />
            
            {/* Gradient Overlay - fades image to background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141414]" />
        </div>

          {/* Logo */}
        <motion.div 
            className="relative -mt-[50px] sm:-mt-[70px] md:-mt-[100px] lg:-mt-[120px] mb-4 sm:mb-6 md:mb-8 lg:mb-10"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
              className="w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px] h-auto object-contain"
            alt="Elastos"
            src="/figmaAssets/elastos-1-1680x919--22--copy00-1.png"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(149, 181, 255, 0.3)) drop-shadow(0 0 80px rgba(149, 181, 255, 0.15))'
              }}
          />
        </motion.div>

          {/* Title */}
        <motion.h1 
            className="text-[26px] sm:text-[34px] md:text-[46px] lg:text-[58px] text-center tracking-[-0.02em] leading-[1.1] font-light text-white mb-1 sm:mb-2 md:mb-3 px-4"
            style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Elastos Halving
        </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-white/40 text-xs sm:text-sm md:text-base tracking-wide mb-6 sm:mb-8 md:mb-12 lg:mb-16"
            style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Live countdown to the {nextHalvingOrdinal} ELA halving
          </motion.p>
      </div>

        {/* Main Countdown Section */}
      <motion.div 
          className="w-full max-w-[98%] sm:max-w-[94%] md:max-w-[90%] lg:max-w-[1100px] flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-12 px-2 sm:px-4 md:px-6 lg:px-0"
          initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Countdown Timer with Integrated Progress */}
          <div className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-5 md:p-6 lg:p-8 animate-pulse-glow">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Timer Display */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                
                {/* Days - Featured */}
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <span className="time-label time-label-large text-[10px] sm:text-xs">Days</span>
              <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                {daysDigits.map((digit, index) => (
                  <FlipDigit 
                    key={`day-${index}`} 
                    digit={digit} 
                    prevDigit={prevDaysDigits[index] || '0'}
                  />
                ))}
              </div>
            </div>

                {/* Vertical Divider on Desktop */}
                <div className="hidden lg:block w-px h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Hours : Minutes */}
                <div className="flex items-end gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  <TimeUnit 
                    label="Hours" 
                    digits={hoursDigits} 
                    prevDigits={prevHoursDigits} 
                    prefix="hour" 
                  />
                  
                  {/* Separator */}
                  <div className="flex flex-col justify-center pb-[26px] sm:pb-[32px] md:pb-[38px] lg:pb-[46px]">
                    <motion.div 
                      className="flex flex-col items-center gap-1 sm:gap-1.5"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-[#94b5ff] rounded-full shadow-[0_0_6px_rgba(149,181,255,0.5)]" />
                      <div className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] bg-[#94b5ff] rounded-full shadow-[0_0_6px_rgba(149,181,255,0.5)]" />
                    </motion.div>
          </div>

                  <TimeUnit 
                    label="Minutes" 
                    digits={minutesDigits} 
                    prevDigits={prevMinutesDigits} 
                    prefix="minute" 
                  />
                </div>
              </div>
              
              {/* Progress Bar - Scaled for visibility */}
              <div className="flex flex-col gap-2 pt-3 sm:pt-4 border-t border-white/[0.06]">
                
                {/* Progress Track with Scaled Display */}
                <div className="relative w-full flex items-center gap-2">
                  {/* Start Marker */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#94b5ff]/40" />
                  
                  {/* Track */}
                  <div className="flex-1 relative h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
                    {/* Progress Fill - Uses scaled progress for visibility */}
                    <motion.div 
                      className="absolute top-0 left-0 h-full rounded-l-full"
                      style={{ 
                        width: `${scaledProgress}%`,
                        background: 'linear-gradient(90deg, #94b5ff 0%, #7da3ff 100%)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${scaledProgress}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                    {/* Remaining portion - always visible with subtle highlight */}
                    <div 
                      className="absolute top-0 right-0 h-full rounded-r-full"
                      style={{ 
                        width: `${100 - scaledProgress}%`,
                        background: 'linear-gradient(90deg, rgba(148,181,255,0.15) 0%, rgba(148,181,255,0.25) 100%)',
                      }}
                    />
                  </div>
                  
                  {/* End Marker (Target) - Glowing */}
                  <div 
                    className="w-2 h-2 rounded-full bg-[#94b5ff]"
                    style={{ boxShadow: '0 0 8px rgba(149,181,255,0.6), 0 0 12px rgba(149,181,255,0.3)' }}
                  />
                </div>
                
                {/* Progress Label + Estimated Date - Integrated */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                  {/* Progress Stats */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span 
                      className="text-[#94b5ff] text-[10px] sm:text-xs font-medium tracking-wide"
                      style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                    >
                      {progressPercent}% complete
                    </span>
                    <span className="text-white/20">|</span>
                    <span 
                      className="text-white/40 text-[10px] sm:text-xs tracking-wide"
                      style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                    >
                      {blocksRemaining.toLocaleString()} blocks remaining
                    </span>
                  </div>
                  
                  {/* Estimated Date - Integrated */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span 
                      className="text-white/40 text-[10px] sm:text-xs tracking-wide"
                      style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                    >
                      Est.
                    </span>
                    <span 
                      className="text-white text-[10px] sm:text-xs font-medium tracking-wide"
                      style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                    >
                      {blockchainData?.estimatedHalvingDate || "Loading..."}, {blockchainData?.estimatedHalvingTime || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block Stats - Two Point Markers */}
          <motion.div 
            className="glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Current Block */}
              <div className="flex flex-col items-start gap-0.5">
                <span 
                  className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}
                >
                  {blockchainData?.currentBlockFormatted || "Loading..."}
                </span>
                <span 
                  className="text-white/40 text-[10px] sm:text-xs tracking-wide uppercase"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  Current Block
                </span>
              </div>
              
              {/* Arrow Indicator */}
              <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="h-[1px] w-6 sm:w-10 md:w-16 bg-gradient-to-r from-white/20 to-[#94b5ff]/50" />
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#94b5ff]" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <div className="h-[1px] w-6 sm:w-10 md:w-16 bg-gradient-to-r from-[#94b5ff]/50 to-white/20" />
                </div>
              </div>

              {/* Halving Block */}
              <div className="flex flex-col items-end gap-0.5">
                <span 
                  className="text-[#94b5ff] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}
                >
                  {blockchainData?.nextHalvingBlockFormatted || "2,102,400"}
                </span>
                <span 
                  className="text-white/40 text-[10px] sm:text-xs tracking-wide uppercase"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  Halving Block
                </span>
              </div>
            </div>
          </motion.div>

          {/* What is ELA Halving Section */}
          <motion.section 
            className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Visual + Title */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
              {/* Halved Coin Image */}
              <motion.img
                src="/figmaAssets/elastos-halved.png"
                alt="Elastos Halved Coin"
                className="w-[160px] sm:w-[220px] md:w-[280px] lg:w-[320px] h-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              />
              
              {/* Title */}
              <h2 
                className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-center font-light text-white tracking-tight"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                What is Elastos (ELA) Halving?
              </h2>
              
              {/* Description */}
              <p 
                className="text-white/50 text-xs sm:text-sm md:text-base text-center max-w-[550px] leading-relaxed px-2"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                ELA halving reduces the block reward by 50%, decreasing new coin supply and increasing scarcity, mirroring Bitcoin's deflationary model.
              </p>
            </div>

            {/* Key Stats Grid - DYNAMIC */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              {/* Current Reward */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center">
                <div 
                  className="text-white/40 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mb-1 sm:mb-2"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  Current Reward
                </div>
                <div 
                  className="text-[#94b5ff] text-lg sm:text-2xl md:text-3xl font-medium"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}
                >
                  {blockchainData?.currentRewardFormatted || "1.522"}
                </div>
                <div 
                  className="text-white/30 text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  ELA / block
                </div>
              </div>

              {/* After Halving */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center">
                <div 
                  className="text-white/40 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mb-1 sm:mb-2"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  After Halving
                </div>
                <div 
                  className="text-[#94b5ff] text-lg sm:text-2xl md:text-3xl font-medium"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}
                >
                  {blockchainData?.afterHalvingRewardFormatted || "0.761"}
                </div>
                <div 
                  className="text-white/30 text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  ELA / block
                </div>
              </div>

              {/* Max Supply */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center">
                <div 
                  className="text-white/40 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mb-1 sm:mb-2"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  Max Supply
                </div>
                <div 
                  className="text-[#94b5ff] text-lg sm:text-2xl md:text-3xl font-medium"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}
                >
                  28.22M
                </div>
                <div 
                  className="text-white/30 text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  ELA (capped)
                </div>
              </div>
            </div>

            {/* Reward Distribution */}
            <div className="mb-6 sm:mb-8">
              <div 
                className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider text-center mb-3 sm:mb-4"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                Reward Distribution
          </div>
              
              {/* Distribution Bar */}
              <div className="flex rounded-full overflow-hidden h-2 sm:h-3 mb-2 sm:mb-3">
                <div className="bg-[#f7931a] w-[35%]" title="BTC Miners" />
                <div className="bg-[#94b5ff] w-[35%]" title="BPoS Validators" />
                <div className="bg-[#5c8ae6] w-[30%]" title="DAO Treasury" />
        </div>

              {/* Distribution Labels */}
              <div className="flex justify-between text-[9px] sm:text-xs gap-1">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#f7931a] flex-shrink-0" />
                  <span className="text-white/50" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    <span className="hidden sm:inline">35% </span>BTC Miners
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#94b5ff] flex-shrink-0" />
                  <span className="text-white/50" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    <span className="hidden sm:inline">35% </span>BPoS Validators
          </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#5c8ae6] flex-shrink-0" />
                  <span className="text-white/50" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    <span className="hidden sm:inline">30% </span>DAO Treasury
          </span>
                </div>
              </div>
        </div>

            {/* Footer Note */}
            <div className="text-center pt-3 sm:pt-4 border-t border-white/[0.06]">
              <p 
                className="text-white/40 text-[10px] sm:text-xs"
                style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
              >
                Halving every <span className="text-white/60">{FIXED_DATA.halvingInterval} blocks</span> (~4 years) | Secured by Bitcoin
              </p>
            </div>
          </motion.section>

          {/* SECTION 2: Halving Schedule Table */}
          <motion.section 
            className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section Title */}
            <h2 
              className="text-[18px] sm:text-[22px] md:text-[26px] text-center font-light text-white tracking-tight mb-2"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Halving Schedule
            </h2>
            <p 
              className="text-white/40 text-[10px] sm:text-xs md:text-sm text-center mb-5 sm:mb-8 max-w-[500px] mx-auto"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Complete timeline of ELA block reward halvings
            </p>

            {/* Dynamic Halving Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium py-2 sm:py-3 px-2 sm:px-3" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                      Halving
                    </th>
                    <th className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium py-2 sm:py-3 px-2 sm:px-3" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                      Block Height
                    </th>
                    <th className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium py-2 sm:py-3 px-2 sm:px-3" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                      Est. Date
                    </th>
                    <th className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium py-2 sm:py-3 px-2 sm:px-3 text-right" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                      Block Reward
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dynamic halving rows */}
                  {[
                    { num: 1, ordinal: '1st', block: 1051200, date: 'Dec 2021', reward: '1.522' },
                    { num: 2, ordinal: '2nd', block: 2102400, date: 'Dec 2025', reward: '0.761' },
                    { num: 3, ordinal: '3rd', block: 3153600, date: '~Dec 2029', reward: '0.3805' },
                    { num: 4, ordinal: '4th', block: 4204800, date: '~Dec 2033', reward: '0.1903' },
                    { num: 5, ordinal: '5th', block: 5256000, date: '~Dec 2037', reward: '0.0951' },
                    { num: 6, ordinal: '6th', block: 6307200, date: '~Dec 2041', reward: '0.0476' },
                  ].map((halving) => {
                    const currentHalvingNum = (blockchainData?.halvingNumber || 1) + 1; // Next halving number
                    const isPast = halving.num < currentHalvingNum;
                    const isNext = halving.num === currentHalvingNum;
                    const isFuture = halving.num > currentHalvingNum;
                    
                    return (
                      <tr 
                        key={halving.num}
                        className={`border-b border-white/[0.04] ${isNext ? 'bg-[#94b5ff]/[0.05]' : ''}`}
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-3">
                          <span 
                            className={`text-xs sm:text-sm ${isNext ? 'text-[#94b5ff] font-medium' : isPast ? 'text-white/50' : 'text-white/30'}`}
                            style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                          >
                            {halving.ordinal}
                          </span>
                          {isNext && (
                            <span className="ml-1.5 text-[8px] sm:text-[9px] text-[#94b5ff]/70 uppercase tracking-wider">Next</span>
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3">
                          <span className={`text-xs sm:text-sm font-mono ${isNext ? 'text-white' : isPast ? 'text-white/50' : 'text-white/30'}`}>
                            {halving.block.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3">
                          <span 
                            className={`text-xs sm:text-sm ${isNext ? 'text-white' : isPast ? 'text-white/50' : 'text-white/30'}`}
                            style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                          >
                            {isNext ? (blockchainData?.estimatedHalvingDate || halving.date) : halving.date}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                          <span 
                            className={`text-xs sm:text-sm ${isNext ? 'text-[#94b5ff] font-medium' : isPast ? 'text-white/50' : 'text-white/30'}`}
                            style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                          >
                            {halving.reward} ELA
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* More halvings indicator */}
                  <tr>
                    <td colSpan={4} className="py-3 sm:py-4 text-center">
                      <span className="text-white/20 text-[10px] sm:text-xs" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                        Continues until max supply of 28,219,999 ELA is reached (~2105)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* SECTION 3: Halving Timeline (Visual) */}
          <motion.section 
            className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section Title */}
            <h2 
              className="text-[18px] sm:text-[22px] md:text-[26px] text-center font-light text-white tracking-tight mb-6 sm:mb-8 md:mb-10"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Halving Timeline
            </h2>

            {/* Timeline */}
            <div className="relative px-2 sm:px-4">
              {/* Timeline Events */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3 md:gap-2 relative">
                
                {/* Timeline Line - Centered with circles, connects between them */}
                <div className="absolute top-[28px] sm:top-[36px] h-[2px] bg-white/[0.08] hidden md:block" 
                     style={{ left: 'calc(12.5% + 24px)', right: 'calc(12.5% + 24px)' }} />
                <div className="absolute top-[28px] sm:top-[36px] h-[2px] bg-gradient-to-r from-[#94b5ff] to-[#7da3ff] hidden md:block"
                     style={{ left: 'calc(12.5% + 24px)', width: 'calc(50% - 24px)' }} />
                
                {/* 2020 - Burn */}
                <div className="flex flex-col items-center text-center p-2 sm:p-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff6b6b]/20 border-2 border-[#ff6b6b] flex items-center justify-center mb-2 sm:mb-3 relative z-10 bg-[#141414]">
                    <span className="text-[#ff6b6b]"><FlameIcon /></span>
                  </div>
                  <div className="text-[#94b5ff] text-[10px] sm:text-xs font-medium mb-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    July 2020
                  </div>
                  <div className="text-white text-sm sm:text-base font-medium mb-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    13M ELA Burned
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Supply reset to ~20M
                  </div>
                </div>

                {/* 2021 - First Halving */}
                <div className="flex flex-col items-center text-center p-2 sm:p-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 relative z-10 ${
                    nextHalvingNumber === 1 
                      ? 'bg-[#94b5ff] shadow-[0_0_20px_rgba(149,181,255,0.5)]' 
                      : 'bg-[#141414] border-2 border-white/20'
                  }`}>
                    <span className={`text-xs sm:text-sm font-bold ${nextHalvingNumber === 1 ? 'text-[#141414]' : 'text-white/50'}`}>1st</span>
                  </div>
                  <div className={`text-[10px] sm:text-xs font-medium mb-0.5 ${nextHalvingNumber === 1 ? 'text-[#94b5ff]' : 'text-white/40'}`} style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Dec 2021
                  </div>
                  <div className={`text-sm sm:text-base font-medium mb-0.5 ${nextHalvingNumber === 1 ? 'text-white' : 'text-white/50'}`} style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    First Halving
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Block 1,051,200
                  </div>
                </div>

                {/* 2025 - Second Halving */}
                <div className="flex flex-col items-center text-center p-2 sm:p-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 relative z-10 ${
                    nextHalvingNumber === 2 
                      ? 'bg-[#94b5ff] shadow-[0_0_20px_rgba(149,181,255,0.5)]' 
                      : nextHalvingNumber > 2 
                        ? 'bg-[#141414] border-2 border-white/20' 
                        : 'bg-[#141414] border-2 border-[#94b5ff]'
                  }`}>
                    <span className={`text-xs sm:text-sm font-bold ${
                      nextHalvingNumber === 2 ? 'text-[#141414]' : nextHalvingNumber > 2 ? 'text-white/50' : 'text-[#94b5ff]'
                    }`}>2nd</span>
                  </div>
                  <div className={`text-[10px] sm:text-xs font-medium mb-0.5 ${nextHalvingNumber === 2 ? 'text-[#94b5ff]' : 'text-white/40'}`} style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    {nextHalvingNumber === 2 ? (blockchainData?.estimatedHalvingDate || '~Dec 2025') : '~Dec 2025'}
                  </div>
                  <div className={`text-sm sm:text-base font-medium mb-0.5 ${nextHalvingNumber === 2 ? 'text-white' : 'text-white/50'}`} style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Second Halving
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Block 2,102,400
                  </div>
                </div>

                {/* 2105 - Final */}
                <div className="flex flex-col items-center text-center p-2 sm:p-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center mb-2 sm:mb-3 relative z-10">
                    <span className="text-white/40"><InfinityIcon /></span>
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs font-medium mb-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    ~2105
                  </div>
                  <div className="text-white/60 text-sm sm:text-base font-medium mb-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Final ELA Mined
                  </div>
                  <div className="text-white/40 text-[10px] sm:text-xs" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Max supply reached
                  </div>
                </div>
              </div>
            </div>

            {/* Reward Changes - DYNAMIC */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.06]">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-white/40 text-[9px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Pre-{firstHalvingYear}
                  </div>
                  <div className="text-white/60 text-sm sm:text-lg font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    ~5 ELA/block
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-[9px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    {currentEraStart}-{currentEraEnd}
                  </div>
                  <div className="text-white text-sm sm:text-lg font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    {blockchainData?.currentRewardFormatted || "1.522"} ELA/block
                  </div>
                </div>
                <div>
                  <div className="text-[#94b5ff] text-[9px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    After {currentEraEnd}
                  </div>
                  <div className="text-[#94b5ff] text-sm sm:text-lg font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    {blockchainData?.afterHalvingRewardFormatted || "0.761"} ELA/block
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 4: Supply Mechanics */}
          <motion.section 
            className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section Title */}
            <h2 
              className="text-[18px] sm:text-[22px] md:text-[26px] text-center font-light text-white tracking-tight mb-2"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Supply Mechanics
            </h2>
            <p 
              className="text-white/40 text-[10px] sm:text-xs md:text-sm text-center mb-5 sm:mb-8 max-w-[450px] mx-auto"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              A fixed supply model established through the 2020 token burn
            </p>

            {/* Supply Stats Grid - DYNAMIC */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6">
              {/* Max Supply */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Max Supply
                </div>
                <div className="text-[#94b5ff] text-lg sm:text-xl md:text-2xl font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                  28.22M
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Hard cap forever
                </div>
              </div>

              {/* Circulating */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Circulating
                </div>
                <div className="text-white text-lg sm:text-xl md:text-2xl font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                  {blockchainData?.circulatingSupplyFormatted || "~26M"}
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  {issuedPercent}% issued
                </div>
              </div>

              {/* Burned */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Burned
                </div>
                <div className="text-[#ff6b6b] text-lg sm:text-xl md:text-2xl font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                  13M
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  July 30, 2020
                </div>
              </div>

              {/* Remaining */}
              <div className="glass-panel-accent rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  To Be Mined
                </div>
                <div className="text-white/60 text-lg sm:text-xl md:text-2xl font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                  {blockchainData?.remainingToMineFormatted || "~2.1M"}
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Over next ~{yearsRemaining} years
                </div>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="bg-white/[0.03] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
              <div className="text-white/40 text-[9px] sm:text-xs uppercase tracking-wider text-center mb-3" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                Annual Inflation Rate
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
                <div className="text-center">
                  <div className={`text-[9px] sm:text-xs mb-0.5 ${currentHalvingNumber === 0 ? 'text-[#94b5ff]' : 'text-white/40'}`}>Initial</div>
                  <div className={`text-sm sm:text-lg font-medium ${currentHalvingNumber === 0 ? 'text-[#94b5ff]' : 'text-white/60'}`}>~4%</div>
                </div>
                <span className="text-white/20"><ArrowRightIcon /></span>
                <div className="text-center">
                  <div className={`text-[9px] sm:text-xs mb-0.5 ${currentHalvingNumber === 1 ? 'text-[#94b5ff]' : 'text-white/40'}`}>After 1st</div>
                  <div className={`text-sm sm:text-lg font-medium ${currentHalvingNumber === 1 ? 'text-[#94b5ff]' : 'text-white'}`}>~2%</div>
                </div>
                <span className="text-white/20"><ArrowRightIcon /></span>
                <div className="text-center">
                  <div className={`text-[9px] sm:text-xs mb-0.5 ${currentHalvingNumber === 2 ? 'text-[#94b5ff]' : nextHalvingNumber === 2 ? 'text-[#94b5ff]/70' : 'text-white/40'}`}>After 2nd</div>
                  <div className={`text-sm sm:text-lg font-medium ${currentHalvingNumber === 2 ? 'text-[#94b5ff]' : nextHalvingNumber === 2 ? 'text-[#94b5ff]' : 'text-white/60'}`}>~1%</div>
                </div>
                <span className="text-white/20"><ArrowRightIcon /></span>
                <div className="text-center">
                  <div className="text-white/40 text-[9px] sm:text-xs mb-0.5">By 2105</div>
                  <div className="text-white/40 text-sm sm:text-lg font-medium">0%</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 5: Network & Security */}
          <motion.section 
            className="glass-panel rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section Title */}
            <h2 
              className="text-[18px] sm:text-[22px] md:text-[26px] text-center font-light text-white tracking-tight mb-2"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Network & Security
            </h2>
            <p 
              className="text-white/40 text-[10px] sm:text-xs md:text-sm text-center mb-5 sm:mb-8 max-w-[450px] mx-auto"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              Enterprise-grade infrastructure secured by Bitcoin
            </p>

            {/* Network Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-5 sm:mb-6">
              {/* Consensus */}
              <div className="bg-white/[0.03] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/[0.06]">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Consensus
                </div>
                <div className="text-white text-[10px] sm:text-xs font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  AuxPoW + BPoS + PoI
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Hybrid model
                </div>
              </div>

              {/* Block Time */}
              <div className="bg-white/[0.03] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/[0.06]">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Block Time
                </div>
                <div className="text-[#94b5ff] text-lg sm:text-xl font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  {FIXED_DATA.blockTime}
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Average
                </div>
              </div>

              {/* Halving Interval */}
              <div className="bg-white/[0.03] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/[0.06]">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Halving Interval
                </div>
                <div className="text-white text-xs sm:text-sm font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif", fontVariantNumeric: 'tabular-nums' }}>
                  {FIXED_DATA.halvingInterval}
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  blocks (~4 years)
                </div>
        </div>

              {/* Security */}
              <div className="bg-white/[0.03] rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/[0.06]">
                <div className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-2" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Security
                </div>
                <div className="text-[#f7931a] text-xs sm:text-sm font-medium" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Bitcoin Merged
                </div>
                <div className="text-white/30 text-[9px] sm:text-[10px] mt-0.5" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                  Mining (AuxPoW)
                </div>
              </div>
            </div>

            {/* Bitcoin Security Note */}
            <div className="bg-gradient-to-r from-[#f7931a]/10 to-transparent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-[#f7931a]/20">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f7931a]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#f7931a]"><BitcoinIcon /></span>
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs sm:text-sm font-medium mb-0.5 sm:mb-1" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Secured by Bitcoin Hashpower
                  </div>
                  <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
                    Through merged mining, Elastos leverages Bitcoin's massive hashpower for security, giving ELA similar long-term supply dynamics while utilizing the most secure blockchain network.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

      </motion.div>

        {/* Footer */}
        <footer className="mt-auto pt-8 sm:pt-10 pb-6 sm:pb-8 w-full">
          <div className="w-full max-w-[98%] sm:max-w-[94%] md:max-w-[90%] lg:max-w-[1100px] mx-auto px-3 sm:px-4">
            {/* Disclaimer */}
            <p 
              className="text-white/25 text-[10px] sm:text-[11px] text-center leading-relaxed mb-5 sm:mb-6 max-w-[600px] mx-auto"
              style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
            >
              This website is operated by Elastos DAO for informational purposes only. Content is provided as-is without warranties or guarantees of accuracy or completeness.
            </p>
            
            {/* Divider */}
            <div className="border-t border-white/[0.06] pt-5 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Copyright */}
                <span 
                  className="text-white/30 text-[11px] sm:text-xs order-2 sm:order-1"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  {currentYear} Elastos
                </span>
                
                {/* Social Links */}
                <div className="flex items-center gap-5 order-1 sm:order-2">
                  <a href="https://elastos.net" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors" title="Website">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </a>
                  <a href="https://x.com/ElastosInfo" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors" title="X">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://t.me/elastosgroup" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors" title="Telegram">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </a>
                  <a href="https://github.com/elastos" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors" title="GitHub">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@elastosinfo" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors" title="YouTube">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
            </div>

                {/* Website Link */}
                <a 
                  href="https://elastos.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-white/50 text-[11px] sm:text-xs transition-colors order-3"
                  style={{ fontFamily: "'Geist', system-ui, sans-serif" }}
                >
                  elastos.net
                </a>
              </div>
            </div>
          </div>
        </footer>
        </div>
    </div>
  );
};
