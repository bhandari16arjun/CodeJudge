import React from 'react';
import { cn } from '@/lib/utils';

const CircularProgress = ({
  solved,
  total,
  attempting = 0,
  size = 120,
  strokeWidth = 10,     
  className
}) => {
 
  const radius = (size - strokeWidth - 30) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? solved / total : 0;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"   
          viewBox={`0 0 ${size} ${size}`}
        >
          
          <circle
            cx={size/2} cy={size/2} r={radius}
            stroke="#374151" strokeWidth={strokeWidth}
            fill="none"
          />

         
          <circle
            cx={size/2} cy={size/2} r={radius}
            stroke="url(#grad)" strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          <defs>
            <linearGradient
              id="grad"
              gradientUnits="userSpaceOnUse"
              x1="0"   y1={-radius}
              x2="0"   y2={radius}
              gradientTransform={`translate(${size/2},${size/2}) rotate(90)`}
            >
              <stop offset="0%"   stopColor="#dc2626" /> 
              <stop offset="50%"  stopColor="#fbbf24" /> 
              <stop offset="100%" stopColor="#34d399" /> 
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white">{solved}</div>
          <div className="text-sm text-gray-400 -mt-1">/{total}</div>
          <div className="text-sm text-green-500 mt-1">Solved</div>
        </div>
      </div>

      {attempting > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" />
          <span>{attempting} Attempting</span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
