import { useState } from 'react';

interface BottomMenuBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomMenuBar({ activeTab, onTabChange }: BottomMenuBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0D1116] border-t border-[#30363d] h-16 flex items-center justify-around z-10">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center w-1/2 h-full ${
          activeTab === 'home' ? 'text-white' : 'text-gray-400'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 mb-1"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        <span className="text-xs">Home</span>
      </button>
      
      <button
        onClick={() => onTabChange('activities')}
        className={`flex flex-col items-center justify-center w-1/2 h-full ${
          activeTab === 'activities' ? 'text-white' : 'text-gray-400'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-6 h-6 mb-1"
        >
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
        <span className="text-xs">Activities</span>
      </button>
    </div>
  );
} 