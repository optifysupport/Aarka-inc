import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBg from '../../assets/hero.png';

interface HeroSectionProps {
  onShopNow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow }) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[520px] md:h-[500px] bg-[#e4362b] overflow-hidden flex items-center py-12 md:py-0"
    >
      {/* Panel 1 (Top / Left): Light Gray */}
      <div className="absolute inset-0 bg-[#e5e5e5] w-full md:w-[35%] h-[40%] md:h-full transform -skew-y-3 md:skew-y-0 md:-skew-x-12 md:-ml-20 z-0"></div>

      {/* Panel 2 (Middle Band): Red Stripe */}
      <div className="absolute inset-0 bg-[#e4362b] w-full md:w-[45%] h-[40%] md:h-full transform -skew-y-3 md:skew-y-0 md:-skew-x-12 md:ml-[20%] z-10"></div>

      {/* Panel 3 (Bottom / Right): Light Gray */}
      <div className="absolute inset-0 bg-[#e5e5e5] w-full md:w-[50%] h-[50%] md:h-full top-auto bottom-0 md:top-0 transform -skew-y-3 md:skew-y-0 md:-skew-x-12 md:ml-[55%] z-0"></div>

      {/* Hero Content Overlay */}
      <div className="relative max-w-[1440px] mx-auto w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 gap-8 md:gap-4 z-20 pt-16 md:pt-0">
        {/* Left Text */}
        <div className="text-white text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Industrial & Architectural</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-8 uppercase tracking-tight drop-shadow-md">
            MODERN LIGHTING
          </h1>

          {/* Animated Solid Red Shop Now Button with Shimmer & Arrow Slide */}
          <button
            onClick={onShopNow}
            className="group relative overflow-hidden rounded-full font-extrabold text-sm sm:text-base uppercase tracking-wider px-8 py-3.5 sm:px-9 sm:py-4 bg-[#e4362b] hover:bg-[#b81f15] text-white border-2 border-white transition-all duration-300 ease-out shadow-lg hover:shadow-[0_0_30px_rgba(228,54,43,0.7),0_0_15px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
          >
            {/* Shimmer Light Glare Sweep on Hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out pointer-events-none"></span>

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-2.5 text-white font-black tracking-widest drop-shadow">
              <span>SHOP NOW</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
            </span>
          </button>
        </div>

        {/* Right Watch/Lighting Display */}
        <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] bg-white rounded-full flex items-center justify-center shadow-2xl relative shrink-0">
          <img
            src={heroBg}
            alt="Modern Lighting"
            className="w-36 h-36 sm:w-48 sm:h-48 md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[300px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};