import { useMemo, useState, useEffect, useRef } from 'react';

interface ContributionGridProps {
  activities: {
    date: string;
    completed: boolean;
  }[];
}

export default function ContributionGrid({ activities }: ContributionGridProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  // Initialize the start date on first load (from localStorage or use today)
  useEffect(() => {
    const savedStartDate = localStorage.getItem('habitStartDate');
    if (savedStartDate) {
      setStartDate(new Date(savedStartDate));
    } else {
      // First time user - save today as the start date
      const today = new Date();
      localStorage.setItem('habitStartDate', today.toISOString());
      setStartDate(today);
    }
  }, []);

  // Today's date for highlighting
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const days = useMemo(() => {
    const grid = [];
    
    // Create end date that's 90 days from today
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 90);
    
    // Start from Monday of the current week (index 0 for Monday)
    const startOfWeek = new Date();
    // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dayOfWeek = startOfWeek.getDay();
    // Adjust for Monday as first day (0 = Monday, ..., 6 = Sunday)
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Go back to last Monday
    
    // We'll create a grid of weeks (rows) and days (columns)
    let currentDate = new Date(startOfWeek);
    
    // Create weeks (about 13 weeks for 90 days)
    while (currentDate <= endDate) {
      const week = [];
      
      // Create days in the week (7 days, starting with Monday)
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      grid.push(week);
    }
    
    return grid;
  }, []);

  // Day name constants for Monday-Sunday (only display some)
  const fullDayLabels = [
    { key: 'mon', display: 'Mon', visible: true },
    { key: 'tue', display: 'Tue', visible: false },
    { key: 'wed', display: 'Wed', visible: true },
    { key: 'thu', display: 'Thu', visible: false },
    { key: 'fri', display: 'Fri', visible: true },
    { key: 'sat', display: 'Sat', visible: false },
    { key: 'sun', display: 'Sun', visible: true },
  ];

  const getActivityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return activities.find(a => a.date === dateStr)?.completed || false;
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Format date for tooltip display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-[#0D1116] rounded-lg p-4 overflow-x-auto">
      {/* Main grid container - with improved day label alignment */}
      <div className="grid grid-cols-[auto_1fr] gap-2">
        {/* Day labels column */}
        <div className="flex flex-col" style={{ gap: "3px" }}>
          {fullDayLabels.map((day, index) => (
            <div 
              key={day.key} 
              className="text-xs text-gray-400 h-5 flex items-center justify-end"
            >
              {day.visible ? day.display : ''}
            </div>
          ))}
        </div>
        
        {/* Grid cells */}
        <div className="relative" ref={gridRef}>
          <div className="grid grid-flow-col" style={{ gap: "3px" }}>
            {days.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-flow-row" style={{ gap: "3px" }}>
                {week.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const hasActivity = getActivityForDate(date);
                  const isToday = dateStr === todayStr;
                  const dayName = getDayName(date);
                  // Check if this is the first day of a month for highlighting
                  const isFirstDayOfMonth = date.getDate() === 1;
                  
                  return (
                    <div
                      key={dateStr}
                      className={`h-5 w-5 rounded-sm ${
                        hasActivity
                          ? 'bg-[#018A08] hover:bg-[#04a60c]'
                          : isToday
                          ? 'bg-[#161B22] hover:bg-[#1f2631]'
                          : isFirstDayOfMonth
                          ? 'bg-[#222933] hover:bg-[#2a3441]' // Slightly highlight first day of month
                          : 'bg-[#161B22] hover:bg-[#1f2631]'
                      } relative cursor-pointer`}
                      title={`${dayName}, ${formatDate(date)}`}
                      onMouseEnter={() => setHoveredDay(dateStr)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {hoveredDay === dateStr && (
                        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-[#0D1116] text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-10 border border-[#30363d]">
                          <div>{formatDate(date)}</div>
                          <div>
                            {isToday 
                              ? 'Today' 
                              : hasActivity 
                                ? '1 contribution' 
                                : 'No contributions'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 