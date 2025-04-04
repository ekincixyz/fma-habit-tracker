interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  // Define the color to use for the text (we'll use gradient for hexagon)
  const textColor = streak === 0 ? "#6e6e6e" : "#4aac2b";
  
  return (
    <div className="bg-[#0D1116] rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Hexagon shape with gradient fill */}
          <svg
            className="w-16 h-16"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Define the gradient */}
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={streak === 0 ? "#6e6e6e" : "#5BC456"} />
                <stop offset="100%" stopColor={streak === 0 ? "#4a4a4a" : "#21941F"} />
              </linearGradient>
            </defs>
            
            <path
              d="M60 10C63 10 64.5 11 66 12L104.6 35C106.1 36 107.6 38 107.6 40V85C107.6 87 106.1 89 104.6 90L66 113C64.5 114 63 115 60 115C57 115 55.5 114 54 113L15.4 90C13.9 89 12.4 87 12.4 85V40C12.4 38 13.9 36 15.4 35L54 12C55.5 11 57 10 60 10Z"
              fill="transparent"
              stroke="url(#hexGradient)"
              strokeWidth="7"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full">
            <span className="font-bold text-2xl text-center" style={{ color: textColor }}>
              {streak}
            </span>
          </div>
        </div>
        <div className="flex-1">
          {/* First line - Bold white text - smaller size to match header */}
          <p className="text-white text-xl font-bold flex items-center gap-2">
            {streak === 0 ? (
              <>
                <span className="inline-block">🐣</span> Build your streak
              </>
            ) : (
              <>
                <span className="inline-block">🔥</span> {streak} week streak
              </>
            )}
          </p>
          
          {/* Divider line */}
          <div className="h-[1px] bg-gray-700 my-2 opacity-50"></div>
          
          {/* Second line - Light gray smaller text */}
          <p className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {streak === 0 
              ? "Log an entry to begin a new streak." 
              : "Congrats, you're on a roll. Keep going!"}
          </p>
        </div>
      </div>
    </div>
  );
} 