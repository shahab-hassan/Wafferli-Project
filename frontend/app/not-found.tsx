"use client";

import './globals.css';
import './[locale]/globals.css';  

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ComingSoon404: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Animated dots for "Coming Soon"
    const dotInterval = setInterval(() => {
      setDotCount(prev => prev >= 3 ? 1 : prev + 1);
    }, 800);

    // Animated progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return 0;
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(147, 51, 234, 0.05) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(236, 72, 153, 0.05) 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px',
               animation: 'gridMove 20s linear infinite'
             }} />
      </div>
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Animated 404 with glitch effect */}
          <div className="mb-16 relative">
            <div className="relative inline-block">
              <h1 className="text-8xl md:text-9xl font-extralight text-gray-700 relative z-10 transition-all duration-500 hover:text-gray-200">
                404
              </h1>
              {/* Glitch layers */}
              <h1 className="absolute inset-0 text-8xl md:text-9xl font-extralight text-purple-200 opacity-30 animate-pulse"
                  style={{ animation: 'glitch-1 2s infinite' }}>
                404
              </h1>
              <h1 className="absolute inset-0 text-8xl md:text-9xl font-extralight text-pink-200 opacity-20"
                  style={{ animation: 'glitch-2 3s infinite' }}>
                404
              </h1>
            </div>
            
            {/* Animated line with gradient */}
            <div className="relative mt-6">
              <div className="w-32 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mx-auto overflow-hidden">
                <div className="h-full w-8 bg-white opacity-60 animate-slide"></div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="space-y-10">
            
            {/* Coming Soon with typewriter effect */}
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
                <span className="inline-block animate-fadeInUp">Coming</span>
                <span className="inline-block animate-fadeInUp ml-3" style={{ animationDelay: '0.3s' }}>Soon</span>
                <span className="text-purple-500 ml-2">
                  {'.'.repeat(dotCount)}
                  <span className="opacity-0">{'.'.repeat(3 - dotCount)}</span>
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto animate-fadeInUp" 
                 style={{ animationDelay: '0.6s' }}>
                We're crafting something extraordinary. 
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent font-medium">
                  {' '}Stay tuned.
                </span>
              </p>
            </div>

            {/* Enhanced progress section */}
            <div className="max-w-sm mx-auto animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Building</span>
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-2 rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                       
              </div>
            </div>

            {/* Futuristic rounded buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fadeInUp" 
                 style={{ animationDelay: '1.2s' }}>
              
              <Link href='/'>
              <button className="group relative px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-medium rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-300/40 hover:scale-105 transform">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Go Home</span>
                  <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </span>
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200"></div>
              </button>
              </Link>
            </div>

          </div>

          {/* Enhanced footer */}
          <div className="mt-20 animate-fadeInUp" style={{ animationDelay: '1.5s' }}>
            <p className="text-sm text-gray-400 mb-6">Follow our journey</p>
            <div className="flex justify-center space-x-6">
              {['purple', 'pink', 'yellow'].map((color, i) => (
                <div key={i} 
                     className={`group w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-${color}-50 hover:shadow-lg hover:shadow-${color}-200/50 hover:scale-110 hover:-translate-y-1`}>
                  <div className={`w-5 h-5 bg-gray-400 group-hover:bg-${color}-500 transition-all duration-300 ${i === 0 ? 'rounded-full' : i === 1 ? 'rounded-sm' : 'rounded'}`}>
                    <div className="w-full h-full bg-current opacity-0 group-hover:opacity-20 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, 2px); }
          45% { transform: translate(1px, 1px); }
          60% { transform: translate(-2px, 1px); }
          75% { transform: translate(2px, -1px); }
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        .animate-slide {
          animation: slide 2s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon404;