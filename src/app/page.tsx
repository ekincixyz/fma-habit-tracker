'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import StreakBadge from '@/components/StreakBadge';
import ContributionGrid from '@/components/ContributionGrid';
import AddEntryButton from '@/components/AddEntryButton';
import EntryModal from '@/components/EntryModal';
import ActivityList from '@/components/ActivityList';
import BottomMenuBar from '@/components/BottomMenuBar';

interface Activity {
  id: string;
  text: string;
  date: string;
  imageUrl?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Load activities from localStorage on initial load
  useEffect(() => {
    const savedActivities = localStorage.getItem('habitActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('habitActivities', JSON.stringify(activities));
    }
  }, [activities]);

  const handleSaveEntry = async (data: { text: string; image?: File }) => {
    try {
      setIsSubmitting(true);
      
      // Prepare image upload if needed
      let imageUrl: string | undefined = undefined;
      if (data.image) {
        // For this simplified version, we'll just create a local object URL
        // In a real app, you'd upload to a storage service
        imageUrl = URL.createObjectURL(data.image);
      }

      // In a real app, you would post to a server endpoint
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new activity without posting to Farcaster
      const newActivity = {
        id: Date.now().toString(),
        text: data.text,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imageUrl
      };

      // Add the new activity to our list
      setActivities(prev => [newActivity, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate streak - consecutive weeks with entries
  const calculateStreak = () => {
    if (activities.length === 0) return 0;
    
    // Sort activities by date in descending order
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Group activities by week
    const weekMap = new Map<string, boolean>();
    
    sortedActivities.forEach(activity => {
      const date = new Date(activity.date);
      // Get the week number (Sunday-based)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Set to Sunday
      weekStart.setHours(0, 0, 0, 0);
      const weekKey = weekStart.toISOString().split('T')[0];
      weekMap.set(weekKey, true);
    });

    // Convert weeks to array and sort
    const weeks = Array.from(weekMap.keys()).sort().reverse();
    
    if (weeks.length === 0) return 0;
    
    let streak = 1;
    let currentWeek = new Date(weeks[0]);
    
    for (let i = 1; i < weeks.length; i++) {
      const prevWeek = new Date(weeks[i]);
      const diffWeeks = Math.round(
        (currentWeek.getTime() - prevWeek.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      
      if (diffWeeks === 1) {
        streak++;
        currentWeek = prevWeek;
      } else if (diffWeeks > 1) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <main className="min-h-screen bg-[#050709] px-4 py-6 pb-24 max-w-2xl mx-auto">
      <Header />
      
      {activeTab === 'home' && (
        <div className="mb-16">
          <StreakBadge streak={streak} />
          <ContributionGrid
            activities={activities.map(a => ({
              date: a.date,
              completed: true,
            }))}
          />
        </div>
      )}
      
      {activeTab === 'activities' && (
        <div className="mt-4 mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Activities</h2>
          <ActivityList activities={activities} />
        </div>
      )}
      
      <AddEntryButton onClick={() => setIsModalOpen(true)} />
      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        isSubmitting={isSubmitting}
      />
      <BottomMenuBar activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
